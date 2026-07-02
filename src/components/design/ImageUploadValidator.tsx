'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { validateImageFile, type ImageValidationResult } from '@/lib/imageValidation'

export function ImageUploadValidator({
  onValidated
}: {
  onValidated: (file: File | null, previewUrl: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [result, setResult] = useState<ImageValidationResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  async function handleFile(file: File) {
    setChecking(true)
    setResult(null)
    onValidated(null, null)

    const validation = await validateImageFile(file)
    setResult(validation)
    setChecking(false)

    if (validation.ok) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      onValidated(file, url)
    } else {
      setPreviewUrl(null)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
  }

  function reset() {
    setResult(null)
    setPreviewUrl(null)
    onValidated(null, null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        className="hidden"
        id="design-upload-input"
      />

      {!previewUrl && (
        <label
          htmlFor="design-upload-input"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-light bg-white px-6 py-16 text-center transition hover:border-coral"
        >
          <Upload size={28} className="text-coral" aria-hidden />
          <span className="font-display text-sm font-bold text-charcoal">
            {checking ? 'Revisando la imagen…' : 'Subí tu diseño'}
          </span>
          <span className="font-body text-sm text-gray-mid">PNG, JPG o WEBP · hasta 25 MB</span>
        </label>
      )}

      {previewUrl && (
        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-card-sm">
          <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-light">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview local vía object URL */}
            <img src={previewUrl} alt="Tu diseño" className="h-full w-full object-contain" />
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-3 font-display text-sm font-bold text-coral hover:text-coral-dark"
          >
            Elegir otra imagen
          </button>
        </div>
      )}

      {result && (
        <div
          className={cn(
            'mt-4 flex items-start gap-2 rounded-md border-[1.5px] px-4 py-3 font-body text-sm',
            !result.ok && 'border-brand-error bg-red-50 text-brand-error',
            result.ok && result.quality === 'advertencia' && 'border-brand-warning bg-amber-50 text-amber-800',
            result.ok && result.quality === 'optima' && 'border-brand-success bg-green-50 text-green-700'
          )}
        >
          {!result.ok && <XCircle size={18} className="mt-0.5 shrink-0" aria-hidden />}
          {result.ok && result.quality === 'advertencia' && (
            <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
          )}
          {result.ok && result.quality === 'optima' && (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          )}
          <span>{result.message}</span>
        </div>
      )}

      {result && !result.ok && (
        <button
          type="button"
          onClick={reset}
          className="mt-3 font-display text-sm font-bold text-coral hover:text-coral-dark"
        >
          Reintentar con otra imagen
        </button>
      )}
    </div>
  )
}
