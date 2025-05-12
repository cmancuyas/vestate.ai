import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { DarkModeProvider } from '@/context/DarkModelContext'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast-context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Vestate.ai',
  description: 'AI-powered real estate platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <head>
          <title>Vestate.ai | Smarter Real Estate Platform</title>
          <meta name="description" content="Discover, evaluate, and manage properties with AI-powered tools on Vestate.ai." />
          <meta property="og:title" content="Vestate.ai" />
          <meta property="og:description" content="Smarter real estate starts here. Find properties, estimate value, and more." />
          <meta property="og:image" content="/logo.png" />
          <meta property="og:url" content="https://vestate.ai" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="icon" href="/favicon.ico" />
        </head>
    
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DarkModeProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
