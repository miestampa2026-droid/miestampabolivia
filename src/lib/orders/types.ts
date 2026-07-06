import type { CartItem } from '@/lib/cart/types'

export type CreateOrderPayload = {
  nombre: string
  whatsapp: string
  email: string
  deliveryMethod: 'envio' | 'retiro'
  zoneId: string | null
  direccion: string | null
  items: CartItem[]
}

export type CreateOrderResult = { orderId: string; orderNumber: string }
