// src/(auth)/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { Loader2, LogOut } from 'lucide-react'
import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.push('/login')
    }
  }, [session, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-xl shadow text-center space-y-4">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome to the Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Logged in as <strong>{session.user.email}</strong>
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </main>
    </>
  )
}
