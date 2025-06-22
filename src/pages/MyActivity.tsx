
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, MessageSquare, Eye } from 'lucide-react';
import TransactionConfirmation from '@/components/transactions/TransactionConfirmation';

interface Bid {
  id: string;
  amount: number;
  status: string;
  message: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
    seller_id: string;
    profiles: {
      full_name: string;
      email: string;
      stripe_account_id: string;
    };
  };
}

interface Transaction {
  id: string;
  amount: number;
  status: string;
  confirmation_status: string;
  created_at: string;
  product?: {
    name: string;
    image_urls: string[];
  };
}

const MyActivity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bids, setBids] = useState<Bid[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserActivity();
    }
  }, [user]);

  const fetchUserActivity = async () => {
    if (!user) return;

    setLoading(true);
    
    // Fetch bids
    const { data: bidsData, error: bidsError } = await supabase
      .from('bids')
      .select(`
        id,
        amount,
        status,
        message,
        created_at,
        products!inner (
          id,
          name,
          price,
          image_urls,
          seller_id,
          profiles!products_seller_id_fkey (
            full_name,
            email,
            stripe_account_id
          )
        )
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (bidsData && !bidsError) {
      setBids(bidsData as any);
    }

    // Fetch transactions
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        status,
        confirmation_status,
        created_at,
        products (
          name,
          image_urls
        )
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (transactionsData && !transactionsError) {
      setTransactions(transactionsData as any);
    }

    setLoading(false);
  };

  const handleCompletePayment = async (bid: Bid) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          bid_id: bid.id,
          product_id: bid.product.id,
          amount: Number(bid.amount),
          seller_stripe_account_id: bid.product.profiles.stripe_account_id,
        },
      });

      if (error) throw error;

      // Open Stripe checkout
      window.open(data.url, '_blank');

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContactSeller = async (bid: Bid) => {
    // Create notification for seller
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: bid.product.seller_id,
        type: 'buyer_message',
        title: 'Message from Buyer',
        message: `Buyer wants to discuss the accepted bid for ${bid.product.name}. Contact: ${user.email}`,
        related_id: bid.id,
      });

    if (error) {
      toast({
        title: "Message failed",
        description: "Failed to send message to seller.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent!",
        description: "Seller has been notified that you want to get in touch.",
      });
    }
  };

  const getBidStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your activity</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading your activity...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Activity</h1>
      
      <Tabs defaultValue="bids" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="transactions">My Purchases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bids" className="space-y-4">
          {bids.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You haven't placed any bids yet.</p>
              </CardContent>
            </Card>
          ) : (
            bids.map((bid) => (
              <Card key={bid.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bid.product.name}</CardTitle>
                    {getBidStatusBadge(bid.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <img
                      src={bid.product.image_urls?.[0] || '/placeholder.svg'}
                      alt={bid.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Your bid:</span>
                        <span className="font-semibold">₹{bid.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Asking price:</span>
                        <span>₹{bid.product.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Seller:</span>
                        <span>{bid.product.profiles.full_name}</span>
                      </div>
                      {bid.message && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground">Your message:</span>
                          <p className="text-sm bg-gray-50 p-2 rounded mt-1">{bid.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {bid.status === 'accepted' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button 
                        onClick={() => handleCompletePayment(bid)}
                        className="flex-1"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Complete Payment
                      </Button>
                      <Button 
                        onClick={() => handleContactSeller(bid)}
                        variant="outline"
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Seller
                      </Button>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Bid placed on {new Date(bid.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          {transactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You haven't made any purchases yet.</p>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <TransactionConfirmation
                key={transaction.id}
                transaction={transaction as any}
                userRole="buyer"
                onUpdate={fetchUserActivity}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyActivity;
