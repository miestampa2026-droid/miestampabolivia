'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, TriangleAlert } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { CategoryFormModal } from '@/components/admin/CategoryFormModal'
import type { AdminCategory } from '@/lib/queries/adminCatalog'

export function AdminCategoriesView({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  async function handleSave(data: { name: string; slug: string }): Promise<string | null> {
    const supabase = createBrowserSupabase()

    if (editing) {
      const { error } = await supabase
        .from('products_categories')
        .update({ name: data.name, slug: data.slug })
        .eq('id', editing.id)
      if (error) return error.message
    } else {
      const maxSort = categories.reduce((max, c) => Math.max(max, c.sort_order), 0)
      const { error } = await supabase
        .from('products_categories')
        .insert({ name: data.name, slug: data.slug, sort_order: maxSort + 1 })
      if (error) return error.message
    }

    router.refresh()
    return null
  }

  async function handleDelete(category: AdminCategory) {
    setDeleteError(null)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.from('products_categories').delete().eq('id', category.id)
    setConfirmingDelete(null)

    if (error) {
      setDeleteError(`No se pudo eliminar "${category.name}": ${error.message}`)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      {deleteError && (
        <p className="rounded-md bg-red-50 px-4 py-3 font-body text-sm text-brand-error">{deleteError}</p>
      )}

      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl bg-white p-5 shadow-card-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-sm font-bold text-charcoal">{cat.name}</p>
                <p className="font-body text-sm text-gray-mid">
                  /{cat.slug} — {cat.product_count} producto{cat.product_count === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(cat)}
                  aria-label="Editar categoría"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-gray-light hover:text-coral"
                >
                  <Pencil size={16} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(cat.id)}
                  aria-label="Eliminar categoría"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-gray-light hover:text-brand-error"
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </div>

            {confirmingDelete === cat.id && (
              <div className="mt-4 rounded-lg border-[1.5px] border-brand-warning bg-amber-50 p-4">
                {cat.product_count > 0 ? (
                  <p className="flex items-start gap-2 font-body text-sm text-amber-800">
                    <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
                    Esta categoría tiene {cat.product_count} producto{cat.product_count === 1 ? '' : 's'}{' '}
                    asociado{cat.product_count === 1 ? '' : 's'}. Reasigná o eliminá esos productos primero
                    para poder borrarla.
                  </p>
                ) : (
                  <p className="font-body text-sm text-amber-800">
                    ¿Eliminar la categoría &quot;{cat.name}&quot;? Esta acción no se puede deshacer.
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  {cat.product_count === 0 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="rounded-full bg-brand-error px-5 py-2 font-display text-sm font-bold text-white transition hover:opacity-90"
                    >
                      Sí, eliminar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(null)}
                    className={cn(
                      'rounded-full border-2 border-charcoal px-5 py-2 font-display text-sm font-bold text-charcoal transition hover:bg-white'
                    )}
                  >
                    {cat.product_count === 0 ? 'Cancelar' : 'Entendido'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowNew(true)}
        className="w-fit rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
      >
        + Nueva categoría
      </button>

      {(showNew || editing) && (
        <CategoryFormModal
          category={editing}
          onClose={() => {
            setShowNew(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
