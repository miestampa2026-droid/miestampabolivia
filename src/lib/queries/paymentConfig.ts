import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { BANK_INFO as FALLBACK } from '@/lib/paymentConfig'

type SB = SupabaseClient<Database>

export const PAYMENT_CONFIG_ID = '00000000-0000-0000-0000-000000000001'

export type PaymentConfig = {
  qrImageUrl: string
  bankName: string
  bankHolder: string
}

// La fila en payment_config puede tener campos vacíos (todavía no
// cargó el QR/datos reales) — se completa con el placeholder mientras
// tanto, para que la pantalla de pago nunca se quede sin nada que mostrar.
export async function getPaymentConfig(supabase: SB): Promise<PaymentConfig> {
  const { data } = await supabase
    .from('payment_config')
    .select('qr_image_url, bank_name, bank_holder')
    .eq('id', PAYMENT_CONFIG_ID)
    .maybeSingle()

  return {
    qrImageUrl: data?.qr_image_url || FALLBACK.qrImageUrl,
    bankName: data?.bank_name || FALLBACK.bankName,
    bankHolder: data?.bank_holder || FALLBACK.accountHolder
  }
}
