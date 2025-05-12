'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Post = {
  id: string
  content: string
  role: string
  created_at: string
}

export default function FeedReader() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 border rounded shadow bg-white">
            <p className="text-sm text-gray-600">{new Date(post.created_at).toLocaleString()}</p>
            <p className="font-medium">{post.content}</p>
            <p className="text-xs text-gray-400">Posted by: {post.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
