'use client'
export const dynamic = 'force-dynamic'

// src/app/dashboard/messages/page.tsx

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function MessagesPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role
      const allowedRoles = ['buyer', 'seller', 'agent', 'manager']
      setAllowed(allowedRoles.includes(role))
    }
    checkRole()
  }, [])

  if (allowed === null) return <div className="p-6">Checking permissions...</div>
  if (!allowed) return <div className="p-6 text-red-600">Access denied. You are not authorized to access messages.</div>

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p>Chat with other users about properties here.</p>
      </div>
    </ProtectedRoute>
  )
}
