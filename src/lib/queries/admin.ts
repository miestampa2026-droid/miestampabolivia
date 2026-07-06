import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, OrderStatus, PaymentStatus } from '@/lib/supabase/types'

type SB = SupabaseClient<Database>

export type AdminOrderListItem = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  payment_status: PaymentStatus
  order_status: OrderStatus
  total: number
  created_at: string
}

export async function getAdminOrders(supabase: SB): Promise<AdminOrderListItem[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, payment_status, order_status, total, created_at')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export type AdminOrderItem = Database['public']['Tables']['order_items']['Row'] & {
  design_image_url: string | null
}

export type AdminOrderDetail = Database['public']['Tables']['orders']['Row'] & {
  items: AdminOrderItem[]
  shipping_zone_name: string | null
}

export async function getAdminOrderDetail(supabase: SB, orderId: string): Promise<AdminOrderDetail | null> {
  const { data: order, error: orderError } = await supabase.from('orders').select('*').eq('id', orderId).maybeSingle()
  if (orderError) throw orderError
  if (!order) return null

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })
  if (itemsError) throw itemsError

  const designIds = (items ?? []).map((i) => i.design_id).filter((id): id is string => !!id)
  const designImageById = new Map<string, string>()
  if (designIds.length > 0) {
    const { data: designs } = await supabase.from('designs').select('id, image_url').in('id', designIds)
    for (const d of designs ?? []) designImageById.set(d.id, d.image_url)
  }

  let shippingZoneName: string | null = null
  if (order.shipping_zone_id) {
    const { data: zone } = await supabase
      .from('shipping_zones')
      .select('name')
      .eq('id', order.shipping_zone_id)
      .maybeSingle()
    shippingZoneName = zone?.name ?? null
  }

  return {
    ...order,
    shipping_zone_name: shippingZoneName,
    items: (items ?? []).map((item) => ({
      ...item,
      design_image_url: item.design_id ? designImageById.get(item.design_id) ?? null : null
    }))
  }
}
