import { formatBs } from '@/lib/utils'

// v1 usa wa.me / click-to-chat (sin API formal, sin webhooks) — el link
// se arma server-side para no exponer el número de las socias al bundle
// del cliente. Devuelve null si NOTIFY_WHATSAPP_NUMBERS no está configurado.
export function getOrderWhatsAppLink(orderNumber: string, total: number): string | null {
  const target = (process.env.NOTIFY_WHATSAPP_NUMBERS ?? '')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)[0]

  if (!target) return null

  const message = `Hola! Acabo de hacer el pedido ${orderNumber} por ${formatBs(total)} en Mi Estampa. Les comparto mi comprobante de pago.`
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`
}
