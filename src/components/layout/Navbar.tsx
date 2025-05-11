// src/components/layout/Navbar.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error.message)
        return
      }
      setEmail(data.user?.email ?? null)
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <Link href="/dashboard" className="text-lg font-bold text-blue-600">
        Vestate.ai
      </Link>

      <div className="flex items-center gap-4 text-sm text-gray-700">
        {email && <span className="hidden sm:inline">Welcome, {email}</span>}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
