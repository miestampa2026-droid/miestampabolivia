'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/CartContext'
import { getShippingZones, type ShippingZone } from '@/lib/queries/shipping'
import { formatBs, cn } from '@/lib/utils'
import { savePendingCheckout } from '@/lib/checkout/pendingCheckout'
import type { Customer, CustomerAddress } from '@/lib/queries/customers'

const NEW_ADDRESS = '__new__'

function formatAddress(addr: CustomerAddress): string {
  const parts = [addr.address_line, `${addr.city}, ${addr.department}`]
  if (addr.reference) parts.push(addr.reference)
  return parts.join(' — ')
}

export function CheckoutView({
  customer,
  addresses
}: {
  customer: Customer | null
  addresses: CustomerAddress[]
}) {
  const router = useRouter()
  const { items, subtotal } = useCart()
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<'envio' | 'retiro'>('envio')
  const [zoneId, setZoneId] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id ?? NEW_ADDRESS)

  const [form, setForm] = useState({
    nombre: customer?.name ?? '',
    whatsapp: customer?.phone ?? '',
    email: customer?.email ?? '',
    direccion: defaultAddress ? formatAddress(defaultAddress) : ''
  })

  useEffect(() => {
    getShippingZones()
      .then(setZones)
      .catch(() => setZones([]))
  }, [])

  function handleSelectAddress(id: string) {
    setSelectedAddressId(id)
    if (id === NEW_ADDRESS) {
      setForm((f) => ({ ...f, direccion: '' }))
      return
    }
    const addr = addresses.find((a) => a.id === id)
    if (addr) setForm((f) => ({ ...f, direccion: formatAddress(addr) }))
  }

  const selectedZone = zones.find((z) => z.id === zoneId) ?? null
  const shippingCost = deliveryMethod === 'envio' ? (selectedZone?.cost ?? 0) : 0
  const total = subtotal + shippingCost

  function handleContinuar() {
    setFormError(null)

    if (!form.nombre.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setFormError('Completá nombre, WhatsApp y email.')
      return
    }
    if (deliveryMethod === 'envio' && !zoneId) {
      setFormError('Elegí tu zona de envío.')
      return
    }
    if (deliveryMethod === 'envio' && !form.direccion.trim()) {
      setFormError('Completá la dirección de envío.')
      return
    }

    savePendingCheckout({
      nombre: form.nombre,
      whatsapp: form.whatsapp,
      email: form.email,
      deliveryMethod,
      zoneId: deliveryMethod === 'envio' ? zoneId : null,
      direccion: deliveryMethod === 'envio' ? form.direccion : null,
      items,
      subtotal,
      shippingCost,
      total
    })

    router.push('/checkout/pago')
  }

  if (items.length === 0) {
    return (
      <main className="min-h-dvh bg-off-white">
        <div className="container flex flex-col items-center py-20 text-center">
          <h1 className="mb-2 font-display text-xl font-bold text-charcoal">Tu carrito está vacío</h1>
          <p className="mb-8 font-body text-sm text-gray-mid">
            Agregá un producto antes de ir al checkout.
          </p>
          <Link
            href="/catalogo"
            className="rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Ver catálogo
          </Link>
        </div>
      </main>
    )
  }

  const inputClass =
    'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <h1 className="mb-6 font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight text-charcoal">
          Checkout
        </h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex flex-1 flex-col gap-6">
            <div>
              <h2 className="mb-3 font-display text-sm font-bold text-charcoal">Tus datos</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    Nombre completo
                  </label>
                  <input
                    className={inputClass}
                    value={form.nombre}
                    onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    WhatsApp
                  </label>
                  <input
                    className={inputClass}
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="7XXXXXXX"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                    Email
                  </label>
                  <input
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="tu@email.com"
                    type="email"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 font-display text-sm font-bold text-charcoal">Entrega</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('envio')}
                  className={cn(
                    'flex-1 rounded-full border-2 py-3 font-display text-sm font-bold transition',
                    deliveryMethod === 'envio'
                      ? 'border-coral bg-coral text-white'
                      : 'border-gray-light bg-white text-charcoal hover:border-coral'
                  )}
                >
                  Envío a domicilio
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('retiro')}
                  className={cn(
                    'flex-1 rounded-full border-2 py-3 font-display text-sm font-bold transition',
                    deliveryMethod === 'retiro'
                      ? 'border-coral bg-coral text-white'
                      : 'border-gray-light bg-white text-charcoal hover:border-coral'
                  )}
                >
                  Retiro en local
                </button>
              </div>

              {deliveryMethod === 'envio' && (
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                      Zona / departamento
                    </label>
                    <select
                      className={inputClass}
                      value={zoneId}
                      onChange={(e) => setZoneId(e.target.value)}
                    >
                      <option value="">Elegí tu zona</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — {formatBs(zone.cost)}
                          {zone.estimated_days ? ` (${zone.estimated_days})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {addresses.length > 0 && (
                    <div>
                      <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                        Dirección guardada
                      </label>
                      <div className="flex flex-col gap-2">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={cn(
                              'flex cursor-pointer items-start gap-2 rounded-md border-[1.5px] p-3 font-body text-sm transition',
                              selectedAddressId === addr.id
                                ? 'border-coral bg-coral-light/40'
                                : 'border-gray-light hover:border-coral'
                            )}
                          >
                            <input
                              type="radio"
                              name="direccion-guardada"
                              className="mt-0.5 h-4 w-4 text-coral"
                              checked={selectedAddressId === addr.id}
                              onChange={() => handleSelectAddress(addr.id)}
                            />
                            <span>
                              <span className="font-display font-bold text-charcoal">
                                {addr.label || 'Dirección'}
                              </span>{' '}
                              <span className="text-gray-mid">— {formatAddress(addr)}</span>
                            </span>
                          </label>
                        ))}
                        <label
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-md border-[1.5px] p-3 font-body text-sm transition',
                            selectedAddressId === NEW_ADDRESS
                              ? 'border-coral bg-coral-light/40'
                              : 'border-gray-light hover:border-coral'
                          )}
                        >
                          <input
                            type="radio"
                            name="direccion-guardada"
                            className="h-4 w-4 text-coral"
                            checked={selectedAddressId === NEW_ADDRESS}
                            onChange={() => handleSelectAddress(NEW_ADDRESS)}
                          />
                          Usar dirección nueva
                        </label>
                      </div>
                    </div>
                  )}

                  {(addresses.length === 0 || selectedAddressId === NEW_ADDRESS) && (
                    <div>
                      <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                        Dirección
                      </label>
                      <input
                        className={inputClass}
                        value={form.direccion}
                        onChange={(e) => setForm((f) => ({ ...f, direccion: e.target.value }))}
                        placeholder="Calle, número, referencia"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full rounded-2xl bg-white p-6 shadow-card-sm lg:w-80 lg:shrink-0">
            <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Resumen</h2>
            <div className="flex flex-col gap-2 font-body text-sm text-charcoal">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatBs(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{deliveryMethod === 'retiro' ? 'Gratis' : formatBs(shippingCost)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-gray-light pt-2 font-display text-base font-extrabold text-charcoal">
                <span>Total</span>
                <span>{formatBs(total)}</span>
              </div>
            </div>

            {/* customer?.id viaja implícito en la sesión: el route handler de
                creación de pedido lee el customer desde la cookie de sesión,
                nunca del formulario. */}
            <button
              type="button"
              onClick={handleContinuar}
              className="mt-6 w-full rounded-full bg-coral px-7 py-4 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
            >
              Continuar al pago
            </button>
            {formError && <p className="mt-3 font-body text-sm text-brand-error">{formError}</p>}
          </div>
        </div>
      </div>
    </main>
  )
}
