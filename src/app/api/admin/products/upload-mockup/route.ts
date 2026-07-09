import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer?.is_admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo "file"' }, { status: 400 })
  }

  const admin = createAdminSupabase()
  const ext = file.name.split('.').pop() || 'png'
  const path = `${randomUUID()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('product-mockups')
    .upload(path, file, { contentType: file.type, upsert: false })
  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = admin.storage.from('product-mockups').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
