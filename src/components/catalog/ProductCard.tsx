'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { formatBs, cn } from '@/lib/utils'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { getMockupForCategory } from '@/lib/productMockupMap'
import { resolveProductColor } from '@/lib/productColors'
import type { ProductListItem } from '@/lib/queries/catalog'
import { FavoriteLoginModal } from '@/components/account/FavoriteLoginModal'

export function ProductCard({
  product,
  showTechnique = false,
  sizes,
  colors,
  isLoggedIn = false,
  initialFavorited = false
}: {
  product: ProductListItem
  showTechnique?: boolean
  sizes?: string[]
  colors?: string[]
  isLoggedIn?: boolean
  initialFavorited?: boolean
}) {
  // product.mockup_type/technique son datos reales (columnas products.*).
  // La heurística por categoría queda solo como red de seguridad para
  // productos que todavía no tengan esas columnas cargadas.
  const fallback = getMockupForCategory(product.category_name)
  const mockupType = (product.mockup_type as MockupType | null) ?? fallback.type
  const technique = product.technique
  const [favorited, setFavorited] = useState(initialFavorited)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleToggleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    if (pending) return

    const next = !favorited
    setFavorited(next)
    setPending(true)
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id })
      })
      if (!res.ok) throw new Error('request failed')
      const data = (await res.json()) as { favorited: boolean }
      setFavorited(data.favorited)
    } catch {
      setFavorited(!next)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-card-sm transition duration-200 ease-brand hover:-translate-y-[5px] hover:shadow-card-lg">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative flex h-[200px] items-center justify-center overflow-hidden bg-gray-light p-4">
          {product.mockup_image_url ? (
            <Image
              src={product.mockup_image_url}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <ProductMockup
              type={mockupType}
              color="coral"
              accent={fallback.accent}
              className="h-32 w-32"
            />
          )}
          {product.badge ? (
            <span
              className={cn(
                'absolute left-3 top-3 rounded-full px-3 py-1 font-display text-sm font-bold text-white',
                product.badge === 'Más vendido' ? 'bg-coral' : 'bg-charcoal'
              )}
            >
              {product.badge}
            </span>
          ) : (
            product.category_name && (
              <span className="absolute left-3 top-3 rounded-full bg-coral-light px-3 py-1 font-display text-sm font-bold text-coral-dark">
                {product.category_name}
              </span>
            )
          )}

          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-coral py-3 text-center font-display text-sm font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
            Personalizar →
          </span>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={favorited}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-card-sm transition hover:text-coral"
      >
        <Heart size={16} className={cn(favorited && 'fill-coral text-coral')} aria-hidden />
      </button>

      {showLoginPrompt && <FavoriteLoginModal onClose={() => setShowLoginPrompt(false)} />}

      <Link href={`/producto/${product.id}`} className="block p-4">
        <p className="mb-1 font-display text-[16px] font-bold text-charcoal">{product.name}</p>

        {showTechnique && technique && (
          <span className="mb-2 inline-block rounded-full bg-[#0D9488] px-2.5 py-0.5 font-display text-sm font-bold text-white">
            {technique}
          </span>
        )}

        {colors && colors.length > 0 && (
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            {colors.map((c) => (
              <span
                key={c}
                title={c}
                className="h-4 w-4 rounded-full border border-gray-light"
                style={{ backgroundColor: resolveProductColor(c) }}
              />
            ))}
          </div>
        )}

        <p className="font-display text-xl font-extrabold text-coral">
          {formatBs(product.base_price)}
        </p>

        {sizes && sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {sizes.map((s) => (
              <span
                key={s}
                className="rounded bg-gray-light px-1.5 py-0.5 font-display text-sm font-semibold text-gray-mid"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
