// src/app/dashboard/listings/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Send } from 'lucide-react'

export default function ListingDetailPage() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const { data: listingData } = await supabase
        .from('sale_listings')
        .select('*')
        .eq('id', id)
        .single()

      const { data: docData } = await supabase
        .from('listing_documents')
        .select('*')
        .eq('listing_id', id)

      const { data: msgData } = await supabase
        .from('listing_messages')
        .select('*')
        .eq('listing_id', id)
        .order('created_at', { ascending: true })

      setListing(listingData)
      setDocuments(docData || [])
      setMessages(msgData || [])
      setLoading(false)
    }

    fetchData()

    const channel = supabase
      .channel('realtime-listing-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'listing_messages',
          filter: `listing_id=eq.${id}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    setSending(true)

    const { error } = await supabase.from('listing_messages').insert([
      {
        listing_id: id,
        sender: 'Agent',
        message: newMessage.trim()
      }
    ])

    if (!error) setNewMessage('')
    setSending(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-sm">Listing not found.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-blue-600">Listing Details</h1>

        <div className="text-right">
        <a
            href={`/dashboard/listings/${id}/edit`}
            className="text-sm text-blue-600 hover:underline font-medium"
        >
            ✏️ Edit Listing
        </a>
        </div>


        <div className="space-y-2 text-sm text-gray-800">
          <div><strong>Property Address:</strong> {listing.address}</div>
          <div><strong>Buyer Name:</strong> {listing.buyer_name}</div>
          <div><strong>Seller Name:</strong> {listing.seller_name}</div>
          <div><strong>Seller Agent:</strong> {listing.seller_agent}</div>
          <div><strong>Final Price:</strong> ₱ {Number(listing.final_price).toLocaleString()}</div>
          <div><strong>Closing Date:</strong> {new Date(listing.closing_date).toLocaleDateString()}</div>
          <div><strong>Commission:</strong> {listing.commission}%</div>
        </div>

        {documents.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Documents</h2>
            <ul className="list-disc pl-5 text-sm text-blue-600">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={`https://wpdiadtykxjdmlzzcspr.supabase.co/storage/v1/object/public/listing-documents/${doc.file_key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.label || doc.file_key}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🗨 Messages */}
        <div className="space-y-2 mt-6">
          <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
          <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <div className="text-sm text-gray-800">
                  <strong>{msg.sender}:</strong> {msg.message}
                </div>
                <div className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
