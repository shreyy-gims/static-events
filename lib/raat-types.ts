export type EventSettings = {
  id: number
  title: string
  ticket_name: string
  price: number
  venue: string
  event_date: string
  event_time: string
  description: string
  booking_open: boolean
}

export type Guest = {
  id: string

  // Guests can register without an account.
  user_id: string | null

  full_name: string
  phone: string
  instagram: string

  drink: string
  smoking: string
  relationship: string
  approachable: string

  // Older registrations may not have answered this.
  night_stay?: 'yes' | 'no' | null

  referral: string

  status: 'pending' | 'approved' | 'rejected'
  amount: number
  paid: boolean

  entry_code: string | null
  checked_in_at: string | null
  created_at: string

  // Raw storage paths and QR tokens are omitted by the admin API.
  photo_paths?: string[]
  qr_token?: string | null

  photo_urls?: string[]
  qr_image?: string | null
}