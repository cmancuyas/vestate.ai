// src/app/(auth)/listings/new/page.tsx
'use client'
export const dynamic = 'force-dynamic'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ui/toast-context' // ✅ Correct toast hook

const ListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  location: z.string().min(3),
  category: z.string().min(1),
})

type ListingFormData = z.infer<typeof ListingSchema>

export default function NewListingPage() {
  const router = useRouter()
  const { toast } = useToast() // ✅ now using the proper toast function
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(ListingSchema),
  })

  const onSubmit = async (data: ListingFormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to create listings.',
        variant: 'warning',
      })
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, listing_count')
      .eq('id', user.id)
      .single()

    const isPro = profile?.role === 'pro'

    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('deleted', false)

    if (!isPro && (count || 0) >= 3) {
      setLimitReached(true)
      return
    }

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
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          data.location
        )}&key=${apiKey}`
      )
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
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      category: data.category,
      photos: uploadedUrls,
      latitude,
      longitude,
    })

    if (insertError) {
      toast({
        title: 'Failed to save listing',
        description: insertError.message,
        variant: 'error',
      })

    } else {
      toast({
        title: 'Listing created!',
        description: 'Your listing has been published successfully.',
        variant: 'success',
      })

      await supabase
        .rpc('increment_listing_count', { user_id: user.id })
        .eq('id', user.id)

      router.push('/dashboard/listings')
    }
  }

  if (limitReached) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold mb-4">Limit Reached</h2>
        <p className="text-gray-600">Free accounts are limited to 3 listings.</p>
        <a
          href="/dashboard/upgrade"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upgrade to Pro
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow mt-10 text-sm">
      <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('title')} placeholder="Title" className="w-full p-2 border rounded" />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <textarea {...register('description')} placeholder="Description" className="w-full p-2 border rounded" />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <input
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <input {...register('location')} placeholder="Location" className="w-full p-2 border rounded" />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}

        <select {...register('category')} className="w-full p-2 border rounded">
          <option value="">Select category</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="foreclosed">Foreclosed</option>
          <option value="under_construction">Under Construction</option>
        </select>
        {errors.category && <p className="text-red-500">{errors.category.message}</p>}

        <input type="file" multiple onChange={e => setPhotos(e.target.files)} className="w-full" />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Listing
        </button>
      </form>
    </div>
  )
}
