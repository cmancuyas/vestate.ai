'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const loadListings = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setListings(data || [])
    }
    loadListings()
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      {listings.length === 0 ? (
        <p className="text-sm text-gray-500">No listings found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(listing => (
            <div key={listing.id} className="p-4 border rounded shadow bg-white">
              {listing.photos?.[0] && (
                <img src={listing.photos[0]} alt="Listing" className="w-full h-48 object-cover mb-2 rounded" />
              )}
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-600">{listing.description}</p>
              <p className="text-sm mt-1">₱{listing.price}</p>
              <button
                className="text-blue-600 text-sm mt-2 hover:underline"
                onClick={() => router.push(`/dashboard/listings/${listing.id}/edit`)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
