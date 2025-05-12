'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function EditProfilePage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      if (data) {
        setName(data.name || '')
        setBio(data.bio || '')
        setLocation(data.location || '')
        setAvatarUrl(data.avatar_url || null)
      }
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    let avatar_url = avatarUrl
    if (avatar) {
      const filename = `${user?.id}-${Date.now()}-${avatar.name}`
      const { error: uploadError } = await supabase
        .storage.from('avatars')
        .upload(filename, avatar, { upsert: true })
      if (!uploadError) {
        avatar_url = supabase.storage.from('avatars').getPublicUrl(filename).data.publicUrl
        setAvatarUrl(avatar_url)
      }
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user?.id,
      name,
      bio,
      location,
      avatar_url,
    })

    if (error) {
      alert('Failed to save profile: ' + error.message)
    } else {
      alert('Profile updated!')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      {avatarUrl && (
        <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mb-4 object-cover border" />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <textarea
          placeholder="Bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <input type="file" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  )
}
