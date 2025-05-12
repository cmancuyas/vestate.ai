'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Sun, Moon, LogOut, User } from 'lucide-react'

export default function UserMenu() {
  const router = useRouter()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const current = stored || 'light'
    setTheme(current)
    root.classList.toggle('dark', current === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="relative ml-auto text-sm text-gray-700 dark:text-gray-300">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="px-3 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <User className="inline-block w-4 h-4 mr-1" />
        Account
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded shadow z-50">
          <button onClick={toggleTheme} className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
            Toggle Theme
          </button>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}