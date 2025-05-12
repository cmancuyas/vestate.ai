'use client'

export const dynamic = 'force-dynamic'
import Head from 'next/head'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PublicListingDetail() {
  const { id } = useParams()
  const [listing, setListing] = useState<any | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .eq('deleted', false)
        .single()

      setListing(data)
    }
    if (id) fetch()
  }, [id])

  if (!listing) {
    return <p className="p-6 text-red-500">Listing not found or is private.</p>
  }

  return (
    <>
      <Head>
        <title>{listing?.title || 'Listing Detail'}</title>
        <meta property="og:title" content={listing?.title} />
        <meta property="og:description" content={`₱ ${listing?.price} - ${listing?.location}`} />
        {listing?.photos?.[0] && (
          <meta property="og:image" content={listing.photos[0]} />
        )}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />

        {listing && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: listing.title,
                description: listing.description,
                image: listing.photos || [],
                url: typeof window !== 'undefined' ? window.location.href : '',
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'PHP',
                  price: listing.price,
                  availability: 'https://schema.org/InStock'
                },
                location: listing.location
              })
            }}
          />
        )}
      </Head>
<main className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">{listing.title}</h1>
      <p className="text-lg text-gray-800 dark:text-gray-200 mb-1">₱ {listing.price}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{listing.location}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">{listing.description}</p>
    </main>
</>
  )
}
