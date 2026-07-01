'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { CartItemRow } from '@/components/cart/CartItemRow'
import { useCart } from '@/lib/cart/CartContext'
import { formatBs } from '@/lib/utils'

export default function CarritoPage() {
  const { items, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-dvh bg-off-white">
        <div className="container flex flex-col items-center py-20 text-center">
          <ShoppingBag size={40} className="mb-4 text-gray-mid" aria-hidden />
          <h1 className="mb-2 font-display text-xl font-bold text-charcoal">Tu carrito está vacío</h1>
          <p className="mb-8 font-body text-sm text-gray-mid">
            Elegí un producto y personalizalo con tu estampa.
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

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <h1 className="mb-6 font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight text-charcoal">
          Tu carrito
        </h1>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-card-sm">
          <div className="flex items-center justify-between">
            <span className="font-body text-base text-charcoal">Subtotal</span>
            <span className="font-display text-xl font-extrabold text-charcoal">
              {formatBs(subtotal)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-full bg-coral px-7 py-4 text-center font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Ir a pagar
          </Link>
          <Link
            href="/catalogo"
            className="mt-3 block w-full text-center font-display text-sm font-bold text-coral hover:text-coral-dark"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}
