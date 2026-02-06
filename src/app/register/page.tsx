'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function cadastrar() {
    setLoading(true)
    setMsg('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMsg(error.message)
    } else {
      setMsg('Conta criada! Verifique seu email.')
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Criar conta</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={cadastrar} disabled={loading}>
        {loading ? 'Criando...' : 'Criar conta'}
      </button>

      <p>{msg}</p>
    </main>
  )
}
