'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatBs } from '@/lib/utils'
import { useCart } from '@/lib/cart/CartContext'
import type { CartItem } from '@/lib/cart/types'

export function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, incrementQuantity, decrementQuantity } = useCart()

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-card-sm">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-light">
        {/* eslint-disable-next-line @next/next/no-img-element -- preview compuesto, no requiere next/image */}
        <img
          src={item.previewImageUrl}
          alt={item.productName}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-charcoal">{item.productName}</p>
        <p className="font-body text-xs text-gray-mid">
          {item.variantsSnapshot.map((v) => v.value).join(' · ')}
          {item.variantsSnapshot.length > 0 && ' · '}
          {item.designLabel}
        </p>
        <p className="mt-1 font-display text-sm font-extrabold text-coral">
          {formatBs(item.unitPrice)}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-gray-light">
            <button
              type="button"
              onClick={() => decrementQuantity(item.id)}
              className="flex h-7 w-7 items-center justify-center text-charcoal hover:text-coral"
              aria-label="Quitar una unidad"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 text-center font-display text-sm font-bold text-charcoal">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => incrementQuantity(item.id)}
              className="flex h-7 w-7 items-center justify-center text-charcoal hover:text-coral"
              aria-label="Agregar una unidad"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="ml-auto flex items-center gap-1 font-body text-xs text-gray-mid hover:text-brand-error"
          >
            <Trash2 size={14} />
            Quitar
          </button>
        </div>
      </div>
    </div>
  )
}
