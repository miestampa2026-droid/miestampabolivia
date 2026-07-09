import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminCategories } from '@/lib/queries/adminCatalog'
import { AdminCategoriesView } from '@/components/admin/AdminCategoriesView'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriasPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const categories = await getAdminCategories(supabase)

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Categorías</h2>
      <AdminCategoriesView categories={categories} />
    </div>
  )
}
