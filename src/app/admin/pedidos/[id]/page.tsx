import Link from 'next/link'
import { ChevronLeft, Download, TriangleAlert } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminOrderDetail } from '@/lib/queries/admin'
import { OrderStatusControls } from '@/components/admin/OrderStatusControls'
import { formatBs } from '@/lib/utils'
import { formatVariantsSnapshot } from '@/lib/orderLabels'

export const dynamic = 'force-dynamic'

export default async function AdminPedidoDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const order = await getAdminOrderDetail(supabase, params.id)
  if (!order) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/pedidos"
        className="flex w-fit items-center gap-1 font-display text-sm font-bold text-charcoal hover:text-coral"
      >
        <ChevronLeft size={16} aria-hidden />
        Pedidos
      </Link>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <p className="font-display text-xl font-bold text-charcoal">{order.order_number}</p>
        <p className="font-body text-sm text-gray-mid">
          {new Date(order.created_at).toLocaleDateString('es-BO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold text-charcoal">Cliente</p>
            <p className="font-body text-sm text-gray-mid">{order.customer_name}</p>
            <p className="font-body text-sm text-gray-mid">{order.customer_phone}</p>
            <p className="font-body text-sm text-gray-mid">{order.customer_email}</p>
          </div>
          <div>
            <p className="font-display text-sm font-bold text-charcoal">Entrega</p>
            <p className="font-body text-sm text-gray-mid">
              {order.delivery_method === 'envio'
                ? `Envío — ${order.shipping_zone_name ?? ''}`
                : 'Retiro en local'}
            </p>
            {order.shipping_address && (
              <p className="font-body text-sm text-gray-mid">{order.shipping_address}</p>
            )}
          </div>
        </div>

        {order.payment_proof_url && (
          <a
            href={order.payment_proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-coral px-5 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
          >
            <Download size={16} aria-hidden />
            Ver comprobante de pago
          </a>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Estados</h2>
        <OrderStatusControls
          orderId={order.id}
          orderStatus={order.order_status}
          paymentStatus={order.payment_status}
        />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Productos</h2>
        <div className="flex flex-col divide-y divide-gray-light">
          {order.items.map((item) => {
            const isGaleria = item.design_source === 'galeria'
            const variantsText = formatVariantsSnapshot(item.variants_snapshot)

            return (
              <div key={item.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-sm font-bold text-charcoal">{item.product_name_snapshot}</p>
                  <p className="font-body text-sm text-gray-mid">
                    Cantidad: {item.quantity} — {formatBs(item.line_total)}
                  </p>
                  {variantsText && <p className="font-body text-sm text-gray-mid">{variantsText}</p>}
                </div>

                <div className="flex flex-col items-start gap-1 sm:items-end">
                  {isGaleria && item.design_image_url && (
                    <a
                      href={item.design_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border-2 border-charcoal px-4 py-2 font-display text-sm font-bold text-charcoal transition hover:border-coral hover:text-coral"
                    >
                      <Download size={14} aria-hidden />
                      Descargar diseño
                    </a>
                  )}

                  {!isGaleria && (
                    <>
                      {item.original_download_url ? (
                        <a
                          href={item.original_download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full border-2 border-charcoal px-4 py-2 font-display text-sm font-bold text-charcoal transition hover:border-coral hover:text-coral"
                        >
                          <Download size={14} aria-hidden />
                          Descargar imagen original
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 font-body text-sm text-brand-warning">
                          <TriangleAlert size={12} aria-hidden />
                          Sin archivo original guardado
                        </span>
                      )}
                      {item.preview_image_url && (
                        <a
                          href={item.preview_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm text-gray-mid underline hover:text-charcoal"
                        >
                          Ver preview (referencia visual)
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-gray-light pt-4 font-body text-sm text-charcoal">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatBs(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{formatBs(order.shipping_cost)}</span>
          </div>
          <div className="flex justify-between font-display text-base font-extrabold text-charcoal">
            <span>Total</span>
            <span>{formatBs(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
