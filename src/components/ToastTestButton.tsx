// src/components/ToastTestButton.tsx
'use client'

import { useToast } from './ui/toast-context'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function ToastTestButton() {
  const { toast } = useToast()

  return (
    <div className="space-y-3">
      <button
        onClick={() =>
          toast({
            title: '✅ Success',
            description: 'Your operation was successful!',
            className: 'border-green-500',
          })
        }
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        <CheckCircle className="inline mr-2" size={16} />
        Show Success Toast
      </button>

      <button
        onClick={() =>
          toast({
            title: '⚠️ Warning',
            description: 'Please check your input.',
            className: 'border-yellow-500',
          })
        }
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
      >
        <AlertTriangle className="inline mr-2" size={16} />
        Show Warning Toast
      </button>

      <button
        onClick={() =>
          toast({
            title: '❌ Error',
            description: 'Something went wrong.',
            className: 'border-red-500',
          })
        }
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        <XCircle className="inline mr-2" size={16} />
        Show Error Toast
      </button>
    </div>
  )
}