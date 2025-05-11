// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, LogIn, UserPlus, Facebook } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    setErrorMsg('')
    if (!email || !password) {
      setErrorMsg('Email and password are required.')
      return
    }

    setLoading(true)
    let response

    if (isSignUp) {
      response = await supabase.auth.signUp({ email, password })
    } else {
      response = await supabase.auth.signInWithPassword({ email, password })
    }

    const { error } = response
    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/dashboard')
    }
  }

const handleFacebookLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/check-new-user`
    }
  })

  if (error) {
    console.error('OAuth login error:', error)
  }
}


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-5">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          {isSignUp ? 'Sign Up' : 'Login'} to Vestate.ai
        </h1>

        {errorMsg && (
          <div className="text-sm text-red-600 text-center bg-red-100 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-700"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>

        <button
          onClick={handleFacebookLogin}
          className="w-full bg-blue-500 text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-blue-600"
        >
          <Facebook className="w-4 h-4" />
          Continue with Facebook
        </button>

        <p className="text-center text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? 'Login here' : 'Sign up here'}
          </button>
        </p>
      </div>
    </main>
  )
}
