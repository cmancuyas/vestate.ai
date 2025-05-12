'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ id: number; text: string; created_at: string }[]>([])
  const [text, setText] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)

      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true })
      setMessages(data || [])

      supabase.channel('chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          setMessages(prev => [...prev, payload.new as any])
        })
        .subscribe()
    }
    setup()
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const { error } = await supabase.from('messages').insert([{ text }])
    if (error) alert('Message failed')
    else setText('')
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm border-b pb-1">
            <span className="text-gray-600">{new Date(msg.created_at).toLocaleTimeString()}: </span>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Send</button>
      </form>
    </div>
  )
}
