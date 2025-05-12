'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MyFavoritesPage() {
  const [listings, setListings] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: favorites } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id)

      const ids = favorites?.map(f => f.listing_id) ?? []

      if (ids.length) {
        const { data: favListings } = await supabase
          .from('listings')
          .select('*')
          .in('id', ids)
        setListings(favListings || [])
      } else {
        setListings([])
      }
    }

    loadFavorites()
  }, [])


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Saved Listings</h2>
      {listings.length === 0 ? (
        <p className="text-sm text-gray-500">No favorites yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white border rounded shadow p-4">
              {listing.photos?.[0] && (
                <img src={listing.photos[0]} alt="Photo" className="w-full h-48 object-cover rounded mb-3" />
              )}
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-600 truncate">{listing.description}</p>
              <p className="text-sm mt-1 font-medium">₱{listing.price}</p>
              <button
                onClick={() => router.push(`/listings/${listing.id}`)}
                className="text-blue-600 text-sm mt-2 hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
