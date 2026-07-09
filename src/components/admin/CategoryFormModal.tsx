'use client'

import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { slugify } from '@/lib/queries/adminCatalog'
import type { AdminCategory } from '@/lib/queries/adminCatalog'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

export function CategoryFormModal({
  category,
  onClose,
  onSave
}: {
  category: AdminCategory | null
  onClose: () => void
  onSave: (data: { name: string; slug: string }) => Promise<string | null>
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!category)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !slug.trim()) {
      setError('Completá nombre y slug.')
      return
    }

    setSaving(true)
    const errorMessage = await onSave({ name: name.trim(), slug: slug.trim() })
    setSaving(false)

    if (errorMessage) {
      setError(errorMessage)
      return
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-card-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-gray-mid transition hover:text-charcoal"
        >
          <X size={18} aria-hidden />
        </button>

        <h2 className="mb-6 font-display text-lg font-bold text-charcoal">
          {category ? 'Editar categoría' : 'Nueva categoría'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Nombre</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Poleras"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Slug</label>
            <input
              className={inputClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              placeholder="poleras"
            />
          </div>

          {error && <p className="font-body text-sm text-brand-error">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}
