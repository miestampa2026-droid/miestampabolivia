import { formatBs } from '@/lib/utils'

// v1 usa wa.me / click-to-chat (sin API formal, sin webhooks) — el link
// se arma server-side para no exponer el número de las socias al bundle
// del cliente. Devuelve null si NOTIFY_WHATSAPP_NUMBERS no está configurado
// (número de prueba: definirlo en .env.local, es fácil de cambiar por el
// real de las socias sin tocar código).
export function getOrderWhatsAppLink(order: {
  id: string
  orderNumber: string
  customerName: string
  total: number
}): string | null {
  const target = (process.env.NOTIFY_WHATSAPP_NUMBERS ?? '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)[0]

  if (!target) return null

  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/pedidos/${order.id}`
  const message = `Hola! Acabo de hacer el pedido ${order.orderNumber} (${order.customerName}) por ${formatBs(order.total)} en Mi Estampa. Les comparto mi comprobante de pago. Revisar en el panel: ${adminUrl}`
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`
}
