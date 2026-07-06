import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { getCurrentCustomer, getCustomerOrders } from '@/lib/queries/customers'
import { formatBs } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_BADGE_CLASS
} from '@/lib/orderLabels'

export const dynamic = 'force-dynamic'

export default async function PedidosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  const admin = createAdminSupabase()
  const orders = await getCustomerOrders(admin, customer.id)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Mis pedidos</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="font-body text-sm text-gray-mid">Todavía no hiciste ningún pedido.</p>
          <Link
            href="/catalogo"
            className="rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/cuenta/pedidos/${order.id}`}
              className="flex flex-col gap-3 rounded-lg border-[1.5px] border-gray-light p-4 transition hover:border-coral sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display text-sm font-bold text-charcoal">{order.order_number}</p>
                <p className="font-body text-sm text-gray-mid">
                  {new Date(order.created_at).toLocaleDateString('es-BO', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 font-display text-sm font-bold',
                    ORDER_STATUS_BADGE_CLASS[order.order_status]
                  )}
                >
                  {ORDER_STATUS_LABEL[order.order_status]}
                </span>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 font-display text-sm font-bold',
                    PAYMENT_STATUS_BADGE_CLASS[order.payment_status]
                  )}
                >
                  {PAYMENT_STATUS_LABEL[order.payment_status]}
                </span>
                <span className="font-display text-sm font-extrabold text-charcoal">
                  {formatBs(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
