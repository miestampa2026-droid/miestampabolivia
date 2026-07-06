import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { PerfilForm } from '@/components/account/PerfilForm'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Mis datos</h2>
        <PerfilForm customer={customer} />
      </div>
    </div>
  )
}
