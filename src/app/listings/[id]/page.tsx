'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import CommentSection from '@/components/listings/CommentSection'

export default function ListingDetailsPage() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await supabase.from('listings').select('*').eq('id', id).single()
      setListing(data)
    }
    fetchListing()
  }, [id])

  if (!listing) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
      <p className="text-sm text-gray-600 mb-1">₱{listing.price}</p>
      <p className="text-sm text-gray-500 mb-6">{listing.location}</p>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mb-6">
        {listing.photos?.map((url: string, i: number) => (
          <img key={i} src={url} alt={`Photo ${i + 1}`} className="w-full h-56 object-cover rounded" />
        ))}
      </div>
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <CommentSection listingId={listing.id} />
      </div>

    </div>
  )
}
