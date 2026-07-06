import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Check } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { getCurrentCustomer, getCustomerOrderDetail } from '@/lib/queries/customers'
import { formatBs, cn } from '@/lib/utils'
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_BADGE_CLASS,
  ORDER_STATUS_TIMELINE
} from '@/lib/orderLabels'

export const dynamic = 'force-dynamic'

export default async function PedidoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  const admin = createAdminSupabase()
  const order = await getCustomerOrderDetail(admin, params.id, customer.id)
  if (!order) notFound()

  const isCancelled = order.order_status === 'cancelado'
  const currentStepIndex = ORDER_STATUS_TIMELINE.indexOf(order.order_status)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/cuenta/pedidos"
        className="flex w-fit items-center gap-1 font-display text-sm font-bold text-charcoal hover:text-coral"
      >
        <ChevronLeft size={16} aria-hidden />
        Mis pedidos
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xl font-bold text-charcoal">{order.order_number}</p>
            <p className="font-body text-sm text-gray-mid">
              {new Date(order.created_at).toLocaleDateString('es-BO', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <span
            className={cn(
              'rounded-full px-3 py-1 font-display text-sm font-bold',
              PAYMENT_STATUS_BADGE_CLASS[order.payment_status]
            )}
          >
            {PAYMENT_STATUS_LABEL[order.payment_status]}
          </span>
        </div>

        <div className="mt-8">
          {isCancelled ? (
            <p className="rounded-lg bg-brand-error/10 px-4 py-3 font-display text-sm font-bold text-brand-error">
              Pedido cancelado
            </p>
          ) : (
            <div className="flex items-center">
              {ORDER_STATUS_TIMELINE.map((step, i) => {
                const done = i <= currentStepIndex
                const isLast = i === ORDER_STATUS_TIMELINE.length - 1
                return (
                  <div key={step} className={cn('flex items-center', !isLast && 'flex-1')}>
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold',
                          done ? 'bg-coral text-white' : 'bg-gray-light text-gray-mid'
                        )}
                      >
                        {done ? <Check size={16} aria-hidden /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          'whitespace-nowrap text-center font-display text-sm font-semibold',
                          done ? 'text-charcoal' : 'text-gray-mid'
                        )}
                      >
                        {ORDER_STATUS_LABEL[step]}
                      </span>
                    </div>
                    {!isLast && (
                      <span
                        className={cn('mx-2 h-0.5 flex-1', i < currentStepIndex ? 'bg-coral' : 'bg-gray-light')}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Productos</h2>
        <div className="flex flex-col divide-y divide-gray-light">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
              {item.preview_image_url ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-light">
                  <Image src={item.preview_image_url} alt={item.product_name_snapshot} fill className="object-contain" />
                </div>
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-light" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-charcoal">
                  {item.product_name_snapshot}
                </p>
                <p className="font-body text-sm text-gray-mid">Cantidad: {item.quantity}</p>
              </div>
              <p className="shrink-0 font-display text-sm font-extrabold text-charcoal">
                {formatBs(item.line_total)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-gray-light pt-4 font-body text-sm text-charcoal">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatBs(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{order.shipping_cost > 0 ? formatBs(order.shipping_cost) : 'Gratis'}</span>
          </div>
          <div className="flex justify-between font-display text-base font-extrabold text-charcoal">
            <span>Total</span>
            <span>{formatBs(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Entrega</h2>
        <p className="font-body text-sm text-charcoal">
          {order.delivery_method === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}
        </p>
        {order.shipping_address && (
          <p className="mt-1 font-body text-sm text-gray-mid">{order.shipping_address}</p>
        )}
      </div>
    </div>
  )
}
