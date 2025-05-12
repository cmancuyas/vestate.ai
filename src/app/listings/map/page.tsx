// src/app/listings/map/page.tsx
'use client'
export const dynamic = 'force-dynamic'

import nextDynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Leaflet must be dynamically imported
const MapContainer = nextDynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = nextDynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = nextDynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = nextDynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
import 'leaflet/dist/leaflet.css'

export default function ListingMapPage() {
  const [category, setCategory] = useState('')
  const [listings, setListings] = useState<any[]>([])

useEffect(() => {
  const fetchListings = async () => {
    // First query to fetch listings with a specific category filter
    let query = supabase
      .from('listings')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (category) query = query.eq('category', category)

    const { data: categoryData } = await query  // renamed data to categoryData
    setListings(categoryData || [])

    // Second query to fetch listings again without a category filter
    const { data: allData } = await supabase
      .from('listings')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
    setListings(allData || [])
  }

  fetchListings()
}, [category])  // Added `category` to dependency array to trigger on category change


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listings Map</h1>
      <select
  value={category}
  onChange={e => setCategory(e.target.value)}
  className="p-2 border rounded"
>
  <option value="">All Categories</option>
  <option value="residential">Residential</option>
  <option value="commercial">Commercial</option>
  <option value="foreclosed">Foreclosed</option>
  <option value="under_construction">Under Construction</option>
</select>

      <div className="w-full h-[75vh] rounded overflow-hidden">
        <MapContainer center={[14.5995, 120.9842]} zoom={10} scrollWheelZoom={true} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {listings.map((listing, idx) => (
            <Marker key={idx} position={[listing.latitude, listing.longitude]}>
              <Popup>
                <strong>{listing.title}</strong><br />
                ₱{listing.price}<br />
                {listing.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
