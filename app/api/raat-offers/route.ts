import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac, randomInt } from 'node:crypto'
import { z } from 'zod'
import { hasAdminSession } from '@/lib/admin-auth'
import { OFFER_DISCOUNTS } from '@/lib/offer-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const nameSchema = z.string().trim().min(2).max(100)

const spinSchema = z.object({
  request_key: z.string().uuid(),
  promoter_name: nameSchema,
  promoter_phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'),
  guest_names: z.array(nameSchema).length(10),
  consent: z.literal(true),
})

const statusSchema = z.enum([
  'pending',
  'contacted',
  'paid',
  'cancelled',
])

const updateSchema = z.object({
  id: z.string().uuid(),
  previous_status: statusSchema,
  status: statusSchema,
})

const offerResultSchema = z.object({
  id: z.string().uuid(),
  base_price: z.number().int(),
  discount: z.number().int(),
  price_per_person: z.number().int(),
  group_total: z.number().int(),
})

type DatabaseError = {
  code?: string
  message?: string
  hint?: string
}

function respond(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function logDatabaseError(operation: string, error: DatabaseError) {
  // Server logs only. Never log submitted form data or error.details.
  console.error(`[GROUP OFFERS] ${operation}`, {
    code: error.code,
    message: error.message,
    hint: error.hint,
  })
}

function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!url) {
    throw new Error('MISSING_NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!key) {
    throw new Error('MISSING_SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

async function readJson(request: NextRequest): Promise<unknown> {
  const limit = 8192
  const declared = Number(request.headers.get('content-length') || 0)

  if (declared > limit) {
    throw new Error('BODY_TOO_LARGE')
  }

  if (!request.body) {
    throw new Error('INVALID_JSON')
  }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      size += value.byteLength

      if (size > limit) {
        await reader.cancel()
        throw new Error('BODY_TOO_LARGE')
      }

      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('INVALID_JSON')
  }
}

function failure(error: unknown) {
  if (error instanceof z.ZodError) {
    return respond(
      {
        error: error.issues[0]?.message || 'Check your details.',
      },
      400,
    )
  }

  if (error instanceof Error) {
    if (error.message === 'BODY_TOO_LARGE') {
      return respond({ error: 'Request is too large.' }, 413)
    }

    if (error.message === 'INVALID_JSON') {
      return respond({ error: 'Invalid request.' }, 400)
    }
  }

  console.error(
    '[GROUP OFFERS] Server operation failed:',
    error instanceof Error ? error.message : 'Unknown error',
  )

  return respond(
    {
      error: 'Offers are unavailable. Please try again shortly.',
    },
    503,
  )
}

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action')

    if (action === 'config') {
      const { data, error } = await database()
        .from('raat_settings')
        .select('price, booking_open')
        .eq('id', 1)
        .single()

      if (error) {
        logDatabaseError('Loading offer settings failed', error)
        throw new Error('SETTINGS_FAILED')
      }

      if (!data) {
        throw new Error('SETTINGS_NOT_FOUND')
      }

      const price = Number(data.price)

      if (!Number.isSafeInteger(price) || price < 0) {
        throw new Error('INVALID_SETTINGS_PRICE')
      }

      return respond({
        base_price: price,
        enabled: data.booking_open === true && price > 200,
      })
    }

    if (action !== 'admin') {
      return respond({ error: 'Unknown request.' }, 404)
    }

    if (!(await hasAdminSession())) {
      return respond({ error: 'Please sign in as admin.' }, 401)
    }

    const { data, error } = await database()
      .from('raat_group_offers')
      .select(
        'id,promoter_name,promoter_phone,guest_names,base_price,discount,price_per_person,group_total,status,created_at,updated_at',
      )
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      logDatabaseError('Loading admin offers failed', error)
      throw new Error('OFFERS_FAILED')
    }

    return respond({
      offers: data || [],
    })
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (request.headers.get('origin') !== request.nextUrl.origin) {
      return respond(
        { error: 'Request origin not allowed.' },
        403,
      )
    }

    const action = request.nextUrl.searchParams.get('action')

    if (action !== 'spin' && action !== 'status') {
      return respond({ error: 'Unknown request.' }, 404)
    }

    if (action === 'status') {
      if (!(await hasAdminSession())) {
        return respond(
          { error: 'Please sign in as admin.' },
          401,
        )
      }

      const body = updateSchema.parse(await readJson(request))

      const { data, error } = await database()
        .from('raat_group_offers')
        .update({
          status: body.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.id)
        .eq('status', body.previous_status)
        .select('id')

      if (error) {
        logDatabaseError('Updating offer status failed', error)
        throw new Error('UPDATE_FAILED')
      }

      if (!data?.length) {
        return respond(
          {
            error: 'This offer changed. Refresh and try again.',
          },
          409,
        )
      }

      return respond({ success: true })
    }

    const body = spinSchema.parse(await readJson(request))

    const secret = process.env.ADMIN_SESSION_SECRET?.trim()

    if (!secret) {
      throw new Error('MISSING_ADMIN_SESSION_SECRET')
    }

    // Deployment must supply trusted IP headers for this network limit.
    const ip =
      request.headers
        .get('x-vercel-forwarded-for')
        ?.split(',')[0]
        ?.trim() ||
      request.headers
        .get('x-forwarded-for')
        ?.split(',')[0]
        ?.trim() ||
      'local'

    const rateKey = createHmac('sha256', secret)
      .update(`static-group-offer:${ip}`)
      .digest('hex')

    

    // The server chooses the discount, never the browser.
    const discount =
      OFFER_DISCOUNTS[randomInt(OFFER_DISCOUNTS.length)]

    if (
      typeof discount !== 'number' ||
      ![25, 50, 75, 100, 150, 200].includes(discount)
    ) {
      throw new Error('INVALID_OFFER_DISCOUNT_CONFIGURATION')
    }

    const { data, error } = await database().rpc(
      'raat_claim_group_offer',
      {
        p_request_key: body.request_key,
        p_promoter_name: body.promoter_name,
        p_promoter_phone: body.promoter_phone,
        p_guest_names: body.guest_names,
        p_discount: discount,
        p_rate_key: rateKey,
      },
    )

    if (error) {
      logDatabaseError('Database claim failed', error)
      throw new Error('CLAIM_FAILED')
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('CLAIM_RETURNED_INVALID_DATA')
    }

    if ('error' in data) {
      const errorCode =
        typeof data.error === 'string' ? data.error : 'unknown'

      const messages: Record<string, [number, string]> = {
        invalid: [
          400,
          'Check the promoter details and all 10 names.',
        ],
        already_claimed: [
          409,
          'An offer already exists for this phone number. Contact STATIC for help.',
        ],
        rate_limited: [
          429,
          'Too many attempts. Please try again later.',
        ],
        closed: [
          409,
          'Group offers are currently closed.',
        ],
        invalid_price: [
          503,
          'The offer price is not configured.',
        ],
        settings_unavailable: [
          503,
          'Event settings are unavailable.',
        ],
      }

      const knownError = messages[errorCode]

      if (!knownError) {
        console.error(
          '[GROUP OFFERS] Claim returned an unrecognized error code',
        )
      }

      const [status, message] = knownError || [
        503,
        'Unable to save your offer.',
      ]

      return respond({ error: message }, status)
    }

    const parsed = offerResultSchema.safeParse(data)

    if (!parsed.success) {
      throw new Error('CLAIM_RETURNED_UNEXPECTED_RESULT')
    }

    const result = parsed.data

    if (
      ![25, 50, 75, 100, 150, 200].includes(result.discount) ||
      result.base_price <= 200 ||
      result.price_per_person !== result.base_price - result.discount ||
      result.group_total !== result.price_per_person * 10
    ) {
      throw new Error('CLAIM_RETURNED_INVALID_PRICING')
    }

    return respond({ result })
  } catch (error) {
    return failure(error)
  }
}