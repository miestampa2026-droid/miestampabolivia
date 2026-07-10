'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { AdminShippingZone } from '@/lib/queries/adminCatalog'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

function ZoneCostInput({ zone }: { zone: AdminShippingZone }) {
  const router = useRouter()
  const [value, setValue] = useState(String(zone.cost))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(raw: string) {
    setError(null)
    const parsed = Number(raw)
    if (Number.isNaN(parsed) || parsed < 0) {
      setError('Costo inválido')
      setValue(String(zone.cost))
      return
    }
    if (parsed === zone.cost) return

    setSaving(true)
    const supabase = createBrowserSupabase()
    const { error: updateError } = await supabase
      .from('shipping_zones')
      .update({ cost: parsed })
      .eq('id', zone.id)
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      setValue(String(zone.cost))
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="font-body text-sm text-gray-mid">Bs.</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onBlur={(e) => save(e.target.value)}
          className="w-24 rounded-md border-[1.5px] border-gray-light px-2 py-1.5 font-body text-sm text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 disabled:opacity-60"
        />
      </div>
      {error && <p className="font-body text-sm text-brand-error">{error}</p>}
    </div>
  )
}

function NewZoneModal({ onClose, onSave }: { onClose: () => void; onSave: (data: {
  name: string
  departamento: string
  cost: number
  estimated_days: string
}) => Promise<string | null> }) {
  const [name, setName] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [cost, setCost] = useState('')
  const [estimatedDays, setEstimatedDays] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const parsedCost = Number(cost)
    if (!name.trim() || !departamento.trim() || cost === '' || Number.isNaN(parsedCost) || parsedCost < 0) {
      setError('Completá nombre, departamento y un costo válido.')
      return
    }

    setSaving(true)
    const errorMessage = await onSave({
      name: name.trim(),
      departamento: departamento.trim(),
      cost: parsedCost,
      estimated_days: estimatedDays.trim()
    })
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
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-6 font-display text-lg font-bold text-charcoal">Nueva zona de envío</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Nombre</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Santa Cruz zona norte"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Departamento</label>
            <input
              className={inputClass}
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="Ej: Santa Cruz"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Costo (Bs.)</label>
            <input
              className={inputClass}
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Tiempo estimado (opcional)
            </label>
            <input
              className={inputClass}
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              placeholder="Ej: 3-5 días"
            />
          </div>

          {error && <p className="font-body text-sm text-brand-error">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
          >
            {saving ? 'Guardando…' : 'Crear zona'}
          </button>
        </form>
      </div>
    </div>
  )
}

export function AdminShippingZonesView({ zones }: { zones: AdminShippingZone[] }) {
  const router = useRouter()
  const [showNew, setShowNew] = useState(false)

  async function handleCreate(data: {
    name: string
    departamento: string
    cost: number
    estimated_days: string
  }): Promise<string | null> {
    const supabase = createBrowserSupabase()
    const { error } = await supabase.from('shipping_zones').insert({
      name: data.name,
      departamento: data.departamento,
      cost: data.cost,
      estimated_days: data.estimated_days || null
    })
    if (error) return error.message

    router.refresh()
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-card-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-light">
              <th className="px-4 py-3 text-left font-display text-sm font-bold text-charcoal sm:px-5">Zona</th>
              <th className="px-4 py-3 text-left font-display text-sm font-bold text-charcoal sm:px-5">
                Departamento
              </th>
              <th className="hidden px-4 py-3 text-left font-display text-sm font-bold text-charcoal sm:table-cell sm:px-5">
                Tiempo
              </th>
              <th className="px-4 py-3 text-left font-display text-sm font-bold text-charcoal sm:px-5">Costo</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, i) => (
              <tr key={zone.id} className={cn(i !== zones.length - 1 && 'border-b border-gray-light')}>
                <td className="px-4 py-3 font-body text-sm text-charcoal sm:px-5">{zone.name}</td>
                <td className="px-4 py-3 font-body text-sm text-gray-mid sm:px-5">{zone.departamento}</td>
                <td className="hidden px-4 py-3 font-body text-sm text-gray-mid sm:table-cell sm:px-5">
                  {zone.estimated_days ?? '—'}
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <ZoneCostInput zone={zone} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setShowNew(true)}
        className="w-fit rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
      >
        + Nueva zona
      </button>

      {showNew && <NewZoneModal onClose={() => setShowNew(false)} onSave={handleCreate} />}
    </div>
  )
}
