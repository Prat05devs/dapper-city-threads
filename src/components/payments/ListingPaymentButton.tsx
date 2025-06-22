
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Star } from 'lucide-react';

interface ListingPaymentButtonProps {
  type: 'listing_fee' | 'featured_3_days' | 'featured_7_days';
  productId?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const ListingPaymentButton: React.FC<ListingPaymentButtonProps> = ({ 
  type, 
  productId, 
  disabled,
  children 
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getButtonText = () => {
    switch (type) {
      case 'listing_fee':
        return 'Set Up Stripe Account to List Products';
      case 'featured_3_days':
        return 'Feature for ₹100 (3 days)';
      case 'featured_7_days':
        return 'Feature for ₹200 (7 days)';
      default:
        return 'Pay Now';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'listing_fee':
        return <Plus className="w-4 h-4 mr-2" />;
      case 'featured_3_days':
      case 'featured_7_days':
        return <Star className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const handlePayment = async () => {
    if (type === 'listing_fee') {
      // For listing fee, redirect to Stripe Connect setup
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to set up your Stripe account.",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase.functions.invoke('create-stripe-connect-account', {
          body: {}
        });

        if (error) throw error;

        // Open Stripe Connect onboarding in new tab
        window.open(data.url, '_blank');
        
      } catch (error) {
        console.error('Stripe Connect setup error:', error);
        toast({
          title: "Setup failed",
          description: "Failed to set up Stripe account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // For other payment types
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to make a payment.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-listing-payment', {
        body: {
          type,
          product_id: productId
        }
      });

      if (error) throw error;

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Required</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          To list products on our marketplace, you need to set up a Stripe account to receive payments from buyers.
        </p>
        <Button 
          onClick={handlePayment}
          disabled={loading || disabled}
          className="w-full"
          variant={type.includes('featured') ? 'default' : 'outline'}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            getIcon()
          )}
          {loading ? 'Setting up...' : (children || getButtonText())}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ListingPaymentButton;
