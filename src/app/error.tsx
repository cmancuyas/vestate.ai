'use client'

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md bg-red-100 text-red-800 border border-red-300 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <pre className="text-sm whitespace-pre-wrap">{error.message}</pre>
      </div>
    </div>
  )
}