import { createBrowserSupabase } from '@/lib/supabase/client'

export type Design = {
  id: string
  category: string
  name: string
  image_url: string
}

export async function getDesigns(): Promise<Design[]> {
  const supabase = createBrowserSupabase()

  const { data, error } = await supabase
    .from('designs')
    .select('id, category, name, image_url')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export function getDesignCategories(designs: Design[]): string[] {
  return Array.from(new Set(designs.map((d) => d.category)))
}
