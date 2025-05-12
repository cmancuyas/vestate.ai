import { supabase } from '@/lib/supabaseClient'
import { redirect } from 'next/navigation'

export async function requireRole(
  allowedRoles: string[],
  redirectTo: string = '/unauthorized'
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect(redirectTo)
  }

  return profile.role
}
