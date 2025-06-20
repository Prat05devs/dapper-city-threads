
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
        return 'Pay ₹30 to List';
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
      {loading ? 'Processing...' : (children || getButtonText())}
    </Button>
  );
};

export default ListingPaymentButton;
