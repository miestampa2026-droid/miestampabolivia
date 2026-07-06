import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminOrders } from '@/lib/queries/admin'
import { AdminOrdersView } from '@/components/admin/AdminOrdersView'

export const dynamic = 'force-dynamic'

export default async function AdminPedidosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const orders = await getAdminOrders(supabase)

  return <AdminOrdersView orders={orders} />
}
