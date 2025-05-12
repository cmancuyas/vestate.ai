'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js'
import { supabase } from '@/lib/supabaseClient'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

export default function AnalyticsDashboard() {
  const [categoryCounts, setCategoryCounts] = useState({})
  const [averagePrices, setAveragePrices] = useState({})

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data: listings } = await supabase.from('listings').select('*')

      const categoryMap: Record<string, number> = {}
      const priceMap: Record<string, number> = {}
      const countMap: Record<string, number> = {}

      listings?.forEach(listing => {
        const cat = listing.category || 'uncategorized'
        categoryMap[cat] = (categoryMap[cat] || 0) + 1
        priceMap[cat] = (priceMap[cat] || 0) + listing.price
        countMap[cat] = (countMap[cat] || 0) + 1
      })

      const avgMap: Record<string, number> = {}
      for (const cat in priceMap) {
        avgMap[cat] = priceMap[cat] / countMap[cat]
      }

      setCategoryCounts(categoryMap)
      setAveragePrices(avgMap)
    }

    fetchAnalytics()
  }, [])

  const categoryChart = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Listings per Category',
        data: Object.values(categoryCounts),
        backgroundColor: '#3b82f6'
      }
    ]
  }

  const avgPriceChart = {
    labels: Object.keys(averagePrices),
    datasets: [
      {
        label: 'Avg Price per Category',
        data: Object.values(averagePrices),
        backgroundColor: '#10b981'
      }
    ]
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="mb-10 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Listings by Category</h2>
        <Bar data={categoryChart} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Average Price by Category</h2>
        <Bar data={avgPriceChart} />
      </div>
    </div>
  )
}
