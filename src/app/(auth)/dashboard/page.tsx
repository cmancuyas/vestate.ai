// src/app/(auth)/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Profile fetch failed:', error.message)
      } else {
        setFullName(data.full_name || '')
      }

      setLoading(false)
    }

    fetchProfile()
  }, [session, router])

  if (loading) {
    return <div className="p-6">Loading your dashboard...</div>
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Welcome, {fullName || 'User'} 👋</h1>
      <p>This is your Vestate.ai dashboard.</p>
    </main>
  )
}
