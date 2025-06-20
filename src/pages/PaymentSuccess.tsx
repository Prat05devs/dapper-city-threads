
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
      // Update payment status in database
      const { data: payment, error } = await supabase
        .from('listing_payments')
        .update({ status: 'completed' })
        .eq('stripe_session_id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setPaymentDetails(payment as ListingPayment);
      
      toast({
        title: "Payment successful!",
        description: paymentType === 'featured' 
          ? "Your product is now featured and will get more visibility."
          : "Your payment was processed successfully.",
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {paymentType === 'featured' ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <Package className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-yellow-800 font-medium">Your product is now featured!</p>
                  <p className="text-yellow-700 text-sm">
                    It will appear at the top of search results and get more visibility from buyers.
                  </p>
                </div>
                <p className="text-gray-600">
                  Featured duration: {paymentDetails?.type?.includes('3') ? '3 days' : '7 days'}
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Your payment has been processed successfully.
              </p>
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
