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
    const { 
      bid_id, 
      product_id, 
      amount, 
      seller_stripe_account_id 
    } = await req.json()

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get bid details and validate
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*, products!inner(*)')
      .eq('id', bid_id)
      .single()

    if (bidError || !bid) {
      throw new Error('Bid not found')
    }

    // Validate that the buyer is not the seller
    if (bid.buyer_id === bid.products.seller_id) {
      throw new Error('Buyer cannot be the seller')
    }

    // Validate that the current user is the buyer
    if (bid.buyer_id !== user.id) {
      throw new Error('Unauthorized: Only the bidder can initiate payment')
    }

    // Validate that the bid is accepted
    if (bid.status !== 'accepted') {
      throw new Error('Bid must be accepted before payment can be initiated')
    }

    // Validate payment amount matches bid amount (not product price)
    if (amount !== bid.amount) {
      throw new Error('Payment amount does not match accepted bid amount')
    }

    // Validate product ID matches
    if (product_id !== bid.products.id) {
      throw new Error('Product ID mismatch')
    }

    // Calculate platform fee (5%)
    const platformFee = Math.round(amount * 0.05 * 100) // Convert to cents
    const totalAmount = Math.round(amount * 100) // Convert to cents

    // Create Stripe Checkout session with application fee
    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price_data][currency]': 'inr',
        'line_items[0][price_data][product_data][name]': 'Product Purchase',
        'line_items[0][price_data][unit_amount]': totalAmount.toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=marketplace`,
        'cancel_url': `${req.headers.get('origin')}/my-activity`,
        'payment_intent_data[application_fee_amount]': platformFee.toString(),
        'payment_intent_data[transfer_data][destination]': seller_stripe_account_id,
        'metadata[bid_id]': bid_id,
        'metadata[product_id]': product_id,
      }),
    })

    const sessionData = await session.json()

    if (!session.ok) {
      throw new Error(sessionData.error?.message || 'Failed to create checkout session')
    }

    // Store transaction record
    if (user) {
      await supabase
        .from('transactions')
        .insert({
          bid_id: bid_id,
          buyer_id: user.id,
          seller_id: bid.products.seller_id,
          product_id: product_id,
          amount: amount,
          platform_fee: platformFee / 100,
          seller_amount: (totalAmount - platformFee) / 100,
          stripe_session_id: sessionData.id,
          status: 'pending',
          confirmation_status: 'pending'
        })

      // Create notification for seller about incoming payment
      await supabase
        .from('notifications')
        .insert({
          user_id: bid.products.seller_id,
          type: 'payment_initiated',
          title: 'Payment Initiated',
          message: `Buyer has initiated payment for your product. Transaction will complete once payment is processed.`,
          related_id: bid_id,
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
    console.error('Marketplace payment creation error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      user_id: user?.id || 'unknown',
      bid_id: bid_id || 'unknown',
      product_id: product_id || 'unknown',
      amount: amount || 'unknown'
    })
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
