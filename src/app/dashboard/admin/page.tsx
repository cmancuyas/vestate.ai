'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.role !== 'admin') return

      const { data: profiles } = await supabase.from('profiles').select('*')
      setUsers(profiles || [])

      const { data: postData } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
      setPosts(postData || [])
    }
    loadData()
  }, [])

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <h2 className="text-xl font-semibold mb-2">Users</h2>
      <ul className="mb-6 space-y-1 text-sm">
        {users.map(u => (
          <li key={u.id}>{u.name || u.id} — {u.role}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Recent Posts</h2>
      <ul className="space-y-3">
        {posts.map(p => (
          <li key={p.id} className="p-3 border rounded">
            <p className="text-sm">{p.content}</p>
            <button
              onClick={() => deletePost(p.id)}
              className="text-red-600 text-xs mt-2 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
