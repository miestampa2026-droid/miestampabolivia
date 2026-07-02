'use client'

import { useState } from 'react'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { PRODUCT_COLORS } from '@/lib/productColors'
import { cn } from '@/lib/utils'

const TYPES: MockupType[] = ['polera', 'blusa', 'gorra', 'taza', 'sueter', 'totebag']
const COLOR_NAMES = Object.keys(PRODUCT_COLORS)

export default function MockupDevPage() {
  const [color, setColor] = useState('blanco')

  return (
    <main className="min-h-dvh bg-off-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 font-display text-2xl font-bold text-charcoal">
          QA aislado — &lt;ProductMockup /&gt;
        </h1>
        <p className="mb-8 font-body text-sm text-gray-mid">
          Paso 1 del rediseño. Ruta interna, no enlazada desde la nav.
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {COLOR_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setColor(name)}
              className={cn(
                'rounded-full border-2 px-4 py-2 font-display text-sm font-bold transition',
                color === name
                  ? 'border-coral bg-coral text-white'
                  : 'border-gray-light bg-white text-charcoal hover:border-coral'
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {TYPES.map((type) => (
            <div key={type} className="rounded-2xl bg-white p-4 shadow-card-sm">
              <div className="aspect-square rounded-md bg-gray-light">
                <ProductMockup type={type} color={color} className="h-full w-full" />
              </div>
              <p className="mt-2 text-center font-display text-sm font-bold capitalize text-charcoal">
                {type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
