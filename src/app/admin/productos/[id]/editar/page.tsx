import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'
import { getAdminCategories, getAdminProductDetail } from '@/lib/queries/adminCatalog'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) redirect('/')

  const [categories, product] = await Promise.all([
    getAdminCategories(supabase),
    getAdminProductDetail(supabase, params.id)
  ])
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/productos"
        className="flex w-fit items-center gap-1 font-display text-sm font-bold text-charcoal hover:text-coral"
      >
        <ChevronLeft size={16} aria-hidden />
        Productos
      </Link>
      <h2 className="font-display text-xl font-bold text-charcoal">Editar producto</h2>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}
