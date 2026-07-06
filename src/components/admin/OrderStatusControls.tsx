'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from '@/lib/orderLabels'
import type { OrderStatus, PaymentStatus } from '@/lib/supabase/types'

const ORDER_STATUS_OPTIONS: OrderStatus[] = ['nuevo', 'en_produccion', 'listo', 'entregado', 'cancelado']
const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['pendiente_verificacion', 'pagado_confirmado', 'rechazado']

export function OrderStatusControls({
  orderId,
  orderStatus,
  paymentStatus
}: {
  orderId: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
}) {
  const router = useRouter()
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function updateOrderStatus(value: OrderStatus) {
    setError(null)
    setSaving('order_status')
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase.from('orders').update({ order_status: value }).eq('id', orderId)
    setSaving(null)

    if (updateError) {
      setError(updateError.message)
      return
    }
    router.refresh()
  }

  async function updatePaymentStatus(value: PaymentStatus) {
    setError(null)
    setSaving('payment_status')
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase.from('orders').update({ payment_status: value }).eq('id', orderId)
    setSaving(null)

    if (updateError) {
      setError(updateError.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-display text-sm font-bold text-charcoal">Estado de pedido</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              disabled={saving === 'order_status'}
              onClick={() => updateOrderStatus(status)}
              className={cn(
                'rounded-full px-4 py-2 font-display text-sm font-bold transition disabled:opacity-60',
                orderStatus === status
                  ? 'bg-charcoal text-white'
                  : 'bg-white text-charcoal shadow-card-sm hover:bg-gray-light'
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
          {PAYMENT_STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              disabled={saving === 'payment_status'}
              onClick={() => updatePaymentStatus(status)}
              className={cn(
                'rounded-full px-4 py-2 font-display text-sm font-bold transition disabled:opacity-60',
                paymentStatus === status
                  ? 'bg-coral text-white'
                  : 'bg-white text-charcoal shadow-card-sm hover:bg-gray-light'
              )}
            >
              {PAYMENT_STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="font-body text-sm text-brand-error">{error}</p>}
    </div>
  )
}
