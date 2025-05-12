'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewPostPage() {
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role

    let imageUrl = null
    if (image) {
      const fileName = `${user?.id}-${Date.now()}-${image.name}`
      const { data: uploadData, error: uploadError } = await supabase
        .storage.from('post_images')
        .upload(fileName, image)
      if (uploadError) {
        alert('Image upload failed.')
        return
      }
      imageUrl = supabase.storage.from('post_images').getPublicUrl(fileName).data.publicUrl
    }

    const { error } = await supabase.from('posts').insert([
      {
        content,
        user_id: user?.id,
        role: role || 'guest',
        image_url: imageUrl
      },
    ])
    if (error) {
      alert('Failed to post: ' + error.message)
    } else {
      router.push('/dashboard/feed')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create a Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something about real estate..."
          className="w-full p-3 border rounded"
        />
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Post
        </button>
      </form>
    </div>
  )
}
