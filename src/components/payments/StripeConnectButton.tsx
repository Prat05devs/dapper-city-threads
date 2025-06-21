
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard } from 'lucide-react';

interface StripeConnectButtonProps {
  onSuccess?: () => void;
}

const StripeConnectButton: React.FC<StripeConnectButtonProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConnectStripe = async () => {
    try {
      setLoading(true);
      console.log('Starting Stripe Connect flow...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to connect your Stripe account.",
          variant: "destructive",
        });
        return;
      }

      console.log('User authenticated, calling Stripe Connect function...');

      const { data, error } = await supabase.functions.invoke('create-stripe-connect-account', {
        body: {
          country: 'IN', // Default to India, can be made dynamic
          email: session.user.email,
          business_type: 'individual'
        }
      });

      console.log('Stripe Connect response:', { data, error });

      if (error) {
        console.error('Stripe Connect error:', error);
        throw error;
      }

      if (!data?.onboarding_url) {
        throw new Error('No onboarding URL received from Stripe');
      }

      // Open Stripe onboarding in new tab
      console.log('Opening Stripe onboarding URL:', data.onboarding_url);
      window.open(data.onboarding_url, '_blank');
      
      toast({
        title: "Redirecting to Stripe",
        description: "Complete your account setup to start receiving payments.",
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Stripe Connect error:', error);
      const errorMessage = error?.message || 'Failed to connect to Stripe';
      toast({
        title: "Connection failed",
        description: errorMessage + ". Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleConnectStripe}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      {loading ? 'Connecting...' : 'Connect Stripe Account'}
    </Button>
  );
};

export default StripeConnectButton;
