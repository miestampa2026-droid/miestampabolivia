'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatBs, cn } from '@/lib/utils'
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_BADGE_CLASS
} from '@/lib/orderLabels'
import type { AdminOrderListItem } from '@/lib/queries/admin'
import type { OrderStatus, PaymentStatus } from '@/lib/supabase/types'

const ORDER_STATUS_OPTIONS: OrderStatus[] = ['nuevo', 'en_produccion', 'listo', 'entregado', 'cancelado']
const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['pendiente_verificacion', 'pagado_confirmado', 'rechazado']

export function AdminOrdersView({ orders }: { orders: AdminOrderListItem[] }) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatus && o.order_status !== orderStatus) return false
      if (paymentStatus && o.payment_status !== paymentStatus) return false
      return true
    })
  }, [orders, orderStatus, paymentStatus])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div>
          <p className="mb-2 font-display text-sm font-bold text-charcoal">Estado de pedido</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOrderStatus(null)}
              className={cn(
                'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                orderStatus === null ? 'bg-charcoal text-white' : 'bg-white text-charcoal shadow-card-sm'
              )}
            >
              Todos
            </button>
            {ORDER_STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setOrderStatus(status)}
                className={cn(
                  'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                  orderStatus === status ? 'bg-charcoal text-white' : 'bg-white text-charcoal shadow-card-sm'
                )}
              >
                {ORDER_STATUS_LABEL[status]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-display text-sm font-bold text-charcoal">Estado de pago</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPaymentStatus(null)}
              className={cn(
                'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                paymentStatus === null ? 'bg-coral text-white' : 'bg-white text-charcoal shadow-card-sm'
              )}
            >
              Todos
            </button>
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setPaymentStatus(status)}
                className={cn(
                  'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                  paymentStatus === status ? 'bg-coral text-white' : 'bg-white text-charcoal shadow-card-sm'
                )}
              >
                {PAYMENT_STATUS_LABEL[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="font-body text-sm text-gray-mid">
        {filtered.length} de {orders.length} pedidos
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center font-body text-sm text-gray-mid shadow-card-sm">
          No hay pedidos con estos filtros.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-card-sm transition hover:-translate-y-px hover:shadow-card-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-display text-sm font-bold text-charcoal">{order.order_number}</p>
                <p className="font-body text-sm text-gray-mid">
                  {order.customer_name} — {order.customer_phone}
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
