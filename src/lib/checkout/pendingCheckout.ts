import type { CartItem } from '@/lib/cart/types'

export type PendingCheckout = {
  nombre: string
  whatsapp: string
  email: string
  deliveryMethod: 'envio' | 'retiro'
  zoneId: string | null
  direccion: string | null
  items: CartItem[]
  subtotal: number
  shippingCost: number
  total: number
}

const KEY = 'miestampa:pending-checkout'

export function savePendingCheckout(data: PendingCheckout) {
  sessionStorage.setItem(KEY, JSON.stringify(data))
}

export function getPendingCheckout(): PendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPendingCheckout() {
  sessionStorage.removeItem(KEY)
}
