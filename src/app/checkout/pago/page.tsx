'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Upload } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'
import { getPendingCheckout, clearPendingCheckout, type PendingCheckout } from '@/lib/checkout/pendingCheckout'
import { BANK_INFO } from '@/lib/paymentConfig'
import { formatBs } from '@/lib/utils'
import type { CreateOrderPayload, CreateOrderResult } from '@/lib/orders/types'

export default function PagoPage() {
  const router = useRouter()
  const { clear } = useCart()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [pending, setPending] = useState<PendingCheckout | null>(null)
  const [checked, setChecked] = useState(false)
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPending(getPendingCheckout())
    setChecked(true)
  }, [])

  useEffect(() => {
    if (checked && !pending) {
      router.replace('/checkout')
    }
  }, [checked, pending, router])

  async function handleConfirmarPago() {
    if (!pending) return
    setError(null)
    setLoading(true)

    try {
      const payload: CreateOrderPayload = {
        nombre: pending.nombre,
        whatsapp: pending.whatsapp,
        email: pending.email,
        deliveryMethod: pending.deliveryMethod,
        zoneId: pending.zoneId,
        direccion: pending.direccion,
        items: pending.items
      }

      const formData = new FormData()
      formData.append('payload', JSON.stringify(payload))
      if (comprobante) formData.append('comprobante', comprobante)

      const res = await fetch('/api/orders', { method: 'POST', body: formData })
      const data = (await res.json()) as CreateOrderResult | { error: string }

      if (!res.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'No se pudo crear el pedido')
      }

      clear()
      clearPendingCheckout()
      router.push(`/checkout/confirmacion?order=${data.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el pedido. Probá de nuevo.')
      setLoading(false)
    }
  }

  if (!pending) return null

  return (
    <main className="min-h-dvh bg-coral-light">
      <div className="container flex flex-col items-center py-12 sm:py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-card-md sm:p-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-coral">
            Total a pagar
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-charcoal">
            {formatBs(pending.total)}
          </p>

          <div className="mx-auto mt-6 aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-gray-light">
            <Image
              src={BANK_INFO.qrImageUrl}
              alt="QR de cobro"
              width={280}
              height={280}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>

          <div className="mt-6 flex flex-col gap-1 font-body text-sm text-charcoal">
            <p>
              <span className="font-display font-bold">Banco:</span> {BANK_INFO.bankName}
            </p>
            <p>
              <span className="font-display font-bold">Titular:</span> {BANK_INFO.accountHolder}
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-coral px-5 py-3 font-display text-sm font-bold text-coral transition hover:bg-coral-light">
              <Upload size={16} aria-hidden />
              {comprobante ? comprobante.name : 'Subir comprobante (opcional)'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => setComprobante(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          {error && <p className="mt-3 font-body text-sm text-brand-error">{error}</p>}

          <button
            type="button"
            onClick={handleConfirmarPago}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" aria-hidden />}
            {loading ? 'Enviando…' : 'Ya realicé el pago'}
          </button>

          <p className="mt-3 font-body text-sm text-gray-mid">
            Verificamos tu pago manualmente y te confirmamos por WhatsApp.
          </p>
        </div>
      </div>
    </main>
  )
}
