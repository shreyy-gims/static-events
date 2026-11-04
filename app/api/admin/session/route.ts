import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import {
  verifyAdminCredentials,
  createAdminSession,
  hasAdminSession,
  clearAdminSession,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

function validOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')

  return origin === request.nextUrl.origin
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

// Check whether this browser has an active admin session.
export async function GET() {
  try {
    return respond({
      authenticated: await hasAdminSession(),
    })
  } catch {
    return respond(
      { error: 'Admin login configuration is unavailable.' },
      500
    )
  }
}

// Log in using your website's own username and password.
export async function POST(request: NextRequest) {
  if (!validOrigin(request)) {
    return respond({ error: 'Request origin not allowed.' }, 403)
  }

  const contentType = request.headers.get('content-type') || ''

  if (!contentType.toLowerCase().includes('application/json')) {
    return respond({ error: 'Expected a JSON request.' }, 415)
  }

  if (Number(request.headers.get('content-length') || 0) > 8192) {
    return respond({ error: 'Request is too large.' }, 413)
  }

  let credentials: unknown

  try {
    const text = await request.text()

    if (Buffer.byteLength(text, 'utf8') > 8192) {
      return respond({ error: 'Request is too large.' }, 413)
    }

    credentials = JSON.parse(text)
  } catch {
    return respond({ error: 'Invalid request.' }, 400)
  }

  if (
    !credentials ||
    typeof credentials !== 'object' ||
    !('username' in credentials) ||
    !('password' in credentials) ||
    typeof credentials.username !== 'string' ||
    typeof credentials.password !== 'string'
  ) {
    return respond({ error: 'Enter your username and password.' }, 400)
  }

  const { username, password } = credentials

  if (
    !username.trim() ||
    username.length > 100 ||
    !password ||
    password.length > 512
  ) {
    return respond({ error: 'Invalid username or password.' }, 401)
  }

  try {
    const database = getDatabase()

    const { data: allowed, error } = await database.rpc(
      'take_admin_login_attempt'
    )

    if (error) {
      return respond(
        { error: 'Login protection is unavailable. Please try later.' },
        503
      )
    }

    if (allowed !== true) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again in 15 minutes.',
        },
        {
          status: 429,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': '900',
          },
        }
      )
    }

    const valid = await verifyAdminCredentials(username, password)

    if (!valid) {
      return respond({ error: 'Invalid username or password.' }, 401)
    }

    await createAdminSession()

    return respond({ success: true })
  } catch {
    return respond(
      { error: 'Unable to log in. Check your server environment settings.' },
      500
    )
  }
}

// Log out and clear the admin session cookie.
export async function DELETE(request: NextRequest) {
  if (!validOrigin(request)) {
    return respond({ error: 'Request origin not allowed.' }, 403)
  }

  try {
    await clearAdminSession()

    return respond({ success: true })
  } catch {
    return respond({ error: 'Unable to log out.' }, 500)
  }
}