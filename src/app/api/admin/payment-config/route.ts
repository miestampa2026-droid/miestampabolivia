import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { PAYMENT_CONFIG_ID } from '@/lib/queries/paymentConfig'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const formData = await request.formData()
  const bankName = formData.get('bankName')
  const bankHolder = formData.get('bankHolder')
  const qrFile = formData.get('qr')

  const admin = createAdminSupabase()
  const update: { bank_name?: string; bank_holder?: string; qr_image_url?: string } = {}

  if (typeof bankName === 'string') update.bank_name = bankName
  if (typeof bankHolder === 'string') update.bank_holder = bankHolder

  if (qrFile instanceof File && qrFile.size > 0) {
    const ext = qrFile.name.split('.').pop() || 'png'
    const path = `qr-${randomUUID()}.${ext}`
    const { error: uploadError } = await admin.storage.from('payment-qr').upload(path, qrFile, { upsert: false })
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }
    const { data } = admin.storage.from('payment-qr').getPublicUrl(path)
    update.qr_image_url = data.publicUrl
  }

  const { error: updateError } = await admin.from('payment_config').update(update).eq('id', PAYMENT_CONFIG_ID)
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
