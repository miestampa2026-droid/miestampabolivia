import { Resend } from 'resend'
import { formatBs } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

// No debe romper la creación del pedido si Resend falla o no está
// configurado todavía (RESEND_API_KEY / NOTIFY_EMAIL_TO pendientes del
// cliente) — por eso nunca lanza, solo loguea.
export async function sendOrderNotificationEmail(order: Order, items: OrderItemInsert[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const recipients = (process.env.NOTIFY_EMAIL_TO ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  if (!apiKey || recipients.length === 0) {
    console.log('[notifications] RESEND_API_KEY o NOTIFY_EMAIL_TO no configurados — se omite el correo')
    return
  }

  try {
    const resend = new Resend(apiKey)

    const itemsHtml = items
      .map((item) => `<li>${item.quantity} × ${item.product_name_snapshot} — ${formatBs(item.line_total)}</li>`)
      .join('')

    const deliveryHtml =
      order.delivery_method === 'envio'
        ? `Envío a domicilio — ${order.shipping_address ?? 'sin dirección'}`
        : 'Retiro en local'

    const proofHtml = order.payment_proof_url
      ? `<p><a href="${order.payment_proof_url}">Ver comprobante de pago</a></p>`
      : '<p>El cliente todavía no subió comprobante.</p>'

    const html = `
      <h2>Nuevo pedido ${order.order_number}</h2>
      <p><strong>Cliente:</strong> ${order.customer_name} — ${order.customer_phone} — ${order.customer_email}</p>
      <p><strong>Entrega:</strong> ${deliveryHtml}</p>
      <ul>${itemsHtml}</ul>
      <p>
        <strong>Subtotal:</strong> ${formatBs(order.subtotal)}<br/>
        <strong>Envío:</strong> ${formatBs(order.shipping_cost)}<br/>
        <strong>Total:</strong> ${formatBs(order.total)}
      </p>
      ${proofHtml}
      <p>Estado: pendiente de verificación manual.</p>
    `

    // onboarding@resend.dev funciona sin verificar dominio propio — cambiar
    // por un remitente del dominio real de Mi Estampa cuando esté verificado.
    await resend.emails.send({
      from: 'Mi Estampa <onboarding@resend.dev>',
      to: recipients,
      subject: `Nuevo pedido ${order.order_number} — pendiente de verificación`,
      html
    })
  } catch (err) {
    console.error('[notifications] Error enviando correo de pedido:', err)
  }
}
