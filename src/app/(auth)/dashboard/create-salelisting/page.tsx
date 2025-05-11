// src/app/dashboard/create-listing/page.tsx
'use client'

import SaleListingTabs from '@/components/forms/SaleListingTabs'

export default function CreateSaleListingPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Create Sale Listing</h1>
        <SaleListingTabs />
      </div>
    </main>
  )
}
