import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'
import QRCode from 'qrcode'
import { z } from 'zod'

import { hasAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PHOTO_BUCKET = 'raat-guest-photos'
const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const MAX_REQUEST_SIZE = 6 * 1024 * 1024

const settingsSchema = z.object({
  title: z.string().trim().min(1).max(80),
  ticket_name: z.string().trim().min(1).max(80),
  price: z.number().int().min(0).max(100000),
  venue: z.string().trim().min(1).max(160),
  event_date: z.string().trim().min(1).max(80),
  event_time: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(2000),
  booking_open: z.boolean(),
})

const guestSchema = z.object({
  full_name: z.string().trim().min(2).max(100),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),

  instagram: z
    .string()
    .trim()
    .regex(
      /^@?[a-zA-Z0-9._]{1,30}$/,
      'Enter a valid Instagram username'
    ),

  drink: z.enum(['alcoholic', 'non-alcoholic']),
  smoking: z.enum(['yes', 'no']),

  relationship: z.enum([
    'single',
    'mingle',
    'prefer-not-to-say',
  ]),

  approachable: z.enum(['yes', 'no']),
  night_stay: z.enum(['yes', 'no']),
  referral: z.string().trim().min(1).max(300),
  consent: z.literal('yes'),
})

const manageSchema = z.object({
  id: z.string().uuid(),

  operation: z.enum([
    'generate',
    'paid',
    'unpaid',
    'revoke',
  ]),
})

const scanSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(
      /^(STATIC-RAAT:[a-f0-9]{64}|RB-[A-Fa-f0-9]{12})$/,
      'Scan a valid QR or enter the complete RB entry code'
    ),
})

class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400
  ) {
    super(message)
  }
}

function respond(
  body: Record<string, unknown>,
  status = 200
) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

function failure(error: unknown) {
    console.error('[RAAT API ERROR]', error)
  if (error instanceof z.ZodError) {
    return respond(
      {
        error: error.issues[0]?.message || 'Invalid details.',
      },
      400
    )
  }

  if (error instanceof RequestError) {
    return respond(
      { error: error.message },
      error.status
    )
  }

  return respond(
    {
      error:
        'The request could not be completed. Check the server configuration and database setup.',
    },
    500
  )
}

function getDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Server database configuration is missing.')
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

function checkOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (origin !== request.nextUrl.origin) {
    throw new RequestError('Request origin not allowed.', 403)
  }
}

async function requireAdmin() {
  if (!(await hasAdminSession())) {
    throw new RequestError('Please sign in as admin.', 401)
  }
}

async function readJson(request: NextRequest): Promise<unknown> {
  const declaredSize = Number(
    request.headers.get('content-length') || 0
  )

  if (declaredSize > 16384) {
    throw new RequestError('Request is too large.', 413)
  }

  const text = await request.text()

  if (Buffer.byteLength(text, 'utf8') > 16384) {
    throw new RequestError('Request is too large.', 413)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new RequestError('Invalid JSON request.')
  }
}

async function readPhoto(photo: FormDataEntryValue) {
  if (!(photo instanceof File)) {
    throw new RequestError('Please upload one photo.')
  }

  if (
    photo.size === 0 ||
    photo.size > MAX_PHOTO_SIZE
  ) {
    throw new RequestError(
      'Your photo must be nonempty and under 5 MB.'
    )
  }

  const bytes = Buffer.from(await photo.arrayBuffer())

  const isJpeg =
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255

  const isPng = bytes.subarray(0, 8).equals(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  )

  const isWebp =
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'

  if (!isJpeg && !isPng && !isWebp) {
    throw new RequestError(
      'Upload a JPEG, PNG or WebP photo.'
    )
  }

  return {
    bytes,
    contentType: isJpeg
      ? 'image/jpeg'
      : isPng
        ? 'image/png'
        : 'image/webp',

    extension: isJpeg
      ? 'jpg'
      : isPng
        ? 'png'
        : 'webp',
  }
}

