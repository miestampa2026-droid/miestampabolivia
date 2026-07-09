'use client'

import { useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { PRODUCT_COLORS } from '@/lib/productColors'
import type { AdminCategory, AdminProductDetail } from '@/lib/queries/adminCatalog'
import type { MockupType } from '@/components/product/ProductMockup'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

const TALLA_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const TECHNIQUE_OPTIONS = ['Sublimación', 'Serigrafía', 'DTF', 'Bordado']
const BADGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Ninguno' },
  { value: 'Más vendido', label: 'Más vendido' },
  { value: 'Nuevo', label: 'Nuevo' }
]
const MOCKUP_TYPE_OPTIONS: Array<{ value: MockupType; label: string }> = [
  { value: 'polera', label: 'Polera' },
  { value: 'blusa', label: 'Blusa' },
  { value: 'gorra', label: 'Gorra' },
  { value: 'taza', label: 'Taza' },
  { value: 'sueter', label: 'Suéter' },
  { value: 'totebag', label: 'Tote bag' }
]
const COLOR_OPTIONS = Object.entries(PRODUCT_COLORS).map(([key, hex]) => ({
  value: key.charAt(0).toUpperCase() + key.slice(1),
  hex
}))

// print_area no es editable acá (fue calibrado a mano por tipo de
// prenda en una sesión anterior) — productos nuevos usan el default
// que ya funciona bien para prendas planas.
const DEFAULT_PRINT_AREA = { x: 0.35, y: 0.32, w: 0.3, h: 0.32 }

function variantsToDeltaMap(
  variants: AdminProductDetail['variants'] | undefined,
  type: string
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const v of variants ?? []) {
    if (v.variant_type === type) map[v.variant_value] = v.price_delta
  }
  return map
}

