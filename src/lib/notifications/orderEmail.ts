import { Resend } from 'resend'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { formatBs } from '@/lib/utils'
import { formatVariantsSnapshot, PAYMENT_STATUS_LABEL } from '@/lib/orderLabels'
import type { Database } from '@/lib/supabase/types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

const ORIGINAL_LINK_EXPIRY_SECONDS = 60 * 60 * 24 * 30 // 30 días — tiempo de sobra para producir

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function buildItemHtml(item: OrderItemInsert): Promise<string> {
  const variantsText = formatVariantsSnapshot(item.variants_snapshot)
  const originHtml =
    item.design_source === 'galeria' ? 'Diseño de galería' : 'Imagen propia del cliente'

  let originalLinkHtml = ''
  if (item.design_source === 'subida' && item.uploaded_image_url) {
    const admin = createAdminSupabase()
    const { data: signed } = await admin.storage
      .from('uploads')
      .createSignedUrl(item.uploaded_image_url, ORIGINAL_LINK_EXPIRY_SECONDS)
    if (signed?.signedUrl) {
      originalLinkHtml = ` — <a href="${signed.signedUrl}">descargar imagen original</a>`
    }
  }

  const thumbnailHtml = item.preview_image_url
    ? `<img src="${item.preview_image_url}" alt="Preview" width="72" height="72" style="border-radius:8px;object-fit:contain;background:#F3F4F6;vertical-align:middle;margin-right:12px" />`
    : ''

  return `
    <tr>
      <td style="padding:8px 0;vertical-align:top">${thumbnailHtml}</td>
      <td style="padding:8px 0;vertical-align:top">
        <strong>${item.quantity} × ${escapeHtml(item.product_name_snapshot)}</strong> — ${formatBs(item.line_total)}<br/>
        ${variantsText ? `${escapeHtml(variantsText)}<br/>` : ''}
        ${originHtml}${originalLinkHtml}
      </td>
    </tr>
  `
}

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

    const itemsHtml = (await Promise.all(items.map(buildItemHtml))).join('')

    const deliveryHtml =
      order.delivery_method === 'envio'
        ? `Envío a domicilio — ${escapeHtml(order.shipping_address ?? 'sin dirección')}`
        : 'Retiro en local'

    const proofHtml = order.payment_proof_url
      ? `<a href="${order.payment_proof_url}">Ver comprobante de pago</a>`
      : 'El cliente todavía no subió comprobante.'

    const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/pedidos/${order.id}`

    const html = `
      <h2>Nuevo pedido ${order.order_number}</h2>
      <p>
        <strong>Cliente:</strong> ${escapeHtml(order.customer_name)} —
        ${escapeHtml(order.customer_phone)} — ${escapeHtml(order.customer_email)}
      </p>
      <p><strong>Entrega:</strong> ${deliveryHtml}</p>

      <table cellpadding="0" cellspacing="0">${itemsHtml}</table>

      <p>
        <strong>Subtotal:</strong> ${formatBs(order.subtotal)}<br/>
        <strong>Envío:</strong> ${formatBs(order.shipping_cost)}<br/>
        <strong>Total:</strong> ${formatBs(order.total)}
      </p>
      <p><strong>Estado de pago:</strong> ${PAYMENT_STATUS_LABEL[order.payment_status]}</p>
      <p>${proofHtml}</p>
      <p><a href="${adminUrl}">Ver este pedido en el panel admin</a></p>
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
