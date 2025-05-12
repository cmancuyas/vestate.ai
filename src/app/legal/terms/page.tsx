'use client'
export const dynamic = 'force-dynamic'

// src/app/legal/terms/page.tsx

export default function TermsOfServicePage() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p>Welcome to Vestate.ai. By using our services, you agree to these terms.</p>
      <h2 className="text-xl font-semibold mt-6">Use of Service</h2>
      <p>You agree to use our service legally and not engage in harmful activities.</p>
      <h2 className="text-xl font-semibold mt-6">Accounts</h2>
      <p>You are responsible for maintaining your account's confidentiality.</p>
      <h2 className="text-xl font-semibold mt-6">Termination</h2>
      <p>We may suspend or terminate accounts violating our policies.</p>
    </main>
  )
}
