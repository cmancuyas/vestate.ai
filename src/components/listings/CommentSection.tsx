// src/components/listings/CommentSection.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  listing_id: string
}

export default function CommentSection({ listingId }: { listingId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setComments(data || [])
    } catch {
      setError('Failed to load comments.')
    }
  }

  useEffect(() => {
    loadComments()
  }, [listingId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Authentication failed.')

      if (!text.trim()) return

      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('user_id, title')
        .eq('id', listingId)
        .single()

      if (listingError) throw listingError

      await supabase.from('comments').insert({
        user_id: user.id,
        listing_id: listingId,
        content: text.trim(),
      })

      if (listingData?.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: listingData.user_id,
          type: 'comment',
          data: {
            listing_id: listingId,
            listing_title: listingData.title,
          },
        })
      }

      setText('')
      loadComments()
    } catch {
      setError('Failed to submit comment.')
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Post
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment.id} className="p-2 border rounded">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
