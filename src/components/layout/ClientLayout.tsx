//  src/components/layouts/ClientLayout.tsx

'use client'

/**
 * This component wraps all authenticated pages in the dashboard
 * with a sidebar + top navigation layout.
 *
 * It is used inside (auth)/layout.tsx after the user is authenticated
 * and their role is verified. It runs on the client to enable interactive
 * behavior like toggling the sidebar.
 */

import { useState } from 'react'
import SidebarNav from '@/components/SidebarNav'
import TopNavbar from '@/components/TopNavbar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Track sidebar visibility (for mobile toggle)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <aside className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-700`}>
          <SidebarNav />
        </aside>
        <main className="flex-1 p-4 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}
