
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, product_id } = await req.json()

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    // Determine price based on type
    let amount: number
    let productName: string
    
    if (type === 'listing_fee') {
      amount = 3000 // ₹30 in cents
      productName = 'Additional Product Listing Fee'
    } else if (type === 'featured_3_days') {
      amount = 10000 // ₹100 in cents
      productName = 'Featured Listing - 3 Days'
    } else if (type === 'featured_7_days') {
      amount = 20000 // ₹200 in cents
      productName = 'Featured Listing - 7 Days'
    } else {
      throw new Error('Invalid payment type')
    }

    // Create Stripe Checkout session
    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'inr',
        'line_items[0][price_data][product_data][name]': productName,
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
        'cancel_url': `${req.headers.get('origin')}/sell`,
        'metadata[type]': type,
        'metadata[product_id]': product_id || '',
      }),
    })

    const sessionData = await session.json()

    if (!session.ok) {
      throw new Error(sessionData.error?.message || 'Failed to create checkout session')
    }

    // Store payment record
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (user) {
      await supabase
        .from('listing_payments')
        .insert({
          seller_id: user.id,
          amount: amount / 100, // Convert back to rupees
          type: type,
          stripe_session_id: sessionData.id,
          product_id: product_id,
          status: 'pending'
        })
    }

    return new Response(
      JSON.stringify({ 
        session_id: sessionData.id,
        url: sessionData.url 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
