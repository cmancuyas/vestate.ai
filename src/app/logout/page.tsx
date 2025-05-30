'use client'
export const dynamic = 'force-dynamic'

// src/app/logout/page.tsx

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut()
      setTimeout(() => {
        router.push('/login')
      }, 300) // slight delay for UX
    }

    signOut()
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center gap-2 text-gray-700">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Signing you out...</span>
      </div>
    </main>
  )
}
