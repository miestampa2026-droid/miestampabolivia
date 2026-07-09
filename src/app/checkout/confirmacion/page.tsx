import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PartyPopper, MessageCircle } from 'lucide-react'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getOrderWhatsAppLink } from '@/lib/notifications/whatsapp'

export const dynamic = 'force-dynamic'

export default async function ConfirmacionPage({
  searchParams
}: {
  searchParams: { order?: string }
}) {
  const orderId = searchParams.order
  if (!orderId) notFound()

  const admin = createAdminSupabase()
  const { data: order } = await admin
    .from('orders')
    .select('id, order_number, total, customer_name')
    .eq('id', orderId)
    .maybeSingle()

  if (!order) notFound()

  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  const whatsappLink = getOrderWhatsAppLink({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    total: order.total
  })

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container flex flex-col items-center py-16 text-center sm:py-24">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-md sm:p-10">
          <PartyPopper size={40} className="mx-auto text-coral" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold text-charcoal">¡Pedido recibido!</h1>
          <p className="mt-2 font-display text-lg font-bold text-coral">{order.order_number}</p>
          <p className="mt-4 font-body text-sm text-gray-mid">
            Te confirmamos el pago por WhatsApp en breve.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
              >
                <MessageCircle size={18} aria-hidden />
                Escribinos por WhatsApp
              </a>
            )}

            {customer ? (
              <Link
                href="/cuenta/pedidos"
                className="rounded-full border-2 border-coral px-7 py-3 font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white"
              >
                Ver mis pedidos
              </Link>
            ) : (
              <Link
                href="/catalogo"
                className="rounded-full border-2 border-coral px-7 py-3 font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white"
              >
                Seguir comprando
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
