'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const { id: postId } = useParams()

  useEffect(() => {
    if (!postId) return
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      setComments(data || [])
    }
    fetchComments()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_id: user?.id,
        content: text,
      }
    ])
    if (error) alert(error.message)
    else {
      setText('')
      setComments(prev => [...prev, { post_id: postId, content: text, created_at: new Date().toISOString() }])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-2 mb-4">
        {comments.map((c, i) => (
          <div key={i} className="border-b pb-2 text-sm">
            <p>{c.content}</p>
            <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Send</button>
      </form>
    </div>
  )
}
