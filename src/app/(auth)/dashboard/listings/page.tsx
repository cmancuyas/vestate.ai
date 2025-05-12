// src/app/(auth)/dashboard/listings/page.tsx
'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast-context'

import QRCode from 'react-qr-code'

import { useRealtimeListings } from '@/hooks/useRealtimeListings'

const PAGE_SIZE = 10

export default function ListingsPage() {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState<string | null>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [category, setCategory] = useState('')
  const observer = useRef<IntersectionObserver | null>(null)
  const lastRef = useRef<HTMLLIElement | null>(null)
  const pageRef = useRef(0)

  const fetchListings = useCallback(async (reset = false) => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .range(reset ? 0 : pageRef.current * PAGE_SIZE, (pageRef.current + 1) * PAGE_SIZE - 1)

    if (category) query.eq('category', category)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching listings', error)
    } else {
      setListings(prev => (reset ? data : [...prev, ...data]))
      setHasMore(data.length === PAGE_SIZE)
      if (!reset) pageRef.current++
      else pageRef.current = 1
    }
    setLoading(false)
  }, [category])

  useEffect(() => {
    fetchListings(true)
  }, [category])

  useRealtimeListings(() => fetchListings(true))

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchListings()
      }
    })

    if (lastRef.current) {
      observer.current.observe(lastRef.current)
    }
  }, [fetchListings, hasMore, loading])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Listings (Live + Infinite Scroll)</h1>

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        <option value="">All Categories</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
        <option value="foreclosed">Foreclosed</option>
        <option value="under_construction">Under Construction</option>
      </select>

      <ul className="space-y-4">
        {listings.map((listing, idx) => (
          <li
            key={listing.id}
            ref={idx === listings.length - 1 ? lastRef : null}
            className="p-4 border rounded bg-white dark:bg-gray-800"
          >
            <h2 className="font-semibold text-blue-600 dark:text-blue-300">{listing.title}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">₱ {listing.price}</p>
            <p className="text-xs text-gray-500">{listing.category}</p>

    <div className="flex justify-end space-x-2 mt-2">
      <button
        onClick={() => window.location.href = `/dashboard/listings/${listing.id}/edit`}
        className="text-blue-600 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={() => {
          if (confirm('Are you sure you want to delete this listing?')) {
            supabase
              .from('listings')
              .delete()
              .eq('id', listing.id)
              .then(({ error }) => {
                if (error) {
                  toast({ title: 'Failed to delete listing', variant: 'error' })
                } else {
                  toast({ title: 'Listing deleted', variant: 'success' })
                  setListings(prev => prev.filter(l => l.id !== listing.id))
                }
              })
          }
        }}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>

  <div className="flex justify-end gap-2 mt-2 text-xs text-right">
    {listing.is_public && (
      <>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/listings/${listing.id}`)
            toast({ title: 'Link copied', description: 'Listing link copied to clipboard.', variant: 'info' })
          }}
          className="text-blue-600 hover:underline"
        >
          Copy Link
        </button>
        <button
          onClick={() => {
            setShowQR(showQR === listing.id ? null : listing.id)
          }}
          className="text-purple-600 hover:underline"
        >
          {showQR === listing.id ? 'Hide QR' : 'Show QR'}
        </button>
      </>
    )}
  </div>
  {showQR === listing.id && (
    <div className="flex justify-center mt-2">
      <QRCode value={`${window.location.origin}/listings/${listing.id}`} size={128} />
    </div>
  )}
</li>
        ))}
      </ul>

      {loading && <p className="text-gray-500 mt-4">Loading more...</p>}
      {!hasMore && !loading && <p className="text-gray-400 mt-4">End of results</p>}
    </div>
  )
}
