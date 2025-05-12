'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast-context'

export function useRealtimeListings(onChange: () => void) {
  const { toast } = useToast()

  useEffect(() => {
    const channel = supabase
      .channel('listings-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'listings',
      }, payload => {
        toast({ title: `Listing ${payload.eventType.toLowerCase()}d`, variant: 'info' })
        onChange()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onChange])
}