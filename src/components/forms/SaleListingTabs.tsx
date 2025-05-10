// src/components/forms/SaleListingTabs.tsx
'use client'

import { useState } from 'react'
import DealDetailsForm from './DealDetailsForm'
import DocumentsForm from './DocumentsForm'
import MessagesForm from './MessagesForm'
import { useCreateListingStore } from '@/store/useCreateSaleListingStore'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type SaleListingTabsProps = {
  editId?: string
}

const tabs = ['Deal Details', 'Documents', 'Messages'] as const
type Tab = typeof tabs[number]

export default function SaleListingTabs({ editId }: SaleListingTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Deal Details')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const {
    address,
    finalPrice,
    closingDate,
    buyerName,
    sellerName,
    sellerAgent,
    commission,
    uploadedFiles,
    clearFiles
  } = useCreateListingStore()

  const handleSubmit = async () => {
    if (!address || !finalPrice || !closingDate) {
      alert('Please fill in required fields.')
      return
    }

    setSubmitting(true)

    let listingId = editId
    let error = null

    // 1. Insert or update the listing
    if (editId) {
      const { error: updateError } = await supabase
        .from('sale_listings')
        .update({
          address,
          final_price: Number(finalPrice),
          closing_date: closingDate,
          buyer_name: buyerName,
          seller_name: sellerName,
          seller_agent: sellerAgent,
          commission: Number(commission)
        })
        .eq('id', editId)

      error = updateError
    } else {
      const { data, error: insertError } = await supabase
        .from('sale_listings')
        .insert([
          {
            address,
            final_price: Number(finalPrice),
            closing_date: closingDate,
            buyer_name: buyerName,
            seller_name: sellerName,
            seller_agent: sellerAgent,
            commission: Number(commission)
          }
        ])
        .select()
        .single()

      listingId = data?.id
      error = insertError
    }

    if (error) {
      alert('Error saving listing: ' + error.message)
      setSubmitting(false)
      return
    }

    // 2. Upload documents only if new ones were selected
    for (const fileObj of uploadedFiles) {
      const path = `${fileObj.keyPrefix}-${Date.now()}-${fileObj.file.name}`
      const { error: uploadErr } = await supabase.storage
        .from('listing-documents')
        .upload(path, fileObj.file)

      if (!uploadErr) {
        await supabase.from('listing_documents').insert([
          {
            listing_id: listingId,
            file_key: path,
            label: fileObj.label
          }
        ])
      }
    }

    clearFiles()
    setSubmitting(false)

    alert(editId ? 'Listing updated!' : 'Listing created!')
    router.push(`/dashboard/listings/${listingId}`)
  }

  return (
    <>
      {/* Tab headers */}
      <div className="flex gap-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {activeTab === 'Deal Details' && <DealDetailsForm />}
        {activeTab === 'Documents' && <DocumentsForm />}
        {activeTab === 'Messages' && <MessagesForm />}
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {editId ? 'Update Listing' : 'Submit Listing'}
        </button>
      </div>
    </>
  )
}
