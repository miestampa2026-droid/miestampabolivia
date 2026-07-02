'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { formatBs, cn } from '@/lib/utils'
import { groupVariantsByType, type ProductDetail } from '@/lib/queries/catalog'
import { VARIANT_LABELS } from '@/lib/variantLabels'

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
      <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-coral">
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
            <span className="mb-2 block font-display text-sm font-semibold text-charcoal">
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

      <Link
        href={{
          pathname: `/producto/${product.id}/diseno`,
          query: { variantes: Object.values(selected).join(',') }
        }}
        className="mt-10 inline-block w-full rounded-full bg-coral px-7 py-4 text-center font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md sm:w-auto"
      >
        Elegir diseño
      </Link>
    </div>
  )
}
