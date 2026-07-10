import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminShippingZones } from '@/lib/queries/adminCatalog'
import { AdminShippingZonesView } from '@/components/admin/AdminShippingZonesView'

export const dynamic = 'force-dynamic'

export default async function AdminEnviosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const zones = await getAdminShippingZones(supabase)

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Zonas de envío</h2>
      <AdminShippingZonesView zones={zones} />
    </div>
  )
}
