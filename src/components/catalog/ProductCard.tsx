import Link from 'next/link'
import { formatBs } from '@/lib/utils'
import { ProductMockup } from '@/components/product/ProductMockup'
import { getMockupForCategory } from '@/lib/productMockupMap'
import type { ProductListItem } from '@/lib/queries/catalog'

export function ProductCard({ product }: { product: ProductListItem }) {
  const mockup = getMockupForCategory(product.category_name)

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card-sm transition duration-200 ease-brand hover:-translate-y-1 hover:shadow-card-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-light p-6">
        <ProductMockup
          type={mockup.type}
          color="coral"
          accent={mockup.accent}
          className="h-full w-full"
        />
        {product.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-coral-light px-3 py-1 font-display text-sm font-bold text-coral-dark">
            {product.category_name}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="mb-1 font-display text-[16px] font-bold text-charcoal">{product.name}</p>
        <p className="font-display text-lg font-extrabold text-coral">
          {formatBs(product.base_price)}
        </p>
      </div>
    </Link>
  )
}
