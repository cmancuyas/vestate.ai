'use client'
export const dynamic = 'force-dynamic'



import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/context/DarkModelContext'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Home, DollarSign, Globe, MessageCircle } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const features = [
    {
      title: 'Social Feed for Properties',
      desc: 'Interact with real-time posts, comments, and listings from verified users.',
      icon: <Home size={24} />
    },
    {
      title: 'AI Price Estimator',
      desc: 'Get smart price recommendations based on local trends and comparisons.',
      icon: <DollarSign size={24} />
    },
    {
      title: 'Foreclosure Sync',
      desc: 'Automatically show newly listed Pag-IBIG and US bank-acquired assets.',
      icon: <Globe size={24} />
    },
    {
      title: 'Messaging & Docs',
      desc: 'Communicate, share documents, and manage listings in-app.',
      icon: <MessageCircle size={24} />
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">Vestate.ai</h1>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <section className="text-center py-20 animate-fade-in px-6">
        <h2 className="text-4xl font-bold mb-4">Smarter Real Estate Starts Here</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Discover, evaluate, and manage properties with the power of AI, real-time insights,
          and streamlined workflows.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/login')}>Login</Button>
          <Button variant="outline" onClick={() => router.push('/signup')}>Sign Up</Button>
        </div>
      </section>

      <section className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto px-6 pb-20">
        {features.map((feat, idx) => (
          <div key={idx} className="bg-white transform transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 rounded-xl p-5 shadow flex items-start space-x-4">
            <div className="text-blue-600 dark:text-blue-300">{feat.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{feat.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="text-center animate-fade-in py-4 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Vestate.ai — All rights reserved.
      </footer>
    </div>
  )
}
