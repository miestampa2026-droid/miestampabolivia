'use client'

import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDesignCategories, type Design } from '@/lib/queries/designs'

export function DesignGallery({
  designs,
  selectedId,
  onSelect
}: {
  designs: Design[]
  selectedId: string | null
  onSelect: (design: Design) => void
}) {
  const categories = useMemo(() => getDesignCategories(designs), [designs])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(
    () => (activeCategory ? designs.filter((d) => d.category === activeCategory) : designs),
    [designs, activeCategory]
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
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 font-display text-sm font-bold transition',
              activeCategory === cat
                ? 'bg-coral text-white'
                : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {filtered.map((design) => {
          const isSelected = selectedId === design.id
          return (
            <button
              key={design.id}
              type="button"
              onClick={() => onSelect(design)}
              className={cn(
                'group relative overflow-hidden rounded-2xl bg-white p-4 shadow-card-sm transition duration-200 ease-brand hover:-translate-y-1 hover:shadow-card-lg',
                isSelected && 'ring-2 ring-coral'
              )}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white">
                  <Check size={14} />
                </span>
              )}
              <div className="aspect-square w-full">
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG placeholder, no beneficio de next/image */}
                <img
                  src={design.image_url}
                  alt={design.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-2 text-center font-body text-xs text-gray-mid">{design.name}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
