'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal, X, Check } from 'lucide-react'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/utils'
import { resolveProductColor } from '@/lib/productColors'
import type { Category, ProductListItem } from '@/lib/queries/catalog'

type SortOption = 'popular' | 'precio-asc' | 'precio-desc'

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Única']
const TECHNIQUE_ORDER = ['Sublimación', 'Serigrafía', 'DTF', 'Bordado']
const BADGE_RANK: Record<string, number> = { 'Más vendido': 0, Nuevo: 1 }

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export function CatalogView({
  categories,
  products,
  sizesByProduct,
  colorsByProduct,
  initialCategorySlug,
  isLoggedIn = false,
  favoriteProductIds
}: {
  categories: Category[]
  products: ProductListItem[]
  sizesByProduct: Record<string, string[]>
  colorsByProduct: Record<string, string[]>
  initialCategorySlug?: string
  isLoggedIn?: boolean
  favoriteProductIds?: Set<string>
}) {
  const [categorySlug, setCategorySlug] = useState<string | null>(
    initialCategorySlug && categories.some((c) => c.slug === initialCategorySlug)
      ? initialCategorySlug
      : null
  )
  const [technique, setTechnique] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set())
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set())
  const [badge, setBadge] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('popular')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const countByCategoryId = useMemo(() => {
    const map: Record<string, number> = {}
    for (const p of products) map[p.category_id] = (map[p.category_id] ?? 0) + 1
    return map
  }, [products])

  // Opciones derivadas de los datos reales — solo se ofrecen filtros
  // que pueden dar resultados (nada de tallas/colores muertos).
  const availableTechniques = useMemo(() => {
    const present = new Set(products.map((p) => p.technique).filter(Boolean) as string[])
    return TECHNIQUE_ORDER.filter((t) => present.has(t))
  }, [products])

  const availableSizes = useMemo(() => {
    const present = new Set(Object.values(sizesByProduct).flat())
    return SIZE_ORDER.filter((s) => present.has(s))
  }, [sizesByProduct])

  const availableColors = useMemo(() => {
    const seen: string[] = []
    for (const list of Object.values(colorsByProduct)) {
      for (const c of list) if (!seen.includes(c)) seen.push(c)
    }
    return seen
  }, [colorsByProduct])

  const hasActiveFilters =
    categorySlug !== null ||
    technique !== null ||
    badge !== null ||
    selectedSizes.size > 0 ||
    selectedColors.size > 0

  function clearFilters() {
    setCategorySlug(null)
    setTechnique(null)
    setBadge(null)
    setSelectedSizes(new Set())
    setSelectedColors(new Set())
  }

  const filtered = useMemo(() => {
    const activeCategory = categories.find((c) => c.slug === categorySlug)

    const result = products.filter((p) => {
      if (activeCategory && p.category_id !== activeCategory.id) return false
      if (technique && p.technique !== technique) return false
      if (badge && p.badge !== badge) return false
      if (selectedSizes.size > 0) {
        const sizes = sizesByProduct[p.id] ?? []
        if (!sizes.some((s) => selectedSizes.has(s))) return false
      }
      if (selectedColors.size > 0) {
        const colors = colorsByProduct[p.id] ?? []
        if (!colors.some((c) => selectedColors.has(c))) return false
      }
      return true
    })

    if (sort === 'precio-asc') return result.toSorted((a, b) => a.base_price - b.base_price)
    if (sort === 'precio-desc') return result.toSorted((a, b) => b.base_price - a.base_price)
    return result.toSorted(
      (a, b) => (BADGE_RANK[a.badge ?? ''] ?? 2) - (BADGE_RANK[b.badge ?? ''] ?? 2)
    )
  }, [
    products,
    categories,
    categorySlug,
    technique,
    badge,
    selectedSizes,
    selectedColors,
    sizesByProduct,
    colorsByProduct,
    sort
  ])

  const sidebar = (
    <div className="flex flex-col gap-8">
      <div className="hidden items-center gap-2 lg:flex">
        <Logo size={24} />
        <span className="font-display text-base font-bold text-charcoal">Productos</span>
      </div>

      <div>
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-gray-mid">
          Categorías
        </p>
        <ul className="flex flex-col">
          <li>
            <button
              type="button"
              onClick={() => setCategorySlug(null)}
              className={cn(
                'w-full border-l-[3px] px-3 py-2 text-left font-display text-sm font-bold transition',
                categorySlug === null
                  ? 'border-coral bg-coral-light text-coral'
                  : 'border-transparent text-charcoal hover:text-coral'
              )}
            >
              Todos los productos ({products.length})
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => setCategorySlug(cat.slug)}
                className={cn(
                  'w-full border-l-[3px] px-3 py-2 text-left font-display text-sm font-bold transition',
                  categorySlug === cat.slug
                    ? 'border-coral bg-coral-light text-coral'
                    : 'border-transparent text-charcoal hover:text-coral'
                )}
              >
                {cat.name} ({countByCategoryId[cat.id] ?? 0})
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-gray-mid">
          Técnica de impresión
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTechnique(null)}
            className={cn(
              'rounded-full px-3.5 py-1.5 font-display text-sm font-bold transition',
              technique === null
                ? 'bg-coral text-white'
                : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
            )}
          >
            Todas
          </button>
          {availableTechniques.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTechnique(technique === t ? null : t)}
              className={cn(
                'rounded-full px-3.5 py-1.5 font-display text-sm font-bold transition',
                technique === t
                  ? 'bg-coral text-white'
                  : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {availableSizes.length > 0 && (
        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-gray-mid">
            Tallas disponibles
          </p>
          <div className="grid grid-cols-4 gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSizes((prev) => toggleInSet(prev, s))}
                className={cn(
                  'rounded-full py-1.5 text-center font-display text-sm font-bold transition',
                  selectedSizes.has(s)
                    ? 'bg-coral text-white'
                    : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableColors.length > 0 && (
        <div>
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-gray-mid">
            Colores
          </p>
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((c) => {
              const isActive = selectedColors.has(c)
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  aria-label={`Color ${c}`}
                  aria-pressed={isActive}
                  onClick={() => setSelectedColors((prev) => toggleInSet(prev, c))}
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border transition duration-200 ease-brand',
                    isActive ? 'scale-[1.15] border-2 border-coral' : 'border-gray-light'
                  )}
                  style={{ backgroundColor: resolveProductColor(c) }}
                >
                  {isActive && (
                    <Check
                      size={11}
                      className={
                        ['blanco', 'natural', 'beige', 'amarillo'].includes(c.toLowerCase())
                          ? 'text-charcoal'
                          : 'text-white'
                      }
                      aria-hidden
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-full border-2 border-coral px-5 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="flex items-start gap-8">
      {/* Sidebar desktop */}
      <aside className="sticky top-24 hidden w-[260px] shrink-0 lg:block">{sidebar}</aside>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-charcoal/40"
          />
          <div className="absolute inset-y-0 left-0 w-[300px] overflow-y-auto bg-white p-6 shadow-card-lg">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-base font-bold text-charcoal">Filtros</span>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-light text-charcoal"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Barra superior */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-sm font-bold text-charcoal shadow-card-sm transition hover:bg-coral-light lg:hidden"
          >
            <SlidersHorizontal size={15} aria-hidden />
            Filtros
          </button>

          <span className="font-body text-sm text-gray-mid">
            Mostrando {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
          </span>

          <div className="flex flex-wrap gap-2">
            {(['Más vendido', 'Nuevo'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBadge(badge === b ? null : b)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 font-display text-sm font-bold transition',
                  badge === b
                    ? 'bg-coral text-white'
                    : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
                )}
              >
                {b}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setTechnique(technique === 'Sublimación' ? null : 'Sublimación')}
              className={cn(
                'rounded-full px-3.5 py-1.5 font-display text-sm font-bold transition',
                technique === 'Sublimación'
                  ? 'bg-coral text-white'
                  : 'bg-white text-charcoal shadow-card-sm hover:bg-coral-light'
              )}
            >
              Sublimación
            </button>
          </div>

          <label className="ml-auto flex items-center gap-2 font-body text-sm text-gray-mid">
            Ordenar:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-md border-[1.5px] border-gray-light bg-white px-3 py-1.5 font-display text-sm font-bold text-charcoal outline-none transition focus:border-coral"
            >
              <option value="popular">Más popular</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="font-body text-base text-gray-mid">
              No hay productos que coincidan con esos filtros.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showTechnique
                sizes={sizesByProduct[product.id]}
                colors={colorsByProduct[product.id]}
                isLoggedIn={isLoggedIn}
                initialFavorited={favoriteProductIds?.has(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
