'use client'

import { useState, type FormEvent } from 'react'
import { Pencil, Trash2, Star } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { CustomerAddress } from '@/lib/queries/customers'

const DEPARTAMENTOS = [
  'Santa Cruz',
  'La Paz',
  'Cochabamba',
  'Chuquisaca',
  'Oruro',
  'Potosí',
  'Tarija',
  'Beni',
  'Pando'
]

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

type FormState = {
  label: string
  address_line: string
  city: string
  department: string
  reference: string
  is_default: boolean
}

const EMPTY_FORM: FormState = {
  label: '',
  address_line: '',
  city: '',
  department: DEPARTAMENTOS[0],
  reference: '',
  is_default: false
}

export function DireccionesManager({
  customerId,
  initialAddresses
}: {
  customerId: string
  initialAddresses: CustomerAddress[]
}) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openNewForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEditForm(addr: CustomerAddress) {
    setForm({
      label: addr.label ?? '',
      address_line: addr.address_line,
      city: addr.city,
      department: addr.department,
      reference: addr.reference ?? '',
      is_default: addr.is_default
    })
    setEditingId(addr.id)
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    const supabase = createBrowserSupabase()

    if (form.is_default) {
      await supabase.from('customer_addresses').update({ is_default: false }).eq('customer_id', customerId)
    }

    if (editingId) {
      const { data, error: updateError } = await supabase
        .from('customer_addresses')
        .update({
          label: form.label || null,
          address_line: form.address_line,
          city: form.city,
          department: form.department,
          reference: form.reference || null,
          is_default: form.is_default
        })
        .eq('id', editingId)
        .select()
        .maybeSingle()

      setSaving(false)
      if (updateError) {
        setError(updateError.message)
        return
      }
      setAddresses((prev) => {
        const next = prev.map((a) => (a.id === editingId ? (data as CustomerAddress) : a))
        return form.is_default ? next.map((a) => (a.id === editingId ? a : { ...a, is_default: false })) : next
      })
    } else {
      const { data, error: insertError } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customerId,
          label: form.label || null,
          address_line: form.address_line,
          city: form.city,
          department: form.department,
          reference: form.reference || null,
          is_default: form.is_default
        })
        .select()
        .maybeSingle()

      setSaving(false)
      if (insertError) {
        setError(insertError.message)
        return
      }
      setAddresses((prev) => {
        const next = form.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev
        return data ? [data as CustomerAddress, ...next] : next
      })
    }

    setShowForm(false)
  }

  async function handleDelete(id: string) {
    const supabase = createBrowserSupabase()
    const { error: deleteError } = await supabase.from('customer_addresses').delete().eq('id', id)
    if (!deleteError) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    }
  }

  async function handleSetDefault(id: string) {
    const supabase = createBrowserSupabase()
    await supabase.from('customer_addresses').update({ is_default: false }).eq('customer_id', customerId)
    await supabase.from('customer_addresses').update({ is_default: true }).eq('id', id)
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })))
  }

  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && !showForm && (
        <p className="font-body text-sm text-gray-mid">Todavía no guardaste ninguna dirección.</p>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={cn(
            'flex items-start justify-between gap-4 rounded-lg border-[1.5px] p-4',
            addr.is_default ? 'border-coral bg-coral-light/40' : 'border-gray-light'
          )}
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display text-sm font-bold text-charcoal">{addr.label || 'Dirección'}</p>
              {addr.is_default && (
                <span className="rounded-full bg-coral px-2 py-0.5 font-display text-sm font-bold text-white">
                  Predeterminada
                </span>
              )}
            </div>
            <p className="mt-1 font-body text-sm text-charcoal">{addr.address_line}</p>
            <p className="font-body text-sm text-gray-mid">
              {addr.city}, {addr.department}
            </p>
            {addr.reference && <p className="font-body text-sm text-gray-mid">Ref: {addr.reference}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!addr.is_default && (
              <button
                type="button"
                onClick={() => handleSetDefault(addr.id)}
                title="Marcar como predeterminada"
                aria-label="Marcar como predeterminada"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-white hover:text-coral"
              >
                <Star size={16} aria-hidden />
              </button>
            )}
            <button
              type="button"
              onClick={() => openEditForm(addr)}
              aria-label="Editar dirección"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-white hover:text-coral"
            >
              <Pencil size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(addr.id)}
              aria-label="Eliminar dirección"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-mid transition hover:bg-white hover:text-brand-error"
            >
              <Trash2 size={16} aria-hidden />
            </button>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-lg border-[1.5px] border-gray-light p-4"
        >
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Etiqueta
            </label>
            <input
              className={inputClass}
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Casa, Trabajo, Otro"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Dirección
            </label>
            <input
              className={inputClass}
              value={form.address_line}
              onChange={(e) => setForm((f) => ({ ...f, address_line: e.target.value }))}
              placeholder="Calle, número"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Ciudad
              </label>
              <input
                className={inputClass}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
                Departamento
              </label>
              <select
                className={inputClass}
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              >
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Referencia
            </label>
            <input
              className={inputClass}
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
              placeholder="Portón negro, casa esquina, etc."
            />
          </div>
          <label className="flex items-center gap-2 font-body text-sm text-charcoal">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-light text-coral"
            />
            Usar como predeterminada
          </label>

          {error && <p className="font-body text-sm text-brand-error">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-coral px-6 py-2.5 font-display text-sm font-bold text-white shadow-card-sm transition hover:bg-coral-dark disabled:pointer-events-none disabled:opacity-60"
            >
              {saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Agregar dirección'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border-2 border-gray-light px-6 py-2.5 font-display text-sm font-bold text-charcoal transition hover:border-charcoal"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={openNewForm}
          className="w-fit rounded-full border-2 border-coral px-6 py-2.5 font-display text-sm font-bold text-coral transition hover:bg-coral hover:text-white"
        >
          + Agregar dirección
        </button>
      )}
    </div>
  )
}
