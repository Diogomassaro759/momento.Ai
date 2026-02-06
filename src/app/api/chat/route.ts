import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// =======================
// SUPABASE (BACKEND)
// =======================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NUNCA usar no frontend
)

// =======================
// OPENROUTER
// =======================
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
})

// =======================
// POST /api/chat
// =======================
export async function POST(req: Request) {
  try {
    // 1️⃣ TOKEN
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // 2️⃣ USUÁRIO
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário inválido' },
        { status: 401 }
      )
    }

    // 3️⃣ ASSINATURA ATIVA
    const { data: hasSubscription } = await supabase.rpc(
      'has_active_subscription',
      { uid: user.id }
    )

    if (!hasSubscription) {
      return NextResponse.json(
        { error: 'Assinatura ativa necessária' },
        { status: 403 }
      )
    }

    // 4️⃣ LIMITE MENSAL POR PLANO
    const { data: canUse } = await supabase.rpc('can_use_ai', {
      uid: user.id,
    })

    if (!canUse) {
      return NextResponse.json(
        { error: 'Limite mensal atingido' },
        { status: 403 }
      )
    }

    // 5️⃣ BODY
    const body = await req.json()
    if (!body?.message) {
      return NextResponse.json(
        { error: 'Mensagem não enviada' },
        { status: 400 }
      )
    }

    // 6️⃣ IA (SÓ AQUI GASTA)
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'user', content: body.message }
      ],
      temperature: 0.7,
    })

    const reply =
      completion.choices?.[0]?.message?.content ??
      'Sem resposta da IA'

    // 7️⃣ INCREMENTA USO (SÓ SE RESPONDEU)
    await supabase.rpc('increment_ai_usage', {
      uid: user.id,
    })

    // 8️⃣ RESPONSE
    return NextResponse.json({ reply })

  } catch (error) {
    console.error('🔥 ERRO CHAT:', error)
    return NextResponse.json(
      { error: 'Erro interno da IA' },
      { status: 500 }
    )
  }
}
