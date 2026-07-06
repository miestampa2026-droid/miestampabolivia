import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import type { ProductListItem } from '@/lib/queries/catalog'

type SB = SupabaseClient<Database>

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerAddress = Database['public']['Tables']['customer_addresses']['Row']

export async function getCurrentCustomer(supabase: SB): Promise<Customer | null> {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCustomerAddresses(supabase: SB, customerId: string): Promise<CustomerAddress[]> {
  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getFavoriteProductIds(supabase: SB, customerId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('customer_favorites')
    .select('product_id')
    .eq('customer_id', customerId)
    .not('product_id', 'is', null)

  if (error) throw error
  return new Set((data ?? []).map((row) => row.product_id as string))
}

export type FavoriteProduct = ProductListItem & { favorite_id: string }

export async function getFavoriteProducts(supabase: SB, customerId: string): Promise<FavoriteProduct[]> {
  const { data: favorites, error: favoritesError } = await supabase
    .from('customer_favorites')
    .select('id, product_id')
    .eq('customer_id', customerId)
    .not('product_id', 'is', null)
    .order('created_at', { ascending: false })
  if (favoritesError) throw favoritesError

  const productIds = (favorites ?? []).map((f) => f.product_id as string)
  if (productIds.length === 0) return []

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, base_price, mockup_image_url, category_id, technique, mockup_type, badge')
    .in('id', productIds)
  if (productsError) throw productsError

  const { data: categories, error: categoriesError } = await supabase
    .from('products_categories')
    .select('id, name')
  if (categoriesError) throw categoriesError
  const categoryNameById = new Map((categories ?? []).map((c) => [c.id, c.name]))

  const productById = new Map((products ?? []).map((p) => [p.id, p]))

  return (favorites ?? [])
    .map((fav) => {
      const p = productById.get(fav.product_id as string)
      if (!p) return null
      const item: FavoriteProduct = {
        favorite_id: fav.id,
        id: p.id,
        name: p.name,
        base_price: p.base_price,
        mockup_image_url: p.mockup_image_url,
        category_id: p.category_id,
        category_name: categoryNameById.get(p.category_id) ?? '',
        technique: p.technique,
        mockup_type: p.mockup_type,
        badge: p.badge
      }
      return item
    })
    .filter((item): item is FavoriteProduct => item !== null)
}

export type CustomerOrderListItem = {
  id: string
  order_number: string
  order_status: Database['public']['Tables']['orders']['Row']['order_status']
  payment_status: Database['public']['Tables']['orders']['Row']['payment_status']
  total: number
  created_at: string
}

// orders no tiene policies de RLS (solo service_role) — recibe un cliente
// admin y el customerId ya viene verificado por el caller (sesión server-side).
export async function getCustomerOrders(admin: SB, customerId: string): Promise<CustomerOrderListItem[]> {
  const { data, error } = await admin
    .from('orders')
    .select('id, order_number, order_status, payment_status, total, created_at')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export type CustomerOrderDetail = Database['public']['Tables']['orders']['Row'] & {
  items: Array<Database['public']['Tables']['order_items']['Row']>
}

export async function getCustomerOrderDetail(
  admin: SB,
  orderId: string,
  customerId: string
): Promise<CustomerOrderDetail | null> {
  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .maybeSingle()
  if (orderError) throw orderError
  if (!order) return null

  const { data: items, error: itemsError } = await admin
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true })
  if (itemsError) throw itemsError

  return { ...order, items: items ?? [] }
}
