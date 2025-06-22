
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Check, X, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ProductForm from '@/components/products/ProductForm';

interface Bid {
  id: string;
  amount: number;
  message: string;
  created_at: string;
  buyer_id: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
  status: string;
  created_at: string;
  bids: Bid[];
}

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterOffers, setCounterOffers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      fetchSellerProducts();
    }
  }, [user]);

  const fetchSellerProducts = async () => {
    if (!user) return;

    setLoading(true);
    
    const { data: productsData, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        image_urls,
        status,
        created_at,
        bids!inner (
          id,
          amount,
          message,
          created_at,
          buyer_id,
          status,
          profiles!bids_buyer_id_fkey (
            full_name,
            email
          )
        )
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (productsData && !error) {
      setProducts(productsData as any);
    }

    setLoading(false);
  };

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject', productId: string) => {
    try {
      const { error } = await supabase
        .from('bids')
        .update({ 
          status: action === 'accept' ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', bidId);

      if (error) throw error;

      // Create notification for buyer
      const bid = products.flatMap(p => p.bids).find(b => b.id === bidId);
      if (bid) {
        await supabase
          .from('notifications')
          .insert({
            user_id: bid.buyer_id,
            type: action === 'accept' ? 'bid_accepted' : 'bid_rejected',
            title: action === 'accept' ? 'Bid Accepted!' : 'Bid Rejected',
            message: action === 'accept' 
              ? `Your bid has been accepted! You can now complete the payment.`
              : `Your bid has been rejected. Try submitting a different offer.`,
            related_id: bidId,
          });
      }

      toast({
        title: `Bid ${action}ed!`,
        description: `The bid has been ${action}ed successfully.`,
      });

      fetchSellerProducts();
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} the bid.`,
        variant: "destructive",
      });
    }
  };

  const handleCounterOffer = async (bidId: string, productId: string) => {
    const counterAmount = counterOffers[bidId];
    if (!counterAmount) {
      toast({
        title: "Error",
        description: "Please enter a counter offer amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update the existing bid with counter offer
      const { error } = await supabase
        .from('bids')
        .update({ 
          amount: Number(counterAmount),
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', bidId);

      if (error) throw error;

      // Create notification for buyer
      const bid = products.flatMap(p => p.bids).find(b => b.id === bidId);
      if (bid) {
        await supabase
          .from('notifications')
          .insert({
            user_id: bid.buyer_id,
            type: 'counter_offer',
            title: 'Counter Offer Received',
            message: `Seller has made a counter offer of ₹${counterAmount}`,
            related_id: bidId,
          });
      }

      toast({
        title: "Counter offer sent!",
        description: "Your counter offer has been sent to the buyer.",
      });

      setCounterOffers(prev => ({ ...prev, [bidId]: '' }));
      fetchSellerProducts();
    } catch (error) {
      console.error('Error sending counter offer:', error);
      toast({
        title: "Error",
        description: "Failed to send counter offer.",
        variant: "destructive",
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
        <h1 className="text-2xl font-bold mb-4">Please sign in to sell products</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sell Your Products</h1>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List New Product</TabsTrigger>
          <TabsTrigger value="manage">Manage Products & Bids</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ProductForm onSuccess={fetchSellerProducts} />
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No products with bids found.</p>
              </CardContent>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={product.image_urls?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Asking price:</span>
                        <span className="font-semibold">₹{product.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Bids received:</span>
                        <span>{product.bids.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Bids:</h4>
                    {product.bids.map((bid) => (
                      <div key={bid.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{bid.profiles.full_name}</p>
                            <p className="text-sm text-muted-foreground">{bid.profiles.email}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">₹{bid.amount}</div>
                            {getBidStatusBadge(bid.status)}
                          </div>
                        </div>

                        {bid.message && (
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm">{bid.message}</p>
                          </div>
                        )}

                        {bid.status === 'pending' && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleBidAction(bid.id, 'accept', product.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                onClick={() => handleBidAction(bid.id, 'reject', product.id)}
                                size="sm"
                                variant="destructive"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Counter offer amount"
                                value={counterOffers[bid.id] || ''}
                                onChange={(e) => setCounterOffers(prev => ({ 
                                  ...prev, 
                                  [bid.id]: e.target.value 
                                }))}
                                className="flex-1 px-3 py-2 border rounded-md"
                              />
                              <Button 
                                onClick={() => handleCounterOffer(bid.id, product.id)}
                                size="sm"
                                variant="outline"
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Counter Offer
                              </Button>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Bid placed on {new Date(bid.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sell;
