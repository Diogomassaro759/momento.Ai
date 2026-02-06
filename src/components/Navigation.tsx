'use client'

import Link from 'next/link'
import Logo from './Logo'
import { supabase } from '@/lib/supabase'

export default function Navigation() {

  const logout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <nav className="nav">

      <Logo />

      <div>
        <Link href="/">Home</Link>
        <Link href="/chat">Chat</Link>
        <button onClick={logout}>Sair</button>
      </div>

    </nav>
  )
}
