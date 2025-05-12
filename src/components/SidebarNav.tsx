'use client'

/**
 * Sidebar navigation component used in all authenticated layouts.
 * Role-based links are filtered depending on the user role.
 * Sidebar open state is persisted to localStorage.
 */

import Link from 'next/link'
import { useUserRole } from '@/hooks/useUserRole'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, LayoutDashboard, Shield, Wrench } from 'lucide-react'

export default function SidebarNav() {
  const role = useUserRole()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-open')
    if (stored !== null) {
      setOpen(stored === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-open', String(open))
  }, [open])

  const navLinks = [
    { href: '/dashboard/settings', label: 'Account Settings' },
    { href: '/dashboard/listings/deleted', label: 'Deleted Listings', roles: ['admin'] },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/dashboard/agent-tools', label: 'Agent Tools', icon: <Shield className="h-4 w-4" />, roles: ['admin'] },
    { href: '/dashboard/shared-tools', label: 'Shared Tools', icon: <Wrench className="h-4 w-4" />, roles: ['admin', 'agent'] },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <div className="md:hidden p-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
        >
          <Menu className="h-5 w-5" />
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <nav
        className={`transition-all duration-300 ease-in-out ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} md:max-h-full md:opacity-100 md:block flex flex-col space-y-2 p-4 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 border-r`}
      >
        {navLinks.map(({ href, label, icon, roles }) => {
          if (roles && (!role || !roles.includes(role))) return null
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center space-x-2 text-sm font-medium ${isActive(href) ? 'text-blue-700 dark:text-blue-400 font-bold underline' : 'text-gray-700 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
