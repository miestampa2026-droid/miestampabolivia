import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

type SB = SupabaseClient<Database>

export type AdminCategory = Database['public']['Tables']['products_categories']['Row'] & {
  product_count: number
}

export async function getAdminCategories(supabase: SB): Promise<AdminCategory[]> {
  const { data: categories, error } = await supabase
    .from('products_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error

  const { data: products, error: productsError } = await supabase.from('products').select('category_id')
  if (productsError) throw productsError

  const countByCategory = new Map<string, number>()
  for (const p of products ?? []) {
    countByCategory.set(p.category_id, (countByCategory.get(p.category_id) ?? 0) + 1)
  }

  return (categories ?? []).map((c) => ({ ...c, product_count: countByCategory.get(c.id) ?? 0 }))
}

export type AdminProductListItem = Database['public']['Tables']['products']['Row'] & {
  category_name: string
}

export async function getAdminProducts(supabase: SB): Promise<AdminProductListItem[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error

  const { data: categories, error: categoriesError } = await supabase
    .from('products_categories')
    .select('id, name')
  if (categoriesError) throw categoriesError
  const categoryNameById = new Map((categories ?? []).map((c) => [c.id, c.name]))

  return (products ?? []).map((p) => ({
    ...p,
    category_name: categoryNameById.get(p.category_id) ?? ''
  }))
}

export type AdminProductVariant = Database['public']['Tables']['product_variants']['Row']

export type AdminProductDetail = Database['public']['Tables']['products']['Row'] & {
  variants: AdminProductVariant[]
}

export async function getAdminProductDetail(supabase: SB, id: string): Promise<AdminProductDetail | null> {
  const { data: product, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!product) return null

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id)
    .order('created_at', { ascending: true })
  if (variantsError) throw variantsError

  return { ...product, variants: variants ?? [] }
}

export type AdminDesign = Database['public']['Tables']['designs']['Row']

export async function getAdminDesigns(supabase: SB): Promise<AdminDesign[]> {
  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export type AdminShippingZone = Database['public']['Tables']['shipping_zones']['Row']

export async function getAdminShippingZones(supabase: SB): Promise<AdminShippingZone[]> {
  const { data, error } = await supabase
    .from('shipping_zones')
    .select('*')
    .order('cost', { ascending: true })
  if (error) throw error
  return data ?? []
}

const ACCENT_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ñ: 'n',
  ü: 'u'
}

export function slugify(text: string): string {
  const withoutAccents = text
    .toLowerCase()
    .split('')
    .map((ch) => ACCENT_MAP[ch] ?? ch)
    .join('')

  return withoutAccents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
