import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

// Guarda el archivo ORIGINAL que sube el cliente (sin comprimir), separado
// del preview compuesto. Bucket privado: se devuelve el path, no una URL
// pública — el admin genera una signed URL fresca cuando la necesita.
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo "file"' }, { status: 400 })
  }

  const supabase = createAdminSupabase()
  const ext = file.name.split('.').pop() || 'png'
  const path = `${randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  return NextResponse.json({ path })
}
