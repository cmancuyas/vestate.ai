// src/lib/supabase/server.ts
'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase' // optional if using Supabase types

export function createClient() {
  return createServerComponentClient<Database>({
    cookies,
  })
}
