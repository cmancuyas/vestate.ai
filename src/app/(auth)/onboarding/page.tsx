'use client'
export const dynamic = 'force-dynamic'



import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('buyer')
  const [region, setRegion] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    await supabase.from('profiles').update({
      role,
      region,
      budget_min: budgetMin,
      budget_max: budgetMax
    }).eq('id', user.id)

    router.push('/dashboard')
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => Math.max(1, prev - 1))

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded shadow text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Onboarding</h2>

      {step === 1 && (
        <>
          <p className="mb-2">Select your role:</p>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded mb-4">
            <option value="buyer">Buyer</option>
            <option value="agent">Agent</option>
            <option value="developer">Developer</option>
            <option value="investor">Investor</option>
          </select>
          <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <p className="mb-2">Which region are you interested in?</p>
          <input type="text" placeholder="e.g. Metro Manila" value={region} onChange={e => setRegion(e.target.value)} className="w-full p-2 border rounded mb-4" />
          <div className="flex justify-between">
            <button onClick={prevStep} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Back</button>
            <button onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="mb-2">Set your budget range:</p>
          <div className="flex gap-4 mb-4">
            <input type="number" placeholder="Min" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className="w-1/2 p-2 border rounded" />
            <input type="number" placeholder="Max" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className="w-1/2 p-2 border rounded" />
          </div>
          <div className="flex justify-between">
            <button onClick={prevStep} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Back</button>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Saving…' : 'Finish'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
