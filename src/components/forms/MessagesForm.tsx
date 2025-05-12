// src/components/forms/MessagesForm.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Send } from 'lucide-react'

const MOCK_LISTING_ID = 'mock-listing-id-123'

export default function MessagesForm() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch existing messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('listing_messages')
      .select('*')
      .eq('listing_id', MOCK_LISTING_ID)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }

  useEffect(() => {
    fetchMessages()

    // Realtime listener
    const channel = supabase
      .channel('realtime-listing-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'listing_messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async () => {
    if (!message.trim()) return

    setLoading(true)
    const { error } = await supabase.from('listing_messages').insert([
      {
        listing_id: MOCK_LISTING_ID,
        sender: 'Agent',
        message: message.trim()
      }
    ])
    setMessage('')
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <div className="text-sm text-gray-700">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
            <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send
        </button>
      </div>
    </div>
  )
}
