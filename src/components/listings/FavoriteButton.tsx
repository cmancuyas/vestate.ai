// src/components/listings/FavoriteButton.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single()
      setFavorited(!!data)
    }
    checkFavorite()
  }, [listingId])

  const toggleFavorite = async () => {
    if (!userId) return
    if (favorited) {
      await supabase.from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId)
    } else {
      await supabase.from('favorites').insert([{ user_id: userId, listing_id: listingId }])
    }
    setFavorited(!favorited)
  }

  return (
    <button
      onClick={toggleFavorite}
      className="text-sm text-red-600 hover:underline ml-2"
    >
      {favorited ? '❤️ Saved' : '🤍 Save'}
    </button>
  )
}
