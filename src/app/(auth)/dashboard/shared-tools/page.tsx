'use client'
export const dynamic = 'force-dynamic'

import { requireRole } from '@/lib/auth/require-role'

export default async function SharedToolsPage() {
  await requireRole(['admin', 'agent'], '/dashboard')

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-green-700">Shared Tools</h1>
      <p>Accessible by Admins and Agents.</p>
    </div>
  )
}