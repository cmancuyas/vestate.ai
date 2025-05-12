'use client'
export const dynamic = 'force-dynamic'

// src/app/dashboard/listings/[id]/edit/page.tsx

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'
import SaleListingTabs from '@/components/forms/SaleListingTabs'
import { useCreateListingStore } from '@/store/useCreateListingStore'


export default function EditListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const {
    setField,
    clearFiles, // reset uploaded files when editing
  } = useCreateListingStore()

  useEffect(() => {
    if (!id) return

    const fetchAndPrefill = async () => {
      const { data, error } = await supabase
        .from('sale_listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        alert('Failed to load listing.')
        router.push('/dashboard/listings')
        return
      }

      // Populate Zustand store
      setField('address', data.address || '')
      setField('finalPrice', data.final_price?.toString() || '')
      setField('closingDate', data.closing_date || '')
      setField('buyerName', data.buyer_name || '')
      setField('sellerName', data.seller_name || '')
      setField('sellerAgent', data.seller_agent || '')
      setField('commission', data.commission?.toString() || '')
      clearFiles()

      setLoading(false)
    }

    fetchAndPrefill()
  }, [id, router, setField, clearFiles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Edit Listing</h1>
        <SaleListingTabs editId={id as string} />
      </div>
    </main>
  )
}
