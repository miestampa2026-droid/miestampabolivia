import { notFound } from 'next/navigation'
import Image from 'next/image'
import { VariantPicker } from '@/components/product/VariantPicker'
import { ProductMockup, type MockupType } from '@/components/product/ProductMockup'
import { getMockupForCategory } from '@/lib/productMockupMap'
import { getProductWithVariants } from '@/lib/queries/catalog'

export const revalidate = 0

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const product = await getProductWithVariants(params.id)

  if (!product) notFound()

  const mockupType = (product.mockup_type as MockupType | null) ?? getMockupForCategory(product.category_name).type

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container grid gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-light">
          {product.mockup_image_url ? (
            <Image
              src={product.mockup_image_url}
              alt={product.name}
              fill
              className="object-contain p-10"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-10">
              <ProductMockup type={mockupType} color="coral" className="h-full w-full" />
            </div>
          )}
        </div>

        <VariantPicker product={product} />
      </div>
    </main>
  )
}
