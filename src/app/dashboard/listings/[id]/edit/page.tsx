'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function EditListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [location,
      category, setLocation] = useState('')
  const [originalLocation, setOriginalLocation] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      const { data } = await supabase.from('listings').select('*').eq('id', id).single()
      if (data) {
        setTitle(data.title)
        setDescription(data.description)
        setPrice(data.price)
        setLocation(data.location)
        setOriginalLocation(data.location)
        setCategory(data.category || '')
      }
    }
    fetchListing()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    let latitude = null
    let longitude = null

    if (location !== originalLocation) {
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
    }

    const updateData: any = {
      title,
      description,
      price: parseFloat(price),
      location,
      category,
    }

    if (latitude && longitude) {
      updateData.latitude = latitude
      updateData.longitude = longitude
    }

    const { error } = await supabase.from('listings').update(updateData).eq('id', id)
    if (error) alert('Update failed')
    else router.push('/dashboard/listings/my')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
  <option value="">Select category</option>
  <option value="residential">Residential</option>
  <option value="commercial">Commercial</option>
  <option value="foreclosed">Foreclosed</option>
  <option value="under_construction">Under Construction</option>
</select>

        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update Listing</button>
      </form>
    </div>
  )
}
