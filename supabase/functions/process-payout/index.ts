
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get transaction details
    const { data: transaction, error } = await supabaseClient
      .from('transactions')
      .select(`
        *,
        seller:profiles!seller_id(stripe_account_id)
      `)
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      throw new Error('Transaction not found');
    }

    if (!transaction.seller?.stripe_account_id) {
      throw new Error('Seller Stripe account not connected');
    }

    // Process the payout to seller
    const payout = await stripe.transfers.create({
      amount: Math.round(transaction.seller_amount * 100), // Convert to cents
      currency: 'inr',
      destination: transaction.seller.stripe_account_id,
      description: `Payment for transaction ${transaction.id}`,
    });

    // Update transaction status
    await supabaseClient
      .from('transactions')
      .update({
        status: 'completed',
        confirmation_status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    // Send notification to seller
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: transaction.seller_id,
        type: 'payment_received',
        title: 'Payment Received',
        message: `You have received ₹${transaction.seller_amount} for your sale.`,
        related_id: transaction.id,
      });

    return new Response(
      JSON.stringify({ success: true, payoutId: payout.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Payout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
