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
