
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
    const { country, email, business_type } = await req.json()

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    // Create Stripe Connect account
    const stripeResponse = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'standard',
        country: country,
        email: email,
        business_type: business_type || 'individual',
      }),
    })

    const account = await stripeResponse.json()

    if (!stripeResponse.ok) {
      throw new Error(account.error?.message || 'Failed to create Stripe account')
    }

    // Create account link for onboarding
    const linkResponse = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        account: account.id,
        refresh_url: `${req.headers.get('origin')}/sell?refresh=${account.id}`,
        return_url: `${req.headers.get('origin')}/sell?success=${account.id}`,
        type: 'account_onboarding',
      }),
    })

    const accountLink = await linkResponse.json()

    if (!linkResponse.ok) {
      throw new Error(accountLink.error?.message || 'Failed to create account link')
    }

    // Update user profile with Stripe account ID
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
        .from('profiles')
        .update({ 
          stripe_account_id: account.id,
          stripe_onboarding_completed: false 
        })
        .eq('id', user.id)
    }

    return new Response(
      JSON.stringify({ 
        account_id: account.id,
        onboarding_url: accountLink.url 
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
