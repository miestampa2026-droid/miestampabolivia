import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { DesignSelector } from '@/components/design/DesignSelector'
import { getProductWithVariants } from '@/lib/queries/catalog'
import { getDesigns } from '@/lib/queries/designs'

export const revalidate = 0

export default async function DisenoPage({ params }: { params: { id: string } }) {
  const product = await getProductWithVariants(params.id)
  const designs = await getDesigns()

  if (!product) notFound()

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <Link
          href={`/producto/${product.id}`}
          className="mb-6 flex w-fit items-center gap-1 font-display text-sm font-bold text-charcoal hover:text-coral"
        >
          <ChevronLeft size={16} aria-hidden />
          {product.name}
        </Link>

        <span className="block font-display text-[11px] font-bold uppercase tracking-[0.18em] text-coral">
          Paso 2
        </span>
        <h1 className="mb-6 mt-1 font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight text-charcoal">
          Elegí tu diseño
        </h1>

        <DesignSelector designs={designs} />
      </div>
    </main>
  )
}
