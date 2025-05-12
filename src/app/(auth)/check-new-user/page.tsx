'use client'
export const dynamic = 'force-dynamic'



import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CheckNewUser() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        // Create user profile
        await supabase.from('profiles').insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            role: user.user_metadata?.role || 'buyer',
            is_subscribed: false,
            is_premium: false
          }
        ])
      }

      router.push('/dashboard')
    }

    handleRedirect()
  }, [router])

  return (
    <div className="p-6 text-center">
      Redirecting...
    </div>
  )
}
