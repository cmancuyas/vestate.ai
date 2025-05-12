// src/components/ui/toaster.tsx
'use client'

import * as React from 'react'
import { useToast } from './toast-context'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Circle,
  X,
} from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-500 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800'
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-800'
      default:
        return 'border-gray-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100'
    }
  }

  const getVariantIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="text-green-600 w-4 h-4 mr-2" />
      case 'error':
        return <XCircle className="text-red-600 w-4 h-4 mr-2" />
      case 'warning':
        return <AlertTriangle className="text-yellow-600 w-4 h-4 mr-2" />
      case 'info':
        return <Info className="text-blue-600 w-4 h-4 mr-2" />
      default:
        return <Circle className="text-gray-400 w-4 h-4 mr-2" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-80">
      {toasts.map((toast) => {
        const duration = toast.duration ?? 3000

        return (
          <div
            key={toast.id}
            className={`
              shadow-lg border rounded-lg p-4 transition-all overflow-hidden
              ${toast.fading ? 'animate-fade-out' : 'animate-slide-in-fade'}
              ${getVariantStyles(toast.variant)}
              ${toast.className ?? ''}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center font-semibold">
                {getVariantIcon(toast.variant)}
                <span>{toast.title}</span>
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            {toast.description && (
              <p className="text-sm mt-1">{toast.description}</p>
            )}

            {/* Progress bar */}
            {!toast.fading && (
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mt-3">
                <div
                  className="h-full bg-blue-600 animate-toast-progress"
                  style={{ animationDuration: `${duration}ms` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}