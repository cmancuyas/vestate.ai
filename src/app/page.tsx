// src/app/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import FeatureCard from '@/components/ui/FeatureCard'
import { useDarkMode } from '@/context/DarkModelContext'

export default function LandingPage() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const featureCards = [
    {
      title: 'AI-Powered Property Analysis',
      description: 'Evaluate properties instantly based on price trends, location, and ROI potential.',
      image: '/images/landing/ai-powered-property-analysis.png',
    },
    {
      title: 'Real-Time Market Insights',
      description: 'Track regional demand trends, hot zones, and investment signals.',
      image: '/images/landing/real-time-market-insights.png',
    },
    {
      title: 'Smart Buyer & Seller Matching',
      description: 'AI-powered matching to connect buyers with ideal properties.',
      image: '/images/landing/smart-buyer-and-seller-matching.png',
    },
    {
      title: 'Automated Valuation Tools',
      description: 'No appraiser needed. Get instant AI valuations and pricing advice.',
      image: '/images/landing/automated-evaluation-tools.png',
    },
    {
      title: 'Local Data Integration',
      description: 'Integrated Philippine datasets (Metro Manila, Tagaytay, etc).',
      image: '/images/landing/location-data-integration.png',
    },
    {
      title: 'Custom Alerts & Recommendations',
      description: 'Be notified on price drops, hot leads, and neighborhood shifts.',
      image: '/images/landing/custom-alert-and-recommendations.png',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black dark:text-white transition-colors">
      {/* Header */}
      <header className="max-w-7xl mx-auto py-6 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Vestate.ai</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-sm font-medium bg-white/80 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition backdrop-blur-md shadow-sm"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md"
          >
            Sign Up
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-blue-600"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/images/landing-page.png')",
          minHeight: '60vh',
        }}
      >
        <div className="bg-black/50 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center text-center px-4 py-20">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Smart Real Estate. <br className="hidden sm:block" /> Backed by AI.
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl text-gray-200">
            Empowering investors, buyers, and sellers with real-time insights and automation in the Philippine market.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card, i) => (
            <FeatureCard key={i} {...card} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-10 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Vestate.ai — All rights reserved.
      </footer>
    </main>
  )
}
