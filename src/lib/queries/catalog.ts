import { createBrowserSupabase } from '@/lib/supabase/client'

export type Category = {
  id: string
  name: string
  slug: string
}

export type ProductListItem = {
  id: string
  name: string
  base_price: number
  mockup_image_url: string | null
  category_id: string
  category_name: string
}

export type Variant = {
  id: string
  variant_type: string
  variant_value: string
  price_delta: number
}

export type ProductDetail = {
  id: string
  name: string
  description: string | null
  base_price: number
  mockup_image_url: string | null
  category_id: string
  category_name: string
  variants: Variant[]
}

export async function getCategoriesWithProducts(): Promise<{
  categories: Category[]
  products: ProductListItem[]
}> {
  const supabase = createBrowserSupabase()

  const { data: categories, error: categoriesError } = await supabase
    .from('products_categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
  if (categoriesError) throw categoriesError

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, base_price, mockup_image_url, category_id')
    .order('created_at', { ascending: true })
  if (productsError) throw productsError

  const categoryNameById = new Map((categories ?? []).map((c) => [c.id, c.name]))

  return {
    categories: categories ?? [],
    products: (products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      base_price: p.base_price,
      mockup_image_url: p.mockup_image_url,
      category_id: p.category_id,
      category_name: categoryNameById.get(p.category_id) ?? ''
    }))
  }
}

export async function getProductWithVariants(id: string): Promise<ProductDetail | null> {
  const supabase = createBrowserSupabase()

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name, description, base_price, mockup_image_url, category_id')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle()

  if (productError) throw productError
  if (!product) return null

  const { data: category, error: categoryError } = await supabase
    .from('products_categories')
    .select('name')
    .eq('id', product.category_id)
    .maybeSingle()
  if (categoryError) throw categoryError

  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id, variant_type, variant_value, price_delta')
    .eq('product_id', id)
    .eq('active', true)
    .order('created_at', { ascending: true })
  if (variantsError) throw variantsError

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    base_price: product.base_price,
    mockup_image_url: product.mockup_image_url,
    category_id: product.category_id,
    category_name: category?.name ?? '',
    variants: variants ?? []
  }
}

export function groupVariantsByType(variants: Variant[]): Array<[string, Variant[]]> {
  const map = new Map<string, Variant[]>()
  for (const v of variants) {
    const list = map.get(v.variant_type)
    if (list) list.push(v)
    else map.set(v.variant_type, [v])
  }
  return Array.from(map.entries())
}
