'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MyCommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchMyComments = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('comments')
        .select('*, listings(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setComments(data || [])
    }
    fetchMyComments()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Comments</h1>
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">You haven't posted any comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c.id} className="p-4 border rounded bg-white">
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(c.created_at).toLocaleString()}</p>
              {c.listings?.title && (
                <button
                  onClick={() => router.push(`/listings/${c.listing_id}`)}
                  className="text-blue-600 text-xs mt-2 hover:underline"
                >
                  View listing: {c.listings.title}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