export function ProductForm({
  categories,
  product
}: {
  categories: AdminCategory[]
  product?: AdminProductDetail
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? '')
  const [basePrice, setBasePrice] = useState(product ? String(product.base_price) : '')
  const [technique, setTechnique] = useState(product?.technique ?? TECHNIQUE_OPTIONS[0])
  const [mockupType, setMockupType] = useState<MockupType>(
    (product?.mockup_type as MockupType) ?? 'polera'
  )
  const [badge, setBadge] = useState(product?.badge ?? '')
  const [mockupImageUrl, setMockupImageUrl] = useState<string | null>(product?.mockup_image_url ?? null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const [tallaDeltas, setTallaDeltas] = useState<Record<string, number>>(() =>
    variantsToDeltaMap(product?.variants, 'talla')
  )
  const [colorDeltas, setColorDeltas] = useState<Record<string, number>>(() =>
    variantsToDeltaMap(product?.variants, 'color')
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTalla(value: string) {
    setTallaDeltas((prev) => {
      const next = { ...prev }
      if (value in next) delete next[value]
      else next[value] = 0
      return next
    })
  }

  function toggleColor(value: string) {
    setColorDeltas((prev) => {
      const next = { ...prev }
      if (value in next) delete next[value]
      else next[value] = 0
      return next
    })
  }

  async function handleFile(file: File) {
    setError(null)
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/products/upload-mockup', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo subir la imagen')
      setMockupImageUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !categoryId || !basePrice) {
      setError('Completá nombre, categoría y precio.')
      return
    }

    setSaving(true)
    const supabase = createBrowserSupabase()

    const productPayload = {
      name: name.trim(),
      description: description.trim() || null,
      category_id: categoryId,
      base_price: Number(basePrice),
      technique,
      mockup_type: mockupType,
      mockup_image_url: mockupImageUrl,
      badge: badge || null
    }

    let productId = product?.id ?? null

    if (product) {
      const { error: updateError } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', product.id)
      if (updateError) {
        setSaving(false)
        setError(updateError.message)
        return
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('products')
        .insert({
          ...productPayload,
          print_area_x: DEFAULT_PRINT_AREA.x,
          print_area_y: DEFAULT_PRINT_AREA.y,
          print_area_w: DEFAULT_PRINT_AREA.w,
          print_area_h: DEFAULT_PRINT_AREA.h
        })
        .select('id')
        .single()
      if (insertError || !inserted) {
        setSaving(false)
        setError(insertError?.message ?? 'No se pudo crear el producto')
        return
      }
      productId = inserted.id
    }

    // Variantes: se reemplazan todas (no hay historial de variantes que
    // preservar — los pedidos guardan su propio snapshot aparte).
    if (product) {
      const { error: deleteError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId as string)
      if (deleteError) {
        setSaving(false)
        setError(deleteError.message)
        return
      }
    }

    const variantRows = [
      ...Object.entries(tallaDeltas).map(([value, priceDelta]) => ({
        product_id: productId as string,
        variant_type: 'talla',
        variant_value: value,
        price_delta: priceDelta
      })),
      ...Object.entries(colorDeltas).map(([value, priceDelta]) => ({
        product_id: productId as string,
        variant_type: 'color',
        variant_value: value,
        price_delta: priceDelta
      }))
    ]

    if (variantRows.length > 0) {
      const { error: variantsError } = await supabase.from('product_variants').insert(variantRows)
      if (variantsError) {
        setSaving(false)
        setError(variantsError.message)
        return
      }
    }

    setSaving(false)
    router.push('/admin/productos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Foto del producto</h2>

        {mockupImageUrl ? (
          <div className="mx-auto flex flex-col items-center gap-3">
            <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-gray-light">
              {/* eslint-disable-next-line @next/next/no-img-element -- puede ser una URL recien subida */}
              <img src={mockupImageUrl} alt="Mockup del producto" className="h-full w-full object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setMockupImageUrl(null)}
              className="font-display text-sm font-bold text-coral hover:text-coral-dark"
            >
              Cambiar imagen
            </button>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) void handleFile(file)
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-white px-6 py-12 text-center transition',
              dragOver ? 'border-coral bg-coral-light/30' : 'border-gray-light hover:border-coral'
            )}
          >
            {uploadingImage ? (
              <Loader2 size={28} className="animate-spin text-coral" aria-hidden />
            ) : (
              <Upload size={28} className="text-coral" aria-hidden />
            )}
            <span className="font-display text-sm font-bold text-charcoal">
              {uploadingImage ? 'Subiendo…' : 'Arrastrá una imagen o hacé clic'}
            </span>
            <span className="font-body text-sm text-gray-mid">PNG o JPG, fondo claro recomendado</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
          </label>
        )}

        <div>
          <label className="mb-1.5 mt-6 block font-display text-sm font-semibold text-charcoal">
            Icono de respaldo (si no hay foto)
          </label>
          <div className="flex flex-wrap gap-2">
            {MOCKUP_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMockupType(opt.value)}
                className={cn(
                  'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                  mockupType === opt.value
                    ? 'bg-charcoal text-white'
                    : 'bg-gray-light text-charcoal hover:bg-coral-light'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Datos generales</h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Nombre</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Descripción
            </label>
            <textarea
              className={cn(inputClass, 'min-h-[90px] resize-y')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Categoría
              </label>
              <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Precio base (Bs.)
              </label>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Técnica de impresión
              </label>
              <select className={inputClass} value={technique} onChange={(e) => setTechnique(e.target.value)}>
                {TECHNIQUE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Badge (opcional)
              </label>
              <select className={inputClass} value={badge} onChange={(e) => setBadge(e.target.value)}>
                {BADGE_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
        <h2 className="mb-4 font-display text-sm font-bold text-charcoal">Variantes</h2>

        <p className="mb-2 font-display text-sm font-semibold text-charcoal">Tallas</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {TALLA_OPTIONS.map((size) => {
            const selected = size in tallaDeltas
            return (
              <div key={size} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleTalla(size)}
                  className={cn(
                    'rounded-full px-4 py-2 font-display text-sm font-bold transition',
                    selected ? 'bg-coral text-white' : 'bg-gray-light text-charcoal hover:bg-coral-light'
                  )}
                >
                  {size}
                </button>
                {selected && (
                  <input
                    type="number"
                    step="0.01"
                    value={tallaDeltas[size]}
                    onChange={(e) =>
                      setTallaDeltas((prev) => ({ ...prev, [size]: Number(e.target.value) }))
                    }
                    title={`Recargo por talla ${size}`}
                    className="w-16 rounded-md border-[1.5px] border-gray-light px-2 py-1 font-body text-sm"
                  />
                )}
              </div>
            )
          })}
        </div>

        <p className="mb-2 font-display text-sm font-semibold text-charcoal">Colores</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => {
            const selected = color.value in colorDeltas
            return (
              <div key={color.value} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleColor(color.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-full border-2 px-3 py-2 font-display text-sm font-bold transition',
                    selected ? 'border-coral bg-coral-light/40 text-charcoal' : 'border-gray-light text-charcoal hover:border-coral'
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-gray-light"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  {color.value}
                </button>
                {selected && (
                  <input
                    type="number"
                    step="0.01"
                    value={colorDeltas[color.value]}
                    onChange={(e) =>
                      setColorDeltas((prev) => ({ ...prev, [color.value]: Number(e.target.value) }))
                    }
                    title={`Recargo por color ${color.value}`}
                    className="w-16 rounded-md border-[1.5px] border-gray-light px-2 py-1 font-body text-sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {error && <p className="font-body text-sm text-brand-error">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingImage}
        className="w-fit rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
      >
        {saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </form>
  )
}
