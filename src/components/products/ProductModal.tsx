
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, MessageSquare, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Product = Tables<'products'>;
type Profile = Tables<'profiles'>;
type SellerReview = Tables<'seller_reviews'>;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [seller, setSeller] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      fetchSellerData();
      fetchSellerReviews();
      checkIfLiked();
    }
  }, [product, isOpen, user]);

  const fetchSellerData = async () => {
    if (!product) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', product.seller_id)
      .single();

    if (data && !error) {
      setSeller(data);
    }
  };

  const fetchSellerReviews = async () => {
    if (!product) return;

    const { data, error } = await supabase
      .from('seller_reviews')
      .select('*, buyer:profiles!buyer_id(*)')
      .eq('seller_id', product.seller_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data && !error) {
      setReviews(data as any);
    }
  };

  const checkIfLiked = async () => {
    if (!user || !product) return;

    const { data, error } = await supabase
      .from('product_likes')
      .select('id')
      .eq('product_id', product.id)
      .eq('user_id', user.id)
      .single();

    setIsLiked(!!data && !error);
  };

  const toggleLike = async () => {
    if (!user || !product) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like products.",
        variant: "destructive",
      });
      return;
    }

    if (isLiked) {
      await supabase
        .from('product_likes')
        .delete()
        .eq('product_id', product.id)
        .eq('user_id', user.id);
      setIsLiked(false);
    } else {
      await supabase
        .from('product_likes')
        .insert({
          product_id: product.id,
          user_id: user.id,
        });
      setIsLiked(true);
    }
  };

  const placeBid = async () => {
    if (!user || !product) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to place bids.",
        variant: "destructive",
      });
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid bid amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: bidData, error } = await supabase
      .from('bids')
      .insert({
        product_id: product.id,
        buyer_id: user.id,
        amount: Number(bidAmount),
        message: bidMessage,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Bid failed",
        description: "Failed to place your bid. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bid placed!",
        description: "Your bid has been submitted to the seller.",
      });
      setBidAmount('');
      setBidMessage('');
      
      // Trigger real-time notification for seller
      await supabase
        .from('notifications')
        .insert({
          user_id: product.seller_id,
          type: 'new_bid',
          title: 'New Bid Received',
          message: `You received a bid of ₹${bidAmount} for ${product.name}`,
          related_id: bidData.id,
        });
    }

    setLoading(false);
  };

  const handleBuyNow = async () => {
    if (!user || !product) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to purchase items.",
        variant: "destructive",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      // Create a bid at full price first
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .insert({
          product_id: product.id,
          buyer_id: user.id,
          amount: Number(product.price),
          message: 'Buy now purchase',
          status: 'accepted',
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // Create marketplace payment with commission handling
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          bidId: bidData.id,
          amount: Number(product.price),
          sellerId: product.seller_id,
          productId: product.id,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!product) return null;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.image_urls && product.image_urls.length > 0 ? (
                <img 
                  src={product.image_urls[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Right side - Details */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{product.name}</h2>
                <Badge variant="secondary" className="mt-1">
                  {product.condition}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLike}
                className={isLiked ? 'text-red-500' : 'text-gray-400'}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              ₹{product.price}
            </div>

            {seller && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{seller.city || 'Location not specified'}</span>
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{product.likes_count} likes</span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Buy Now Section */}
            {user && user.id !== product.seller_id && (
              <div className="border-t pt-4">
                <Button 
                  onClick={handleBuyNow} 
                  disabled={paymentLoading} 
                  className="w-full mb-4"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {paymentLoading ? 'Processing...' : `Buy Now - ₹${product.price}`}
                </Button>
              </div>
            )}

            {/* Seller Reviews Section */}
            <div>
              <h3 className="font-semibold mb-3">Seller Reviews</h3>
              {seller && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-medium">{seller.full_name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(Math.round(seller.average_rating || 0))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({seller.total_ratings} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {seller.total_sales} items sold
                  </div>
                </div>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Be the first one to review this seller.
                </p>
              ) : (
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {(review as any).buyer?.full_name || 'Anonymous'}
                        </span>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bid Section */}
            {user && user.id !== product.seller_id && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Make an Offer</h3>
                <div className="space-y-3">
                  <div>
                    <Input
                      type="number"
                      placeholder="Enter your offer amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Optional message to seller"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={placeBid} 
                    disabled={loading} 
                    className="w-full"
                    variant="outline"
                  >
                    {loading ? 'Placing Offer...' : 'Make Offer'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
