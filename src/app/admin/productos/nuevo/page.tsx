import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminCategories } from '@/lib/queries/adminCatalog'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage() {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const categories = await getAdminCategories(supabase)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/productos"
        className="flex w-fit items-center gap-1 font-display text-sm font-bold text-charcoal hover:text-coral"
      >
        <ChevronLeft size={16} aria-hidden />
        Productos
      </Link>
      <h2 className="font-display text-xl font-bold text-charcoal">Nuevo producto</h2>

      {categories.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 font-body text-sm text-gray-mid shadow-card-sm">
          Primero creá una categoría en{' '}
          <Link href="/admin/categorias" className="font-bold text-coral hover:underline">
            /admin/categorias
          </Link>
          .
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  )
}
