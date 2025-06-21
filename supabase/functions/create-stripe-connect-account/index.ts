
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
    console.log('Stripe Connect function started');

    // Get the request body
    const { country, email, business_type } = await req.json()
    console.log('Request data:', { country, email, business_type });

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not set');
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    console.log('Creating Stripe Connect account...');
    
    // Create Stripe Connect account
    const stripeResponse = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        type: 'standard',
        country: country || 'IN',
        email: email,
        business_type: business_type || 'individual',
      }),
    })

    const account = await stripeResponse.json()
    console.log('Stripe account response:', account);

    if (!stripeResponse.ok) {
      console.error('Stripe account creation failed:', account);
      throw new Error(account.error?.message || 'Failed to create Stripe account')
    }

    console.log('Creating account link...');
    
    // Create account link for onboarding
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const linkResponse = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        account: account.id,
        refresh_url: `${origin}/sell?refresh=${account.id}`,
        return_url: `${origin}/sell?success=${account.id}`,
        type: 'account_onboarding',
      }),
    })

    const accountLink = await linkResponse.json()
    console.log('Account link response:', accountLink);

    if (!linkResponse.ok) {
      console.error('Account link creation failed:', accountLink);
      throw new Error(accountLink.error?.message || 'Failed to create account link')
    }

    // Update user profile with Stripe account ID
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    console.log('Creating Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: { 
          persistSession: false 
        } 
      }
    )

    console.log('Getting user from token...');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      throw new Error('Failed to authenticate user')
    }

    console.log('Updating user profile...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        stripe_account_id: account.id,
        stripe_onboarding_completed: false 
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update failed:', updateError);
      throw new Error('Failed to update user profile')
    }

    console.log('Stripe Connect account created successfully');

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
    console.error('Error in create-stripe-connect-account:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
