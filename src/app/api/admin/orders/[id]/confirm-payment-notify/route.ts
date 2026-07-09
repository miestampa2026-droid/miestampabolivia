import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { sendPaymentConfirmedEmail } from '@/lib/notifications/paymentConfirmedEmail'

export const runtime = 'nodejs'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const admin = createAdminSupabase()
  const { data: order } = await admin
    .from('orders')
    .select('order_number, customer_email')
    .eq('id', params.id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  await sendPaymentConfirmedEmail({ customerEmail: order.customer_email, orderNumber: order.order_number })

  return NextResponse.json({ ok: true })
}
