'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {

  const [email, setEmail] = useState('')

  async function login() {
    await supabase.auth.signInWithOtp({ email })
    alert('Verifique seu email')
  }

  return (
    <div className="container">

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={login}>
        Entrar
      </button>

    </div>
  )
}
