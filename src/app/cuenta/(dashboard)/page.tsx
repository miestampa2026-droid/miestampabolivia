import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { getCurrentCustomer, getCustomerOrders } from '@/lib/queries/customers'
import { formatBs } from '@/lib/utils'
import { ORDER_STATUS_LABEL } from '@/lib/orderLabels'

export const dynamic = 'force-dynamic'

export default async function CuentaResumenPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  const admin = createAdminSupabase()
  const orders = await getCustomerOrders(admin, customer.id)
  const lastOrder = orders[0] ?? null

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-coral">
          Bienvenido/a
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-charcoal">
          {customer.name || customer.email}
        </h2>
        <p className="mt-1 font-body text-sm text-gray-mid">{customer.email}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-sm">
          <div className="rounded-lg bg-gray-light px-4 py-3">
            <p className="font-display text-2xl font-extrabold text-charcoal">{orders.length}</p>
            <p className="font-body text-sm text-gray-mid">Pedidos realizados</p>
          </div>
          <div className="rounded-lg bg-gray-light px-4 py-3">
            <p className="font-display text-sm font-bold text-charcoal">
              {lastOrder ? ORDER_STATUS_LABEL[lastOrder.order_status] : 'Sin pedidos'}
            </p>
            <p className="font-body text-sm text-gray-mid">Último pedido</p>
          </div>
        </div>
      </div>

      {lastOrder && (
        <Link
          href={`/cuenta/pedidos/${lastOrder.id}`}
          className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
        >
          <div>
            <p className="font-display text-sm font-bold text-charcoal">Pedido {lastOrder.order_number}</p>
            <p className="font-body text-sm text-gray-mid">{formatBs(lastOrder.total)}</p>
          </div>
          <span className="font-display text-sm font-bold text-coral">Ver detalle →</span>
        </Link>
      )}

      <div>
        <p className="mb-3 font-display text-sm font-bold text-charcoal">Accesos rápidos</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/cuenta/direcciones"
            className="rounded-2xl bg-white p-5 text-center shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
          >
            <p className="font-display text-sm font-bold text-charcoal">Mis direcciones</p>
          </Link>
          <Link
            href="/cuenta/favoritos"
            className="rounded-2xl bg-white p-5 text-center shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
          >
            <p className="font-display text-sm font-bold text-charcoal">Mis favoritos</p>
          </Link>
          <Link
            href="/catalogo"
            className="rounded-2xl bg-coral p-5 text-center shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md"
          >
            <p className="font-display text-sm font-bold text-white">Seguir comprando</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
