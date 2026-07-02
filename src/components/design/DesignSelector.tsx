'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { DesignGallery } from '@/components/design/DesignGallery'
import { ImageUploadValidator } from '@/components/design/ImageUploadValidator'
import { PreviewApproval } from '@/components/design/PreviewApproval'
import { composePreview } from '@/lib/previewCompose'
import { useCart } from '@/lib/cart/CartContext'
import { cn } from '@/lib/utils'
import { VARIANT_LABELS } from '@/lib/variantLabels'
import type { Design } from '@/lib/queries/designs'
import type { ProductDetail, Variant } from '@/lib/queries/catalog'

type Selection =
  | { source: 'galeria'; design: Design }
  | { source: 'subida'; file: File; previewUrl: string }
  | null

type Step =
  | { name: 'seleccionar' }
  | { name: 'componiendo' }
  | { name: 'preview'; previewUrl: string; uploadWarning: boolean }
  | { name: 'error'; message: string }

async function uploadPreview(blob: Blob): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('preview', blob, 'preview.png')
    const res = await fetch('/api/preview', { method: 'POST', body: formData })
    if (!res.ok) return null
    const data = (await res.json()) as { url: string }
    return data.url
  } catch {
    return null
  }
}

export function DesignSelector({
  product,
  designs,
  selectedVariants
}: {
  product: ProductDetail
  designs: Design[]
  selectedVariants: Variant[]
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const [tab, setTab] = useState<'galeria' | 'subida'>('galeria')
  const [selection, setSelection] = useState<Selection>(null)
  const [step, setStep] = useState<Step>({ name: 'seleccionar' })

  const unitPrice = useMemo(
    () => product.base_price + selectedVariants.reduce((sum, v) => sum + v.price_delta, 0),
    [product.base_price, selectedVariants]
  )

  async function handleContinuar() {
    if (!selection || !product.mockup_image_url) return
    setStep({ name: 'componiendo' })

    const designSrc = selection.source === 'galeria' ? selection.design.image_url : selection.previewUrl

    try {
      const blob = await composePreview(product.mockup_image_url, designSrc, product.print_area)
      const localUrl = URL.createObjectURL(blob)
      const uploadedUrl = await uploadPreview(blob)
      setStep({ name: 'preview', previewUrl: uploadedUrl ?? localUrl, uploadWarning: !uploadedUrl })
    } catch (err) {
      setStep({
        name: 'error',
        message: err instanceof Error ? err.message : 'No se pudo generar el preview.'
      })
    }
  }

  function handleAddToCart(previewUrl: string) {
    if (!selection) return

    addItem({
      productId: product.id,
      productName: product.name,
      categoryName: product.category_name,
      mockupImageUrl: product.mockup_image_url,
      variantsSnapshot: selectedVariants.map((v) => ({
        type: v.variant_type,
        label: VARIANT_LABELS[v.variant_type] ?? v.variant_type,
        value: v.variant_value,
        priceDelta: v.price_delta
      })),
      designSource: selection.source,
      designLabel: selection.source === 'galeria' ? selection.design.name : 'Imagen propia',
      previewImageUrl: previewUrl,
      quantity: 1,
      unitPrice
    })

    router.push('/carrito')
  }

  if (step.name === 'preview') {
    return (
      <PreviewApproval
        previewUrl={step.previewUrl}
        uploadWarning={step.uploadWarning}
        onChangeDesign={() => setStep({ name: 'seleccionar' })}
        onAddToCart={() => handleAddToCart(step.previewUrl)}
      />
    )
  }

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-full bg-gray-light p-1">
        <button
          type="button"
          onClick={() => setTab('galeria')}
          className={cn(
            'flex-1 rounded-full py-2.5 font-display text-sm font-bold transition',
            tab === 'galeria' ? 'bg-white text-charcoal shadow-card-sm' : 'text-gray-mid'
          )}
        >
          Galería
        </button>
        <button
          type="button"
          onClick={() => setTab('subida')}
          className={cn(
            'flex-1 rounded-full py-2.5 font-display text-sm font-bold transition',
            tab === 'subida' ? 'bg-white text-charcoal shadow-card-sm' : 'text-gray-mid'
          )}
        >
          Subir mi imagen
        </button>
      </div>

      {tab === 'galeria' ? (
        <DesignGallery
          designs={designs}
          selectedId={selection?.source === 'galeria' ? selection.design.id : null}
          onSelect={(design) => setSelection({ source: 'galeria', design })}
        />
      ) : (
        <ImageUploadValidator
          onValidated={(file, previewUrl) =>
            setSelection(file && previewUrl ? { source: 'subida', file, previewUrl } : null)
          }
        />
      )}

      <button
        type="button"
        disabled={!selection || !product.mockup_image_url || step.name === 'componiendo'}
        onClick={handleContinuar}
        className={cn(
          'mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-coral px-7 py-4 font-display text-[15px] font-bold text-white transition sm:w-auto',
          !selection || !product.mockup_image_url || step.name === 'componiendo'
            ? 'cursor-not-allowed opacity-45'
            : 'shadow-card-sm hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md'
        )}
      >
        {step.name === 'componiendo' && <Loader2 size={18} className="animate-spin" aria-hidden />}
        {step.name === 'componiendo' ? 'Generando preview…' : 'Continuar'}
      </button>

      {step.name === 'error' && (
        <p className="mt-3 font-body text-sm text-brand-error">{step.message}</p>
      )}
      {step.name !== 'error' && !product.mockup_image_url && (
        <p className="mt-3 font-body text-sm text-brand-warning">
          El preview automático todavía no está disponible para este producto — falta la foto real
          de la prenda (pendiente del cliente).
        </p>
      )}
      {step.name !== 'error' && product.mockup_image_url && (
        <p className="mt-3 font-body text-sm text-gray-mid">
          {selection
            ? 'Listo para generar el preview de tu estampa.'
            : 'Elegí un diseño de la galería o subí el tuyo para continuar.'}
        </p>
      )}
    </div>
  )
}
