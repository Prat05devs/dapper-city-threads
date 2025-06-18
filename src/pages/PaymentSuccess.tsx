
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bidId = searchParams.get('bid_id');
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (bidId) {
      updateBidStatus();
    }
  }, [bidId]);

  const updateBidStatus = async () => {
    try {
      // Update bid status to completed
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (bidError) throw bidError;

      // Fetch order details
      const { data: bidData, error: fetchError } = await supabase
        .from('bids')
        .select(`
          *,
          product:products(*),
          buyer:profiles!buyer_id(*)
        `)
        .eq('id', bidId)
        .single();

      if (fetchError) throw fetchError;

      setOrderDetails(bidData);

      // Update product status to sold
      await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', bidData.product_id);

      // Create notification for seller
      await supabase
        .from('notifications')
        .insert({
          user_id: bidData.product.seller_id,
          type: 'sale_completed',
          title: 'Item Sold!',
          message: `Your item "${bidData.product.name}" has been sold for $${bidData.amount}`,
          related_id: bidId,
        });

    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {orderDetails && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Details</h3>
              <p><strong>Item:</strong> {orderDetails.product.name}</p>
              <p><strong>Amount:</strong> ${orderDetails.amount}</p>
              <p><strong>Order ID:</strong> {orderDetails.id}</p>
            </div>
          )}
          
          <p className="text-gray-600">
            Thank you for your purchase! You will receive a confirmation email shortly.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/my-activity">View My Orders</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/buy">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
