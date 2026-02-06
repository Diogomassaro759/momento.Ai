import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json({ error: 'Usuário inválido' }, { status: 401 })
    }

    const today = new Date().toISOString().slice(0, 10)

    const { data } = await supabase
      .from('ai_usage')
      .select('usage_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    return NextResponse.json({
      used: data?.usage_count ?? 0,
      limit: 3,
    })
  } catch (err) {
    console.error('🔥 ERRO USAGE:', err)
    return NextResponse.json(
      { error: 'Erro ao buscar uso' },
      { status: 500 }
    )
  }
}
