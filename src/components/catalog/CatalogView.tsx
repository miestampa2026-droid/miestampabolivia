'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/catalog/ProductCard'
import { cn } from '@/lib/utils'
import type { Category, ProductListItem } from '@/lib/queries/catalog'

export function CatalogView({
  categories,
  products
}: {
  categories: Category[]
  products: ProductListItem[]
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(
    () => (activeCategory ? products.filter((p) => p.category_id === activeCategory) : products),
    [products, activeCategory]
  )

  return (
    <div>
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition',
            activeCategory === null
              ? 'bg-coral text-white'
              : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
          )}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition',
              activeCategory === cat.id
                ? 'bg-coral text-white'
                : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-body text-gray-mid">
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
