import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {

  const data = await req.json()

  const userId = data.buyer.email
  const plan = data.product.name

  await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan,
      status: 'active',
      expires_at: new Date('2027-01-01')
    })

  return Response.json({ ok: true })
}
