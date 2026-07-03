import { CatalogView } from '@/components/catalog/CatalogView'
import {
  getCategoriesWithProducts,
  getProductSizes,
  getProductColors
} from '@/lib/queries/catalog'

export const metadata = {
  title: 'Catálogo — Mi Estampa'
}

export const revalidate = 0

export default async function CatalogoPage({
  searchParams
}: {
  searchParams: { categoria?: string }
}) {
  const { categories, products } = await getCategoriesWithProducts()
  const productIds = products.map((p) => p.id)
  const sizesByProduct = await getProductSizes(productIds)
  const colorsByProduct = await getProductColors(productIds)

  return (
    <main className="min-h-dvh bg-off-white">
      <div className="container py-8 sm:py-12">
        <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-coral">
          Catálogo
        </span>
        <h1 className="mb-6 mt-1 font-display text-[clamp(28px,4vw,48px)] font-bold leading-tight text-charcoal">
          Elegí tu producto
        </h1>

        <CatalogView
          categories={categories}
          products={products}
          sizesByProduct={sizesByProduct}
          colorsByProduct={colorsByProduct}
          initialCategorySlug={searchParams.categoria}
        />
      </div>
    </main>
  )
}
