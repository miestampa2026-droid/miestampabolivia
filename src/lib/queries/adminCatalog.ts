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
