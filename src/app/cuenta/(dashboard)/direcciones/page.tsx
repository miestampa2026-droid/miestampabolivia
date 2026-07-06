import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer, getCustomerAddresses } from '@/lib/queries/customers'
import { DireccionesManager } from '@/components/account/DireccionesManager'

export const dynamic = 'force-dynamic'

export default async function DireccionesPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  const addresses = await getCustomerAddresses(supabase, customer.id)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Mis direcciones</h2>
      <DireccionesManager customerId={customer.id} initialAddresses={addresses} />
    </div>
  )
}
