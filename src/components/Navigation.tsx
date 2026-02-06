'use client'

import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  return (
    <nav className="flex items-center justify-between p-4 border-b">

      {/* LOGO */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Momento.AI"
          width={140}
          height={40}
          priority
        />
      </div>

      {/* MENU */}
      <div className="flex gap-4">
        <Link href="/">Início</Link>

        {!user && <Link href="/login">Login</Link>}

        {user && (
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
          >
            Sair
          </button>
        )}
      </div>
    </nav>
  )
}
