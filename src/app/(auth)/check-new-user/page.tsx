// src/app/(auth)/check-new-user/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CheckNewUser() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check if profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        // First-time user → onboarding
        router.push('/auth/onboarding')
      } else {
        // Returning user → dashboard
        router.push('/auth/dashboard')
      }
    }

    handleRedirect()
  }, [router])

  return (
    <div className="p-6 text-center">
      Redirecting...
    </div>
  )
}
