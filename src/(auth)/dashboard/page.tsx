'use client'

import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useEffect } from 'react'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.push('/login')
    }
  }, [session, router])

  if (session === null || session === undefined) {
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
        <div className="bg-white p-6 rounded-xl shadow text-center space-y-2">
          <h1 className="text-2xl font-bold text-blue-600">
            Welcome to the Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Logged in as <strong>{session.user.email}</strong>
          </p>
        </div>
      </main>
    </>
  )
}
