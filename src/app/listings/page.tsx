'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function ListingsIndex() {
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('listings')
        .select('id, title, price, location')
        .eq('is_public', true)
        .eq('deleted', false)
        .order('created_at', { ascending: false })

      setListings(data || [])
    }
    fetch()
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Public Listings</h1>
      <ul className="space-y-4">
        {listings.map(listing => (
          <li key={listing.id} className="border rounded p-4 shadow-sm bg-white dark:bg-gray-800">
            <Link href={`/listings/${listing.id}`}>
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">{listing.title}</h2>
            </Link>
            <p className="text-sm text-gray-700 dark:text-gray-300">₱ {listing.price}</p>
            <p className="text-xs text-gray-500">{listing.location}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
