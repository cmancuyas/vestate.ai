// src/components/ui/PurchaseButton.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'

type Props = {
  productType: 'premium' | 'subscription' | 'valuation' | 'boost'
  label?: string
  email?: string
}

export default function PurchaseButton({ productType, label = 'Buy Now', email }: Props) {
  const { email: contextEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType, customerEmail: email || contextEmail }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Redirecting…' : label}
    </button>
  )
}
