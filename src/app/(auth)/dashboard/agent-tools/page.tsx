'use client'
export const dynamic = 'force-dynamic'

import { requireRole } from '@/lib/auth/require-role'

export default async function AgentToolsPage() {
  await requireRole(['agent'])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-blue-700">Agent Tools</h1>
      <p>Welcome, agent. Here are your tools...</p>
    </div>
  )
}