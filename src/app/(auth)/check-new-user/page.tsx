// src/app/(auth)/check-new-user/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CheckNewUserPage() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.push('/login')
        return
      }

      const { created_at } = data.user
      const lastSignedIn = data.user.last_sign_in_at

      // If they signed up just now → go to onboarding
      if (created_at === lastSignedIn) {
        router.push('/auth/onboarding')
      } else {
        router.push('/auth/dashboard')
      }
    }

    checkUser()
  }, [router])

  return <p className="p-6 text-gray-500">Redirecting...</p>
}