// Public: event settings.
// Private: admin guest list, photos and QR codes.
export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action')

    if (action === 'settings') {
      const database = getDatabase()

      const { data, error } = await database
        .from('raat_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error || !data) {
        throw new RequestError(
          'Event settings are unavailable. Check the database setup.',
          503
        )
      }

      return respond({ settings: data })
    }

    if (action !== 'admin') {
      throw new RequestError('Unknown request.', 404)
    }

    await requireAdmin()

    const database = getDatabase()

    const { data, error } = await database
      .from('raat_guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new RequestError('Unable to load guests.', 503)
    }

    const guests = await Promise.all(
      (data || []).map(async (guest) => {
        const paths = Array.isArray(guest.photo_paths)
          ? (guest.photo_paths as string[])
          : []

        const photoUrls = await Promise.all(
          paths.map(async (path) => {
            const { data: photo, error: photoError } =
              await database.storage
                .from(PHOTO_BUCKET)
                .createSignedUrl(path, 600)

            if (photoError || !photo) {
              throw new RequestError(
                'Unable to load private guest photos.',
                503
              )
            }

            return photo.signedUrl
          })
        )

        const qrImage =
          guest.status === 'approved' && guest.qr_token
            ? await QRCode.toDataURL(
                `STATIC-RAAT:${guest.qr_token}`,
                {
                  width: 360,
                  margin: 2,
                }
              )
            : null

        // Do not send storage paths or raw QR tokens to the UI.
        const {
          photo_paths: _photoPaths,
          qr_token: _qrToken,
          ...details
        } = guest

        return {
          ...details,
          photo_urls: photoUrls,
          qr_image: qrImage,
        }
      })
    )

    return respond({ guests })
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    checkOrigin(request)

    const action = request.nextUrl.searchParams.get('action')

    if (
      !action ||
      !['register', 'settings', 'manage', 'scan'].includes(action)
    ) {
      throw new RequestError('Unknown request.', 404)
    }

    // Only guest registration is public.
    if (action !== 'register') {
      await requireAdmin()
    }

    const database = getDatabase()

    // ADMIN: update the single ticket.
    if (action === 'settings') {
      const settings = settingsSchema.parse(
        await readJson(request)
      )

      const { data, error } = await database
        .from('raat_settings')
        .update(settings)
        .eq('id', 1)
        .select('id')

      if (error || !data?.length) {
        throw new RequestError(
          'Unable to save ticket settings.',
          503
        )
      }

      return respond({ success: true })
    }

    // ADMIN: generate/revoke a code or mark payment.
    if (action === 'manage') {
      const body = manageSchema.parse(
        await readJson(request)
      )

      const { data: current, error: lookupError } =
        await database
          .from('raat_guests')
          .select('*')
          .eq('id', body.id)
          .single()

      if (lookupError || !current) {
        throw new RequestError('Guest not found.', 404)
      }

      if (current.checked_in_at) {
        throw new RequestError(
          'This guest has already entered. Their record is locked.',
          409
        )
      }

      let change: Record<string, unknown>

      if (body.operation === 'generate') {
        if (
          current.entry_code &&
          current.qr_token &&
          current.status === 'approved'
        ) {
          return respond({ success: true })
        }

        change = {
          entry_code: `RB-${randomBytes(6)
            .toString('hex')
            .toUpperCase()}`,

          qr_token: randomBytes(32).toString('hex'),
          status: 'approved',
        }
      } else if (body.operation === 'revoke') {
        change = {
          entry_code: null,
          qr_token: null,
          status: 'rejected',
        }
      } else {
        change = {
          paid: body.operation === 'paid',
        }
      }

      let update = database
        .from('raat_guests')
        .update(change)
        .eq('id', body.id)
        .eq('status', current.status)
        .eq('paid', current.paid)
        .is('checked_in_at', null)

      update =
        current.entry_code === null
          ? update.is('entry_code', null)
          : update.eq('entry_code', current.entry_code)

      const { data, error } = await update.select('id')

      if (error) {
        throw new RequestError(
          'Unable to update this guest. Refresh and try again.',
          503
        )
      }

      if (!data?.length) {
        throw new RequestError(
          'This guest changed during the update. Refresh and try again.',
          409
        )
      }

      return respond({ success: true })
    }

    // ADMIN: atomic check-in using QR text or readable entry code.
    if (action === 'scan') {
      const { code } = scanSchema.parse(
        await readJson(request)
      )

      const passToken = code.startsWith('STATIC-RAAT:')
        ? code.slice('STATIC-RAAT:'.length)
        : code.toUpperCase()

      const { data, error } = await database.rpc(
        'raat_check_in',
        {
          pass_token: passToken,
        }
      )

      if (error) {
        throw new RequestError(
          'Check-in failed. Please try again.',
          503
        )
      }

      return respond(data as Record<string, unknown>)
    }

    // PUBLIC: submit guest details with exactly one photo.
    const declaredSize = Number(
      request.headers.get('content-length') || 0
    )

    if (declaredSize > MAX_REQUEST_SIZE) {
      throw new RequestError(
        'Upload is too large. Your photo must be under 5 MB.',
        413
      )
    }

    const { data: settings, error: settingsError } =
      await database
        .from('raat_settings')
        .select('booking_open, price')
        .eq('id', 1)
        .single()

    if (settingsError || !settings) {
      throw new RequestError(
        'Event settings are unavailable.',
        503
      )
    }

    if (!settings.booking_open) {
      throw new RequestError(
        'Guest registrations are currently closed.',
        409
      )
    }

    const contentType =
      request.headers.get('content-type') || ''

    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      throw new RequestError(
        'Submit the guest form with your photo.',
        415
      )
    }

    let form: FormData

    try {
      form = await request.formData()
    } catch {
      throw new RequestError('Unable to read the submitted form.')
    }

    const guest = guestSchema.parse(
      Object.fromEntries(form.entries())
    )

    const photos = form.getAll('photos')

    if (photos.length !== 1) {
      throw new RequestError(
        'Please upload exactly one photo.'
      )
    }

    const photo = await readPhoto(photos[0])

    const path = `applications/${randomBytes(24).toString('hex')}.${
      photo.extension
    }`

    const { error: uploadError } = await database.storage
      .from(PHOTO_BUCKET)
      .upload(path, photo.bytes, {
        contentType: photo.contentType,
        upsert: false,
      })

    if (uploadError) {
      throw new RequestError(
        'Photo upload failed. Please try again.',
        503
      )
    }

    const { consent: _consent, ...details } = guest

    const { error: insertError } = await database
      .from('raat_guests')
      .insert({
        ...details,
        user_id: null,
        photo_paths: [path],
        amount: settings.price,
        paid: false,
        status: 'pending',
        entry_code: null,
        qr_token: null,
        checked_in_at: null,
      })

    if (insertError) {
      // Remove the uploaded photo if the registration was not saved.
      await database.storage
        .from(PHOTO_BUCKET)
        .remove([path])

      throw new RequestError(
        'Your details could not be saved. Please try again.',
        503
      )
    }

    return respond({ success: true })
  } catch (error) {
    return failure(error)
  }
}