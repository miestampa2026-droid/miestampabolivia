import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer, getCustomerAddresses } from '@/lib/queries/customers'
import { CheckoutView } from '@/components/checkout/CheckoutView'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  const addresses = customer ? await getCustomerAddresses(supabase, customer.id) : []

  return <CheckoutView customer={customer} addresses={addresses} />
}
