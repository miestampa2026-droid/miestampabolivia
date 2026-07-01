'use client'

import { useState } from 'react'
import { DesignGallery } from '@/components/design/DesignGallery'
import { ImageUploadValidator } from '@/components/design/ImageUploadValidator'
import { cn } from '@/lib/utils'
import type { Design } from '@/lib/queries/designs'

type Selection =
  | { source: 'galeria'; design: Design }
  | { source: 'subida'; file: File; previewUrl: string }
  | null

export function DesignSelector({ designs }: { designs: Design[] }) {
  const [tab, setTab] = useState<'galeria' | 'subida'>('galeria')
  const [selection, setSelection] = useState<Selection>(null)

  return (
    <div>
      <div className="mb-6 flex gap-2 rounded-full bg-gray-light p-1">
        <button
          type="button"
          onClick={() => setTab('galeria')}
          className={cn(
            'flex-1 rounded-full py-2.5 font-display text-sm font-bold transition',
            tab === 'galeria' ? 'bg-white text-charcoal shadow-card-sm' : 'text-gray-mid'
          )}
        >
          Galería
        </button>
        <button
          type="button"
          onClick={() => setTab('subida')}
          className={cn(
            'flex-1 rounded-full py-2.5 font-display text-sm font-bold transition',
            tab === 'subida' ? 'bg-white text-charcoal shadow-card-sm' : 'text-gray-mid'
          )}
        >
          Subir mi imagen
        </button>
      </div>

      {tab === 'galeria' ? (
        <DesignGallery
          designs={designs}
          selectedId={selection?.source === 'galeria' ? selection.design.id : null}
          onSelect={(design) => setSelection({ source: 'galeria', design })}
        />
      ) : (
        <ImageUploadValidator
          onValidated={(file, previewUrl) =>
            setSelection(file && previewUrl ? { source: 'subida', file, previewUrl } : null)
          }
        />
      )}

      <button
        type="button"
        disabled
        className="mt-10 w-full cursor-not-allowed rounded-full bg-coral px-7 py-4 font-display text-[15px] font-bold text-white opacity-45 sm:w-auto"
        title="Disponible cuando esté lista la sección de preview"
      >
        Continuar
      </button>
      <p className="mt-3 font-body text-xs text-gray-mid">
        {selection
          ? 'Diseño listo. Próximamente: preview automático (sección 05).'
          : 'Elegí un diseño de la galería o subí el tuyo para continuar.'}
      </p>
    </div>
  )
}
