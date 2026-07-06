import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { sendOrderNotificationEmail } from '@/lib/notifications/orderEmail'
import type { CreateOrderPayload } from '@/lib/orders/types'
import type { Database } from '@/lib/supabase/types'

export const runtime = 'nodejs'

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 30 // 30 días

export async function POST(request: Request) {
  const formData = await request.formData()
  const payloadRaw = formData.get('payload')

  if (typeof payloadRaw !== 'string') {
    return NextResponse.json({ error: 'Falta el payload del pedido' }, { status: 400 })
  }

  let payload: CreateOrderPayload
  try {
    payload = JSON.parse(payloadRaw)
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  if (!payload.nombre || !payload.whatsapp || !payload.email) {
    return NextResponse.json({ error: 'Faltan datos de contacto' }, { status: 400 })
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }
  if (payload.deliveryMethod === 'envio' && !payload.direccion) {
    return NextResponse.json({ error: 'Falta la dirección de envío' }, { status: 400 })
  }

  const admin = createAdminSupabase()

  // El costo de envío se recalcula server-side desde shipping_zones — nunca
  // se confía en un valor que venga del cliente.
  let shippingCost = 0
  if (payload.deliveryMethod === 'envio' && payload.zoneId) {
    const { data: zone } = await admin
      .from('shipping_zones')
      .select('cost')
      .eq('id', payload.zoneId)
      .maybeSingle()
    shippingCost = zone?.cost ?? 0
  }

  const subtotal = payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const total = subtotal + shippingCost

  const serverSupabase = createServerSupabase()
  const customer = await getCurrentCustomer(serverSupabase)

  let paymentProofUrl: string | null = null
  const comprobante = formData.get('comprobante')
  if (comprobante instanceof File && comprobante.size > 0) {
    const ext = comprobante.name.split('.').pop() || 'jpg'
    const path = `${randomUUID()}.${ext}`
    const { error: uploadError } = await admin.storage
      .from('payment-proofs')
      .upload(path, comprobante, { upsert: false })

    if (!uploadError) {
      const { data: signed } = await admin.storage
        .from('payment-proofs')
        .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS)
      paymentProofUrl = signed?.signedUrl ?? null
    }
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      customer_name: payload.nombre,
      customer_phone: payload.whatsapp,
      customer_email: payload.email,
      delivery_method: payload.deliveryMethod,
      shipping_zone_id: payload.deliveryMethod === 'envio' ? payload.zoneId : null,
      shipping_address: payload.deliveryMethod === 'envio' ? payload.direccion : null,
      shipping_cost: shippingCost,
      subtotal,
      total,
      payment_proof_url: paymentProofUrl,
      customer_id: customer?.id ?? null
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'No se pudo crear el pedido' }, { status: 500 })
  }

  const orderItemsPayload: Database['public']['Tables']['order_items']['Insert'][] = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name_snapshot: item.productName,
    variants_snapshot: item.variantsSnapshot,
    design_source: item.designSource,
    design_id: item.designId,
    uploaded_image_url: null,
    preview_image_url: item.previewImageUrl,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    line_total: item.unitPrice * item.quantity
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItemsPayload)

  if (itemsError) {
    await admin.from('orders').delete().eq('id', order.id)
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  await sendOrderNotificationEmail(order, orderItemsPayload)

  return NextResponse.json({ orderId: order.id, orderNumber: order.order_number })
}
