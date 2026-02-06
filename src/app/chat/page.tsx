'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Chat() {

  const [msg, setMsg] = useState('')
  const [resp, setResp] = useState('')
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    loadPlan()
  }, [])

  async function loadPlan() {

    const { data: user } = await supabase.auth.getUser()

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.user?.id)
      .single()

    if (data.plan === 'monthly') setLimit(50)
    if (data.plan === 'semi') setLimit(100)
    if (data.plan === 'year') setLimit(200)
  }

  async function send() {

    const r = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: msg })
    })

    const d = await r.json()

    setResp(d.text)
  }

  return (
    <div className="container">

      <h2>Chat</h2>

      <textarea onChange={e => setMsg(e.target.value)} />

      <button onClick={send}>
        Enviar
      </button>

      <p>{resp}</p>

      <p>Limite: {limit}/mês</p>

    </div>
  )
}
