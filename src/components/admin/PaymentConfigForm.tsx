'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/supabase/types'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

type PaymentConfigRow = Database['public']['Tables']['payment_config']['Row']

export function PaymentConfigForm({ config }: { config: PaymentConfigRow }) {
  const router = useRouter()
  const [bankName, setBankName] = useState(config.bank_name ?? '')
  const [bankHolder, setBankHolder] = useState(config.bank_holder ?? '')
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = qrFile ? URL.createObjectURL(qrFile) : config.qr_image_url

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSaving(true)

    const formData = new FormData()
    formData.append('bankName', bankName)
    formData.append('bankHolder', bankHolder)
    if (qrFile) formData.append('qr', qrFile)

    const res = await fetch('/api/admin/payment-config', { method: 'POST', body: formData })
    setSaving(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'No se pudo guardar la configuración.')
      return
    }

    setMessage('Configuración guardada.')
    setQrFile(null)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:max-w-md">
      {previewUrl ? (
        <div className="mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl bg-gray-light">
          {/* eslint-disable-next-line @next/next/no-img-element -- puede ser un blob URL local antes de subir */}
          <img src={previewUrl} alt="QR de cobro actual" className="h-full w-full object-contain" />
        </div>
      ) : (
        <p className="rounded-lg bg-gray-light px-4 py-6 text-center font-body text-sm text-gray-mid">
          Pendiente de configurar
        </p>
      )}

      <label className="flex cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-coral px-5 py-3 font-display text-sm font-bold text-coral transition hover:bg-coral-light">
        {qrFile ? qrFile.name : 'Subir imagen del QR'}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => setQrFile(e.target.files?.[0] ?? null)}
        />
      </label>

      <div>
        <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Banco</label>
        <input
          className={inputClass}
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Pendiente de configurar"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Titular</label>
        <input
          className={inputClass}
          value={bankHolder}
          onChange={(e) => setBankHolder(e.target.value)}
          placeholder="Pendiente de configurar"
        />
      </div>

      {message && <p className="font-body text-sm text-brand-success">{message}</p>}
      {error && <p className="font-body text-sm text-brand-error">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
      >
        {saving ? 'Guardando…' : 'Guardar configuración'}
      </button>
    </form>
  )
}
