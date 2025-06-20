
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ListingPayment = {
  id: string;
  seller_id: string;
  amount: number;
  status: string;
  stripe_session_id: string;
  created_at: string;
  type: string;
  product_id?: string | null;
};

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<ListingPayment | null>(null);

  const sessionId = searchParams.get('session_id');
  const paymentType = searchParams.get('type');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      if (paymentType === 'marketplace') {
        // Handle marketplace payment verification
        const { data: transaction, error } = await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('stripe_session_id', sessionId)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Purchase successful!",
          description: "Your order has been placed. The seller has been notified.",
        });
      } else {
        // Handle listing payment verification
        const { data: payment, error } = await supabase
          .from('listing_payments')
          .update({ status: 'completed' })
          .eq('stripe_session_id', sessionId)
          .select()
          .single();

        if (error) throw error;

        // Handle featured listing payments
        if (payment && payment.product_id && (paymentType === 'featured_3_days' || paymentType === 'featured_7_days')) {
          // Update product to featured status
          const days = paymentType === 'featured_3_days' ? 3 : 7;
          const featuredUntil = new Date();
          featuredUntil.setDate(featuredUntil.getDate() + days);

          await supabase
            .from('products')
            .update({
              is_featured: true,
              featured_until: featuredUntil.toISOString(),
            })
            .eq('id', payment.product_id);
        }

        setPaymentDetails(payment as ListingPayment);
        
        toast({
          title: "Payment successful!",
          description: getSuccessMessage(paymentType),
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment verification failed",
        description: "Please contact support if you continue to see this message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSuccessMessage = (type: string | null) => {
    switch (type) {
      case 'featured_3_days':
        return "Your product is now featured for 3 days and will get more visibility.";
      case 'featured_7_days':
        return "Your product is now featured for 7 days and will get more visibility.";
      case 'listing_fee':
        return "You can now create additional listings beyond your free quota.";
      case 'marketplace':
        return "Your purchase was successful. The seller has been notified.";
      default:
        return "Your payment was processed successfully.";
    }
  };

  const getPaymentTypeDisplay = (type: string | null) => {
    switch (type) {
      case 'featured_3_days':
        return "Featured Listing - 3 Days";
      case 'featured_7_days':
        return "Featured Listing - 7 Days";
      case 'listing_fee':
        return "Additional Listing Fee";
      case 'marketplace':
        return "Product Purchase";
      default:
        return "Payment";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {(paymentType === 'featured_3_days' || paymentType === 'featured_7_days') ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-800 font-medium">Your product is now featured!</p>
                  <p className="text-yellow-700 text-sm">
                    It will appear at the top of search results and get more visibility from buyers.
                  </p>
                </div>
                <p className="text-gray-600">
                  Featured duration: {paymentType === 'featured_3_days' ? '3 days' : '7 days'}
                </p>
              </>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">{getPaymentTypeDisplay(paymentType)}</p>
                <p className="text-green-700 text-sm">
                  {getSuccessMessage(paymentType)}
                </p>
              </div>
            )}
            
            <div className="flex flex-col space-y-3 pt-4">
              <Button 
                onClick={() => navigate('/sell')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Seller Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/buy')} 
                className="w-full"
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
