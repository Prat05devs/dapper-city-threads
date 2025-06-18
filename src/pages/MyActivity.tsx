
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Package, MessageSquare, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type Bid = Tables<'bids'>;
type Notification = Tables<'notifications'>;
type SellerReview = Tables<'seller_reviews'>;

const MyActivity = () => {
  const { user } = useAuth();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [myReviews, setMyReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch my products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch my bids
      const { data: bids } = await supabase
        .from('bids')
        .select('*, products(name, price)')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch my notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch reviews I've received as a seller
      const { data: reviews } = await supabase
        .from('seller_reviews')
        .select('*, buyer:profiles!buyer_id(full_name)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      setMyProducts(products || []);
      setMyBids(bids || []);
      setNotifications(notifs || []);
      setMyReviews(reviews || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'countered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please sign in to view your activity.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your activity...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Activity</h1>
      
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>My Products</span>
          </TabsTrigger>
          <TabsTrigger value="bids" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>My Bids</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products I've Listed ({myProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {myProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You haven't listed any products yet.</p>
              ) : (
                <div className="grid gap-4">
                  {myProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">${product.price}</p>
                        <p className="text-sm text-gray-500">
                          {product.likes_count} likes • {product.condition}
                        </p>
                      </div>
                      <Badge className={`${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Bids I've Made ({myBids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {myBids.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You haven't placed any bids yet.</p>
              ) : (
                <div className="grid gap-4">
                  {myBids.map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{(bid as any).products?.name}</h3>
                        <p className="text-gray-600">Your bid: ${bid.amount}</p>
                        <p className="text-sm text-gray-500">
                          Product price: ${(bid as any).products?.price}
                        </p>
                        {bid.message && (
                          <p className="text-sm text-gray-600 mt-1">"{bid.message}"</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(bid.status || 'pending')}>
                        {bid.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notifications yet.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews I've Received as a Seller</CardTitle>
            </CardHeader>
            <CardContent>
              {myReviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet. Complete some sales to receive reviews!</p>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {(review as any).buyer?.full_name || 'Anonymous'}
                        </span>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyActivity;
