'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LogoutButton from '@/components/auth/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')

      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role || null
      setUserRole(role)
    }

    fetchUserRole()
  }, [router])

  return (
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-600">Vestate.ai Dashboard</h1>
        <div className="flex items-center gap-2 text-sm">
          {userRole && <span className="text-gray-600">Role: {userRole}</span>}
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  )
}
