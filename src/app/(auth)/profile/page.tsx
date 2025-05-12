
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [region, setRegion] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setEmail(user.email || '')

      const { data, error } = await supabase
        .from('profiles')
        .select('role, region, budget_min, budget_max')
        .eq('id', user.id)
        .single()

      if (data) {
        setRole(data.role || '')
        setRegion(data.region || '')
        setBudgetMin(data.budget_min || '')
        setBudgetMax(data.budget_max || '')
      }
    }

    fetchProfile()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        role,
        region,
        budget_min: budgetMin,
        budget_max: budgetMax
      })
      .eq('id', user.id)

    setLoading(false)
    alert('Profile updated!')
  }

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded shadow text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <p>Email: {email}</p>
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
          <option value="buyer">Buyer</option>
          <option value="agent">Agent</option>
          <option value="developer">Developer</option>
          <option value="investor">Investor</option>
        </select>
        <input
          type="text"
          value={region}
          placeholder="Preferred Region"
          onChange={e => setRegion(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={budgetMin}
            placeholder="Budget Min"
            onChange={e => setBudgetMin(e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            value={budgetMax}
            placeholder="Budget Max"
            onChange={e => setBudgetMax(e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
