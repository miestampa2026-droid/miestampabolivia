'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserSupabase } from '@/lib/supabase/client'
import type { Customer } from '@/lib/queries/customers'

const inputClass =
  'w-full rounded-md border-[1.5px] border-gray-light bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10'

export function PerfilForm({ customer }: { customer: Customer }) {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: customer.name ?? '',
    whatsapp: customer.phone ?? '',
    email: customer.email ?? ''
  })
  const [savingData, setSavingData] = useState(false)
  const [dataMessage, setDataMessage] = useState<string | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)

  const [passwords, setPasswords] = useState({ nueva: '', confirmar: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  async function handleSaveData(e: FormEvent) {
    e.preventDefault()
    setDataMessage(null)
    setDataError(null)
    setSavingData(true)

    const supabase = createBrowserSupabase()
    const emailChanged = form.email !== customer.email

    if (emailChanged) {
      const { error: emailError } = await supabase.auth.updateUser({ email: form.email })
      if (emailError) {
        setSavingData(false)
        setDataError(emailError.message)
        return
      }
    }

    const { error: updateError } = await supabase
      .from('customers')
      .update({ name: form.nombre, phone: form.whatsapp, email: form.email })
      .eq('id', customer.id)

    setSavingData(false)

    if (updateError) {
      setDataError(updateError.message)
      return
    }

    setDataMessage(
      emailChanged
        ? 'Datos guardados. Revisá tu correo nuevo para confirmar el cambio de email.'
        : 'Datos guardados.'
    )
    router.refresh()
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault()
    setPasswordMessage(null)
    setPasswordError(null)

    if (passwords.nueva.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (passwords.nueva !== passwords.confirmar) {
      setPasswordError('Las contraseñas no coinciden.')
      return
    }

    setSavingPassword(true)
    const supabase = createBrowserSupabase()
    const { error } = await supabase.auth.updateUser({ password: passwords.nueva })
    setSavingPassword(false)

    if (error) {
      setPasswordError(error.message)
      return
    }
    setPasswordMessage('Contraseña actualizada.')
    setPasswords({ nueva: '', confirmar: '' })
  }

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={handleSaveData} className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
            Nombre completo
          </label>
          <input
            className={inputClass}
            value={form.nombre}
            onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
            WhatsApp
          </label>
          <input
            className={inputClass}
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">Email</label>
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </div>

        {dataMessage && <p className="font-body text-sm text-brand-success">{dataMessage}</p>}
        {dataError && <p className="font-body text-sm text-brand-error">{dataError}</p>}

        <button
          type="submit"
          disabled={savingData}
          className="mt-2 w-fit rounded-full bg-coral px-7 py-3 font-display text-[15px] font-bold text-white shadow-card-sm transition hover:-translate-y-px hover:bg-coral-dark hover:shadow-card-md disabled:pointer-events-none disabled:opacity-60"
        >
          {savingData ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>

      <div className="border-t border-gray-light pt-8">
        <h3 className="mb-3 font-display text-sm font-bold text-charcoal">Cambiar contraseña</h3>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3 sm:max-w-sm">
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Nueva contraseña
            </label>
            <input
              className={inputClass}
              type="password"
              value={passwords.nueva}
              onChange={(e) => setPasswords((p) => ({ ...p, nueva: e.target.value }))}
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-display text-sm font-semibold text-charcoal">
              Confirmar contraseña
            </label>
            <input
              className={inputClass}
              type="password"
              value={passwords.confirmar}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmar: e.target.value }))}
              minLength={8}
              placeholder="Repetila"
            />
          </div>

          {passwordMessage && <p className="font-body text-sm text-brand-success">{passwordMessage}</p>}
          {passwordError && <p className="font-body text-sm text-brand-error">{passwordError}</p>}

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-2 w-fit rounded-full border-2 border-coral px-7 py-3 font-display text-[15px] font-bold text-coral transition hover:bg-coral hover:text-white disabled:pointer-events-none disabled:opacity-60"
          >
            {savingPassword ? 'Guardando…' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
