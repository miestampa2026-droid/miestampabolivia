import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminProducts } from '@/lib/queries/adminCatalog'
import { AdminProductsView } from '@/components/admin/AdminProductsView'

export const dynamic = 'force-dynamic'

export default async function AdminProductosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const products = await getAdminProducts(supabase)

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Productos</h2>
      <AdminProductsView products={products} />
    </div>
  )
}
