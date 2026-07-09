'use client'

import { useState, type FormEvent } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

const NEW_CATEGORY_VALUE = '__nueva__'

export function DesignUploadModal({
  categories,
  onClose,
  onSave
}: {
  categories: string[]
  onClose: () => void
  onSave: (data: { name: string; category: string; imageUrl: string }) => Promise<string | null>
}) {
  const [name, setName] = useState('')
  const [categoryChoice, setCategoryChoice] = useState(categories[0] ?? NEW_CATEGORY_VALUE)
  const [newCategory, setNewCategory] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/designs/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo subir la imagen')
      setImageUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const category = categoryChoice === NEW_CATEGORY_VALUE ? newCategory.trim() : categoryChoice
    if (!name.trim() || !category || !imageUrl) {
      setError('Completá nombre, categoría e imagen.')
      return
    }

    setSaving(true)
    const errorMessage = await onSave({ name: name.trim(), category, imageUrl })
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

        <h2 className="mb-6 font-display text-lg font-bold text-charcoal">Subir diseño</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {imageUrl ? (
            <div className="mx-auto flex flex-col items-center gap-2">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-[repeating-conic-gradient(#f0f0f0_0_25%,white_0_50%)] bg-[length:16px_16px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- puede ser una URL recien subida */}
                <img src={imageUrl} alt="Diseño" className="h-full w-full object-contain" />
              </div>
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="font-display text-sm font-bold text-coral hover:text-coral-dark"
              >
                Cambiar imagen
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const file = e.dataTransfer.files?.[0]
                if (file) void handleFile(file)
              }}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-white px-4 py-8 text-center transition',
                dragOver ? 'border-coral bg-coral-light/30' : 'border-gray-light hover:border-coral'
              )}
            >
              {uploading ? (
                <Loader2 size={24} className="animate-spin text-coral" aria-hidden />
              ) : (
                <Upload size={24} className="text-coral" aria-hidden />
              )}
              <span className="font-display text-sm font-bold text-charcoal">
                {uploading ? 'Subiendo…' : 'Arrastrá una imagen o hacé clic'}
              </span>
              <span className="font-body text-sm text-gray-mid">PNG con fondo transparente, mínimo 1500px</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleFile(file)
                }}
              />
            </label>
          )}

          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Nombre del diseño
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Flores tropicales"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Categoría</label>
            <select
              className={inputClass}
              value={categoryChoice}
              onChange={(e) => setCategoryChoice(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value={NEW_CATEGORY_VALUE}>+ Nueva categoría…</option>
            </select>
          </div>

          {categoryChoice === NEW_CATEGORY_VALUE && (
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Nombre de la nueva categoría
              </label>
              <input
                className={inputClass}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ej: Animales"
              />
            </div>
          )}

          {error && <p className="font-body text-sm text-brand-error">{error}</p>}

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Subir diseño'}
          </button>
        </form>
      </div>
    </div>
  )
}
