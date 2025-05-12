
import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const PRICE_IDS: Record<string, string> = {
  premium: process.env.STRIPE_PREMIUM_LISTING_PRICE_ID,
  subscription: process.env.STRIPE_AGENT_SUBSCRIPTION_PRICE_ID,
  valuation: process.env.STRIPE_VALUATION_PRICE_ID,
  boost: process.env.STRIPE_BOOST_PRICE_ID,
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
