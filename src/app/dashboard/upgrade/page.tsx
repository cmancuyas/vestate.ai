'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function UpgradePage() {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setRole(user?.user_metadata?.role || 'free')
    }
    fetchRole()
  }, [])

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST'
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upgrade to Pro</h1>
      <p className="mb-4">Your current plan: <strong>{role.toUpperCase()}</strong></p>
      {role !== 'pro' && (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Redirecting...' : 'Upgrade to Pro'}
        </button>
      )}
      {role === 'pro' && (
        <p className="text-green-600 font-medium">You're already on the Pro plan. 🎉</p>
      )}
    </div>
  )
}
