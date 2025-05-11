// src/components/forms/DealDetailsForm.tsx
'use client'

import { useCreateListingStore } from '@/store/useCreateListingStore'

export default function DealDetailsForm() {
  const {
    address,
    finalPrice,
    closingDate,
    buyerName,
    sellerName,
    sellerAgent,
    setField
  } = useCreateListingStore()

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium">Property Address</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          placeholder="123 Street, City"
          value={address}
          onChange={(e) => setField('address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Final Sale Price</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="₱ or $"
            value={finalPrice}
            onChange={(e) => setField('finalPrice', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Closing Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={closingDate}
            onChange={(e) => setField('closingDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">Buyer Name</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={buyerName}
          onChange={(e) => setField('buyerName', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Seller's Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={sellerName}
            onChange={(e) => setField('sellerName', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium">Seller's Agent</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={sellerAgent}
            onChange={(e) => setField('sellerAgent', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
