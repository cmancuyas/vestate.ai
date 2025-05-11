// src/components/ui/toast-context.tsx
'use client'

import * as React from 'react'
import { JSX } from 'react'

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
  className?: string
  fading?: boolean
  variant?: ToastVariant
}

type ToastContextValue = {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id' | 'fading'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    // Trigger fade-out
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, fading: true } : toast))
    )

    // Remove from DOM after fade-out animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 400) // Matches fade-out duration
  }, [])

  const toast = React.useCallback(
    (toastData: Omit<Toast, 'id' | 'fading'>) => {
      const isDuplicate = toasts.some(
        (t) =>
          t.title === toastData.title &&
          t.description === toastData.description &&
          !t.fading
      )

      if (!isDuplicate) {
        const id = crypto.randomUUID()
        const newToast: Toast = { id, ...toastData }
        setToasts((prev) => [...prev, newToast])

        setTimeout(() => {
          dismiss(id)
        }, toastData.duration ?? 3000)
      }
    },
    [toasts, dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}
