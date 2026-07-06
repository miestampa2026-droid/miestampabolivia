import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer, getFavoriteProducts } from '@/lib/queries/customers'
import { getProductSizes, getProductColors } from '@/lib/queries/catalog'
import { ProductCard } from '@/components/catalog/ProductCard'

export const dynamic = 'force-dynamic'

export default async function FavoritosPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) redirect('/cuenta/login')

  const favorites = await getFavoriteProducts(supabase, customer.id)
  const productIds = favorites.map((p) => p.id)
  const sizesByProduct = await getProductSizes(productIds)
  const colorsByProduct = await getProductColors(productIds)

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card-sm sm:p-8">
      <h2 className="mb-6 font-display text-xl font-bold text-charcoal">Mis favoritos</h2>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="font-body text-sm text-gray-mid">
            Todavía no guardaste ningún producto en favoritos.
          </p>
          <Link
            href="/catalogo"
            className="rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {favorites.map((product) => (
            <ProductCard
              key={product.favorite_id}
              product={product}
              showTechnique
              sizes={sizesByProduct[product.id]}
              colors={colorsByProduct[product.id]}
              isLoggedIn
              initialFavorited
            />
          ))}
        </div>
      )}
    </div>
  )
}
