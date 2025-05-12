
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const sig = req.headers.get('stripe-signature') as string
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_email

    if (email) {
      const productType = session.metadata?.productType || 'premium'

      let updateData: Record<string, any> = {}
      if (productType === 'subscription') updateData.is_subscribed = true
      if (productType === 'premium') updateData.is_premium = true
      if (productType === 'boost') updateData.has_boosted = true
      if (productType === 'valuation') updateData.last_valuation_paid = new Date().toISOString()

      await supabase
        .from('profiles')
        .update(updateData)
        .eq('email', email)
    }
  }

  return NextResponse.json({ received: true })
}
