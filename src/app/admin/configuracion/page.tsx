import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { PAYMENT_CONFIG_ID } from '@/lib/queries/paymentConfig'
import { PaymentConfigForm } from '@/components/admin/PaymentConfigForm'

export const dynamic = 'force-dynamic'

export default async function AdminConfiguracionPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const { data: config } = await supabase
    .from('payment_config')
    .select('*')
    .eq('id', PAYMENT_CONFIG_ID)
    .maybeSingle()

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
      <h2 className="mb-2 font-display text-xl font-bold text-charcoal">Configuración de pago</h2>
      <p className="mb-6 font-body text-sm text-gray-mid">
        QR de cobro y datos bancarios que se muestran en la pantalla de pago. Mientras esto quede
        vacío, los clientes ven un QR y datos de ejemplo.
      </p>
      <PaymentConfigForm
        config={
          config ?? {
            id: PAYMENT_CONFIG_ID,
            qr_image_url: null,
            bank_name: null,
            bank_holder: null,
            updated_at: new Date().toISOString()
          }
        }
      />
    </div>
  )
}
