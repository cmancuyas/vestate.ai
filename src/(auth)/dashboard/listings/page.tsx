// src/app/dashboard/listings/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function ListingDetailPage() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchListing = async () => {
      // Fetch listing
      const { data: listingData, error: listingError } = await supabase
        .from('sale_listings')
        .select('*')
        .eq('id', id)
        .single()

      // Fetch related documents
      const { data: docData, error: docError } = await supabase
        .from('listing_documents')
        .select('*')
        .eq('listing_id', id)

      setListing(listingData)
      setDocuments(docData || [])
      setLoading(false)
    }

    fetchListing()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">Listing not found.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-blue-600">Listing Details</h1>

        <div className="space-y-2 text-sm text-gray-800">
          <div><strong>Property Address:</strong> {listing.address}</div>
          <div><strong>Buyer Name:</strong> {listing.buyer_name}</div>
          <div><strong>Seller Name:</strong> {listing.seller_name}</div>
          <div><strong>Seller Agent:</strong> {listing.seller_agent}</div>
          <div><strong>Final Price:</strong> ₱ {Number(listing.final_price).toLocaleString()}</div>
          <div><strong>Closing Date:</strong> {new Date(listing.closing_date).toLocaleDateString()}</div>
          <div><strong>Commission:</strong> {listing.commission}%</div>
        </div>

        {documents.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Documents</h2>
            <ul className="list-disc pl-5 text-sm text-blue-600">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={`https://wpdiadtykxjdmlzzcspr.supabase.co/storage/v1/object/public/listing-documents/${doc.file_key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.label || doc.file_key}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
