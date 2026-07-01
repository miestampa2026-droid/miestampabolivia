import { notFound } from 'next/navigation'
import { VariantPicker } from '@/components/product/VariantPicker'
import { getProductWithVariants } from '@/lib/queries/catalog'

export const revalidate = 0

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const product = await getProductWithVariants(params.id)

  if (!product) notFound()

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-light">
          {product.mockup_image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- SVG placeholder, no beneficio de next/image
            <img
              src={product.mockup_image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <VariantPicker product={product} />
      </div>
    </main>
  )
}
