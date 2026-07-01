import { createBrowserSupabase } from '@/lib/supabase/client'

export type ShippingZone = {
  id: string
  name: string
  departamento: string
  cost: number
  estimated_days: string | null
}

export async function getShippingZones(): Promise<ShippingZone[]> {
  const supabase = createBrowserSupabase()

  const { data, error } = await supabase
    .from('shipping_zones')
    .select('id, name, departamento, cost, estimated_days')
    .order('cost', { ascending: true })

  if (error) throw error
  return data ?? []
}
