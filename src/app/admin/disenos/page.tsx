import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminDesigns } from '@/lib/queries/adminCatalog'
import { AdminDesignsView } from '@/components/admin/AdminDesignsView'

export const dynamic = 'force-dynamic'

export default async function AdminDisenosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const designs = await getAdminDesigns(supabase)

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Diseños</h2>
      <AdminDesignsView designs={designs} />
    </div>
  )
}
