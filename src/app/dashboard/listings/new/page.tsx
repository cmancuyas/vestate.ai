// src/app/dashboard/listings/new/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewListingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return alert('Not logged in')

    const uploadedUrls: string[] = []

    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i]
        const filename = `${user.id}-${Date.now()}-${file.name}`
        const { error } = await supabase.storage.from('listing-photos').upload(filename, file)
        if (!error) {
          const url = supabase.storage.from('listing-photos').getPublicUrl(filename).data.publicUrl
          uploadedUrls.push(url)
        }
      }
    }

    let latitude = null
    let longitude = null

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`)
      const result = await response.json()
      if (result.status === 'OK') {
        const loc = result.results[0].geometry.location
        latitude = loc.lat
        longitude = loc.lng
      }
    } catch (err) {
      console.error('Geocoding failed', err)
    }

    const { error: insertError } = await supabase.from('listings').insert({
      user_id: user.id,
      title,
      description,
      price: parseFloat(price),
      location,
      category,
      photos: uploadedUrls,
      latitude,
      longitude
    })

    if (insertError) {
      alert('Failed to save listing')
    } else {
      router.push('/dashboard/listings/my')
    }
  }

  if (limitReached) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold mb-4">Limit Reached</h2>
        <p className="text-gray-600">Free accounts are limited to 3 listings.</p>
        <a href="/dashboard/upgrade" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Upgrade to Pro
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border rounded" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Select category</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="foreclosed">Foreclosed</option>
          <option value="under_construction">Under Construction</option>
        </select>
        <input type="file" multiple onChange={e => setPhotos(e.target.files)} className="w-full" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Listing</button>
      </form>
    </div>
  )
}
