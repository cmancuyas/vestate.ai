// src/app/providers.tsx
'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/toast-context'
import { Toaster } from '@/components/ui/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </SessionContextProvider>
  )
}
