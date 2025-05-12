import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ListingsPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role
      const allowedRoles = ['seller', 'agent', 'manager']
      setAllowed(allowedRoles.includes(role))
    }
    checkRole()
  }, [])

  if (allowed === null) return <div className="p-6">Checking permissions...</div>
  if (!allowed) return <div className="p-6 text-red-600">Access denied. You are not authorized to manage listings.</div>

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Listings</h1>
        <p>Manage your property listings here.</p>
      </div>
    </ProtectedRoute>
  )
}
