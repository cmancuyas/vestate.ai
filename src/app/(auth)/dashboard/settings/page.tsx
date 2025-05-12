'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('role, listing_count, email')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
        <div><strong>Email:</strong> {profile?.email}</div>
        <div><strong>Role:</strong> {profile?.role}</div>
        <div><strong>Active Listings:</strong> {profile?.listing_count}</div>
        {profile?.role === 'free' && (
          <a href="/dashboard/upgrade" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upgrade to Pro
          </a>
        )}
      </div>
    </div>
  )
}