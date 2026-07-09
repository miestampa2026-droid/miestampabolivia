'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2 } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn, formatBs } from '@/lib/utils'
import type { AdminProductListItem } from '@/lib/queries/adminCatalog'

export function AdminProductsView({ products }: { products: AdminProductListItem[] }) {
  const router = useRouter()
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  async function toggleActive(product: AdminProductListItem) {
    setError(null)
    setTogglingId(product.id)
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)
    setTogglingId(null)

    if (updateError) {
      setError(updateError.message)
      return
    }
    router.refresh()
  }

  async function handleDelete(product: AdminProductListItem) {
    setError(null)
    const supabase = createBrowserSupabase()
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id)
    setConfirmingDelete(null)

    if (deleteError) {
      setError(`No se pudo eliminar "${product.name}": ${deleteError.message}`)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 font-body text-sm text-brand-error">{error}</p>}

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div key={product.id} className="rounded-2xl bg-white p-4 shadow-card-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-light">
                  {product.mockup_image_url && (
                    <Image
                      src={product.mockup_image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold text-charcoal">{product.name}</p>
                  <p className="font-body text-sm text-gray-mid">
                    {product.category_name} — {formatBs(product.base_price)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(product)}
                  disabled={togglingId === product.id}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 font-display text-sm font-bold transition disabled:opacity-60',
                    product.active
                      ? 'bg-brand-success/15 text-brand-success hover:bg-brand-success/25'
                      : 'bg-gray-light text-gray-mid hover:bg-charcoal/10'
                  )}
                >
                  {product.active ? 'Activo' : 'Inactivo'}
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/productos/${product.id}/editar`}
                    aria-label="Editar producto"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-gray-light hover:text-coral"
                  >
                    <Pencil size={16} aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(product.id)}
                    aria-label="Eliminar producto"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-gray-light hover:text-brand-error"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            {confirmingDelete === product.id && (
              <div className="mt-4 rounded-lg border-[1.5px] border-brand-warning bg-amber-50 p-4">
                <p className="font-body text-sm text-amber-800">
                  ¿Eliminar &quot;{product.name}&quot;? Se borran también sus variantes. Esta acción no se
                  puede deshacer.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="rounded-full bg-brand-error px-5 py-2 font-display text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(null)}
                    className="rounded-full border-2 border-charcoal px-5 py-2 font-display text-sm font-bold text-charcoal transition hover:bg-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Link
        href="/admin/productos/nuevo"
        className="w-fit rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
      >
        + Nuevo producto
      </Link>
    </div>
  )
}
