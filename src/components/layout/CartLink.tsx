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
        <span className="absolute -right-2.5 -top-2.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-coral px-1 font-display text-sm font-bold text-white">
          {count}
        </span>
      )}
      <span className="sr-only">Carrito ({count} items)</span>
    </Link>
  )
}
