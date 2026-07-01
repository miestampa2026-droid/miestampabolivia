'use client'

import { useMemo, useState } from 'react'
import { formatBs, cn } from '@/lib/utils'
import { groupVariantsByType, type ProductDetail } from '@/lib/queries/catalog'

const VARIANT_LABELS: Record<string, string> = {
  talla: 'Talla',
  color: 'Color',
  tipo_taza: 'Tipo'
}

export function VariantPicker({ product }: { product: ProductDetail }) {
  const groups = useMemo(() => groupVariantsByType(product.variants), [product.variants])

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const [type, variants] of groups) {
      if (variants[0]) initial[type] = variants[0].id
    }
    return initial
  })

  const total = useMemo(() => {
    let sum = product.base_price
    for (const [, variantId] of Object.entries(selected)) {
      for (const [, variants] of groups) {
        const match = variants.find((v) => v.id === variantId)
        if (match) sum += match.price_delta
      }
    }
    return sum
  }, [selected, groups, product.base_price])

  return (
    <div>
      <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-coral">
        {product.category_name}
      </p>
      <h1 className="mt-1 font-display text-[clamp(24px,4vw,36px)] font-bold leading-tight text-charcoal">
        {product.name}
      </h1>
      <p className="mt-3 font-display text-2xl font-extrabold text-charcoal">{formatBs(total)}</p>

      {product.description && (
        <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
          {product.description}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-6">
        {groups.map(([type, variants]) => (
          <div key={type}>
            <span className="mb-2 block font-display text-[13px] font-semibold text-charcoal">
              {VARIANT_LABELS[type] ?? type}
            </span>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const isActive = selected[type] === variant.id
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelected((prev) => ({ ...prev, [type]: variant.id }))}
                    className={cn(
                      'rounded-full border-2 px-4 py-2 font-display text-sm font-bold transition',
                      isActive
                        ? 'border-coral bg-coral text-white'
                        : 'border-gray-light bg-white text-charcoal hover:border-coral'
                    )}
                  >
                    {variant.variant_value}
                    {variant.price_delta > 0 && (
                      <span className="ml-1 font-normal opacity-80">
                        +{formatBs(variant.price_delta)}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled
        className="mt-10 w-full cursor-not-allowed rounded-full bg-coral px-7 py-4 font-display text-[15px] font-bold text-white opacity-45 sm:w-auto"
        title="Disponible cuando esté lista la sección de galería de diseños"
      >
        Elegir diseño
      </button>
      <p className="mt-3 font-body text-xs text-gray-mid">
        Próximamente: elegí un diseño de la galería o subí el tuyo.
      </p>
    </div>
  )
}
