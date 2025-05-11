'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const setupUserProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const { id, email, user_metadata } = user

      // Try to insert the profile (skip if it already exists)
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id,
          email,
          full_name: user_metadata.full_name || user_metadata.name || '',
        }, { onConflict: 'id' }) // avoids duplicate error

      if (insertError) {
        console.error('Failed to save profile:', insertError.message)
      }

      setLoading(false)
    }

    setupUserProfile()
  }, [router])

  if (loading) return <p className="p-6">Saving your profile...</p>

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Welcome to Vestate.ai 🎉</h1>
      <p>Your profile has been created. You’re all set!</p>
      <button
        onClick={() => router.push('/auth/dashboard')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go to Dashboard
      </button>
    </div>
  )
}
