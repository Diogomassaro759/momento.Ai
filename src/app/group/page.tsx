'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
  id: string
  content: string
  created_at: string
}

export default function GroupPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 🔹 carregar mensagens
  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        setError('Acesso exclusivo para assinantes')
      } else {
        setMessages(data || [])
      }

      setLoading(false)
    }

    loadMessages()
  }, [])

  // 🔹 enviar mensagem
  const sendMessage = async () => {
    if (!text.trim()) return

    const { error } = await supabase
      .from('community_messages')
      .insert({ content: text })

    if (error) {
      setError('Você precisa de uma assinatura ativa')
      return
    }

    setText('')
    location.reload()
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Carregando grupo...</p>
  }

  if (error) {
    return (
      <main style={{ padding: 20 }}>
        <h2>Grupo exclusivo 🔒</h2>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Grupo exclusivo 💬</h1>

      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <p key={msg.id}>
            {msg.content}
          </p>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escreva no grupo..."
        style={{ width: '100%', height: 80 }}
      />

      <br /><br />

      <button onClick={sendMessage}>
        Enviar
      </button>
    </main>
  )
}
