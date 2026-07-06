import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getCurrentCustomer } from '@/lib/queries/customers'

// Toggle: si ya es favorito lo saca, si no lo agrega. La sesión define el
// customer_id (nunca se recibe del body), y RLS igual lo exige.
export async function POST(request: Request) {
  const { productId } = await request.json()
  if (!productId || typeof productId !== 'string') {
    return NextResponse.json({ error: 'productId requerido' }, { status: 400 })
  }

  const supabase = createServerSupabase()
  const customer = await getCurrentCustomer(supabase)
  if (!customer) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data: existing, error: findError } = await supabase
    .from('customer_favorites')
    .select('id')
    .eq('customer_id', customer.id)
    .eq('product_id', productId)
    .maybeSingle()
  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 })

  if (existing) {
    const { error: deleteError } = await supabase.from('customer_favorites').delete().eq('id', existing.id)
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })
    return NextResponse.json({ favorited: false })
  }

  const { error: insertError } = await supabase
    .from('customer_favorites')
    .insert({ customer_id: customer.id, product_id: productId })
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json({ favorited: true })
}
