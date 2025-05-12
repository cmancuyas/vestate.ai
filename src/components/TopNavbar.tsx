'use client'

import UserMenu from '@/components/UserMenu'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function TopNavbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-gray-700 dark:text-gray-300"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">Vestate Dashboard</h1>
      </div>
      <UserMenu />
    </header>
  )
}