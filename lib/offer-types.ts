export const OFFER_DISCOUNTS = [25, 50, 75, 100, 150, 200] as const

export type OfferStatus =
  | 'pending'
  | 'contacted'
  | 'paid'
  | 'cancelled'

export type OfferResult = {
  id: string
  base_price: number
  discount: number
  price_per_person: number
  group_total: number
}

export type GroupOffer = OfferResult & {
  promoter_name: string
  promoter_phone: string
  guest_names: string[]
  status: OfferStatus
  created_at: string
  updated_at: string
}