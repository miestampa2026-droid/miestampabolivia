'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { DesignUploadModal } from '@/components/admin/DesignUploadModal'
import type { AdminDesign } from '@/lib/queries/adminCatalog'

export function AdminDesignsView({ designs }: { designs: AdminDesign[] }) {
  const router = useRouter()
  const [showUpload, setShowUpload] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const categories = useMemo(() => Array.from(new Set(designs.map((d) => d.category))), [designs])

  const grouped = useMemo(() => {
    const map = new Map<string, AdminDesign[]>()
    for (const design of designs) {
      const list = map.get(design.category) ?? []
      list.push(design)
      map.set(design.category, list)
    }
    return Array.from(map.entries())
  }, [designs])

  async function handleUploadSave(data: {
    name: string
    category: string
    imageUrl: string
  }): Promise<string | null> {
    const supabase = createBrowserSupabase()
    const { error: insertError } = await supabase.from('designs').insert({
      name: data.name,
      category: data.category,
      image_url: data.imageUrl
    })
    if (insertError) return insertError.message

    router.refresh()
    return null
  }

  async function handleDelete(design: AdminDesign) {
    setError(null)
    const supabase = createBrowserSupabase()
    const { error: deleteError } = await supabase.from('designs').delete().eq('id', design.id)
    setConfirmingDelete(null)

    if (deleteError) {
      setError(`No se pudo eliminar "${design.name}": ${deleteError.message}`)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="rounded-md bg-red-50 px-4 py-3 font-body text-sm text-brand-error">{error}</p>}

      {grouped.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 font-body text-sm text-gray-mid shadow-card-sm">
          Todavía no hay diseños en la galería.
        </p>
      ) : (
        grouped.map(([category, items]) => (
          <div key={category}>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-charcoal">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {items.map((design) => (
                <div key={design.id} className="rounded-2xl bg-white p-3 shadow-card-sm">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[repeating-conic-gradient(#f0f0f0_0_25%,white_0_50%)] bg-[length:16px_16px]">
                    <Image
                      src={design.image_url}
                      alt={design.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                  </div>
                  <p className="mt-2 truncate font-body text-sm font-semibold text-charcoal">{design.name}</p>

                  {confirmingDelete === design.id ? (
                    <div className="mt-2 flex flex-col gap-1.5">
                      <p className="font-body text-sm text-amber-800">¿Eliminar este diseño?</p>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(design)}
                          className="rounded-full bg-brand-error px-3 py-1 font-display text-sm font-bold text-white transition hover:opacity-90"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(null)}
                          className="rounded-full border-2 border-charcoal px-3 py-1 font-display text-sm font-bold text-charcoal transition hover:bg-gray-light"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(design.id)}
                      aria-label="Eliminar diseño"
                      className="mt-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-gray-light hover:text-brand-error"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={() => setShowUpload(true)}
        className="w-fit rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
      >
        + Subir diseño
      </button>

      {showUpload && (
        <DesignUploadModal
          categories={categories}
          onClose={() => setShowUpload(false)}
          onSave={handleUploadSave}
        />
      )}
    </div>
  )
}
