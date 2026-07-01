'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart/CartContext'

export function CartLink() {
  const { count } = useCart()

  return (
    <Link href="/carrito" className="relative text-charcoal transition hover:text-coral">
      <ShoppingCart size={22} aria-hidden />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 font-display text-[11px] font-bold text-white">
          {count}
        </span>
      )}
      <span className="sr-only">Carrito ({count} items)</span>
    </Link>
  )
}
