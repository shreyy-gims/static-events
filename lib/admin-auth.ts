import 'server-only'

import {
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto'

import { promisify } from 'node:util'
import { cookies } from 'next/headers'

const scryptAsync = promisify(scrypt)

const SESSION_SECONDS = 8 * 60 * 60

const COOKIE_NAME =
  process.env.NODE_ENV === 'production'
    ? '__Host-static-admin'
    : 'static-admin'

function getConfig() {
  const username = process.env.ADMIN_USERNAME?.trim()
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()

  if (
    !username ||
    !passwordHash ||
    !secret ||
    !/^[a-f0-9]{64}$/i.test(secret)
  ) {
    throw new Error('Admin environment settings are missing or invalid.')
  }

  if (
    !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(passwordHash)
  ) {
    throw new Error('ADMIN_PASSWORD_HASH has an invalid format.')
  }

  // Changing the username, password hash or secret invalidates old sessions.
  const signingKey = createHmac('sha256', secret)
    .update(`${username}\0${passwordHash}`)
    .digest()

  return { username, passwordHash, signingKey }
}

function sign(value: string, signingKey: Buffer) {
  return createHmac('sha256', signingKey)
    .update(value)
    .digest('base64url')
}

function safeEqual(first: Buffer, second: Buffer) {
  return (
    first.length === second.length &&
    timingSafeEqual(first, second)
  )
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (
    username.length > 100 ||
    password.length === 0 ||
    password.length > 512
  ) {
    return false
  }

  const config = getConfig()
  const [, salt, storedHash] = config.passwordHash.split(':')

  const suppliedHash = (await scryptAsync(
    password,
    salt,
    64
  )) as Buffer

  const passwordMatches = safeEqual(
    suppliedHash,
    Buffer.from(storedHash, 'hex')
  )

  return username.trim() === config.username && passwordMatches
}

export async function createAdminSession(): Promise<void> {
  const { signingKey } = getConfig()
  const now = Math.floor(Date.now() / 1000)

  const payload = Buffer.from(
    JSON.stringify({
      issuedAt: now,
      expiresAt: now + SESSION_SECONDS,
      nonce: randomBytes(16).toString('hex'),
    })
  ).toString('base64url')

  const token = `${payload}.${sign(payload, signingKey)}`
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_SECONDS,
  })
}

export async function hasAdminSession(): Promise<boolean> {
  const { signingKey } = getConfig()
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token || token.length > 1024) return false

  const parts = token.split('.')

  if (parts.length !== 2) return false

  const [payload, signature] = parts

  if (
    !/^[A-Za-z0-9_-]+$/.test(payload) ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) {
    return false
  }

  const signatureMatches = safeEqual(
    Buffer.from(signature, 'base64url'),
    Buffer.from(sign(payload, signingKey), 'base64url')
  )

  if (!signatureMatches) return false

  try {
    const session = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8')
    )

    const now = Math.floor(Date.now() / 1000)

    return (
      Number.isInteger(session.issuedAt) &&
      Number.isInteger(session.expiresAt) &&
      session.issuedAt <= now &&
      session.expiresAt > now &&
      session.expiresAt - session.issuedAt === SESSION_SECONDS &&
      typeof session.nonce === 'string' &&
      /^[a-f0-9]{32}$/.test(session.nonce)
    )
  } catch {
    return false
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}