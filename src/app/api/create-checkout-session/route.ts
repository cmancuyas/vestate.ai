
import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// src/app/api/create-checkout-session/route.ts

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

const PRICE_IDS: Record<string, string> = {
  premium: getEnv('STRIPE_PREMIUM_LISTING_PRICE_ID'),
  subscription: getEnv('STRIPE_AGENT_SUBSCRIPTION_PRICE_ID'),
  valuation: getEnv('STRIPE_VALUATION_PRICE_ID'),
  boost: getEnv('STRIPE_BOOST_PRICE_ID'),
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { productType = 'premium', customerEmail } = body

  const priceId = PRICE_IDS[productType]
  if (!priceId) {
    return NextResponse.json({ error: 'Invalid product type' }, { status: 400 })
  }

  const mode = productType === 'subscription' ? 'subscription' : 'payment'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    mode,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
  })

  return NextResponse.json({ url: session.url })
}
