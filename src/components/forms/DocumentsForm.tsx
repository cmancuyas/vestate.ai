// src/components/forms/DocumentsForm.tsx
'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCreateListingStore } from '@/store/useCreateListingStore'

const requiredDocs = [
  { key: 'agreement', label: 'Agreement of Purchase and Sale/Lease' },
  { key: 'scheduleB', label: 'Schedule B' },
  { key: 'cooperation', label: 'Confirmation of Cooperation' },
  { key: 'fintrac', label: 'ID Info Record (Fintrac)' }
]

export default function DocumentsForm() {
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const { commission, setField, addFile } = useCreateListingStore()

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docKey: string,
    label: string
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingKey(docKey)
    addFile(file, label, docKey)
    setUploadingKey(null)
    alert(`${label} ready for upload on submit.`)
  }

  return (
    <div className="space-y-6">
      {requiredDocs.map((doc) => (
        <div key={doc.key}>
          <label className="block font-medium mb-1">{doc.label}</label>
          <input
            type="file"
            accept=".pdf,.jpg,.png,.jpeg"
            onChange={(e) => handleFileSelect(e, doc.key, doc.label)}
            className="block w-full"
          />
          {uploadingKey === doc.key && (
            <div className="flex items-center gap-2 text-blue-600 mt-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing file...
            </div>
          )}
        </div>
      ))}

      <div>
        <label className="block font-medium mb-1">Buying Commission (%)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={commission}
          onChange={(e) => setField('commission', e.target.value)}
          placeholder="e.g. 2.5"
        />
      </div>
    </div>
  )
}