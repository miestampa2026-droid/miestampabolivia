import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('preview')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el archivo "preview"' }, { status: 400 })
  }

  const supabase = createAdminSupabase()
  const path = `${randomUUID()}.png`

  const { error: uploadError } = await supabase.storage
    .from('previews')
    .upload(path, file, { contentType: 'image/png', upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('previews').getPublicUrl(path)

  return NextResponse.json({ url: data.publicUrl })
}
