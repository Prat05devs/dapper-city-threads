import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Star, MessageSquare, CreditCard, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML, sanitizeText } from '@/lib/sanitize';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Product = Tables<'products'>;
type Profile = Tables<'profiles'>;
type SellerReview = Tables<'seller_reviews'> & {
  buyer?: {
    full_name: string | null;
  };
};

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
  const [contactMessage, setContactMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

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
      .select(`
        *,
        buyer:profiles!buyer_id(full_name)
      `)
      .eq('seller_id', product.seller_id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && !error) {
      setReviews(data as SellerReview[]);
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

    const bidAmountNum = Number(bidAmount);
    if (bidAmountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Bid amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (bidAmountNum > product.price) {
      toast({
        title: "Invalid amount",
        description: "Bid amount cannot exceed the product price.",
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
        amount: bidAmountNum,
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
      
      // Create notification for seller
      await supabase
        .from('notifications')
        .insert({
          user_id: product.seller_id,
          type: 'bid_accepted',
          title: 'New Bid Received',
          message: `You received a bid of ₹${bidAmount} for ${product.name}`,
          related_id: bidData.id,
        });
    }

    setLoading(false);
  };

  const submitReview = async () => {
    if (!user || !product) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit reviews.",
        variant: "destructive",
      });
      return;
    }

    if (user.id === product.seller_id) {
      toast({
        title: "Cannot review yourself",
        description: "You cannot review your own products.",
        variant: "destructive",
      });
      return;
    }

    setReviewSubmitting(true);

    const { error } = await supabase
      .from('seller_reviews')
      .insert({
        seller_id: product.seller_id,
        buyer_id: user.id,
        product_id: product.id,
        rating: reviewRating,
        comment: reviewComment,
      });

    if (error) {
      toast({
        title: "Review failed",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Review submitted!",
        description: "Your review has been posted successfully.",
      });
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      fetchSellerReviews(); // Refresh reviews
    }

    setReviewSubmitting(false);
  };

  const sendMessage = async () => {
    if (!user || !product || !contactMessage.trim()) {
      toast({
        title: "Please sign in and enter a message",
        description: "You need to be signed in and enter a message to contact the seller.",
        variant: "destructive",
      });
      return;
    }

    // Create notification for seller
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: product.seller_id,
        type: 'new_message',
        title: 'New Message',
        message: `${user.email} sent you a message about ${product.name}: "${contactMessage}"`,
        related_id: product.id,
      });

    if (error) {
      toast({
        title: "Message failed",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Message sent!",
        description: "Your message has been sent to the seller.",
      });
      setContactMessage('');
    }
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
      // Fetch seller profile to get Stripe account ID
      const { data: sellerProfile, error: sellerError } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', product.seller_id)
        .single();

      if (sellerError || !sellerProfile) {
        toast({
          title: "Error",
          description: "Could not find seller information",
          variant: "destructive",
        });
        return;
      }

      // Check if seller has connected Stripe account
      if (!sellerProfile.stripe_account_id) {
        toast({
          title: "Payment Unavailable",
          description: "The seller hasn't set up their payment account yet. Please contact the seller.",
          variant: "destructive",
        });
        return;
      }

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

      // Create marketplace payment with correct parameter names
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          bid_id: bidData.id,
          product_id: product.id,
          amount: Number(product.price),
          seller_stripe_account_id: sellerProfile.stripe_account_id,
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

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl max-h-[95vh] overflow-y-auto p-2 sm:p-4 md:p-6 rounded-xl shadow-xl mx-auto">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left side - Images */}
          <div className="bg-gray-50 p-2 sm:p-4 md:p-6 rounded-lg">
            {product.image_urls && product.image_urls.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.image_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={url} 
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                {product.image_urls && product.image_urls.length > 0 ? (
                  <img 
                    src={product.image_urls[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📷</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side - Details */}
          <div className="p-2 sm:p-4 md:p-6 space-y-6 overflow-y-auto max-h-[80vh] rounded-lg bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 break-words">{product.name}</h2>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="text-sm">
                    {product.condition}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {product.category}
                  </Badge>
                </div>
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLike}
                  className={isLiked ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>

            <div className="text-3xl font-bold text-green-600">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {product.city && product.country 
                  ? `${product.city}, ${product.country}` 
                  : 'Location not specified'
                }
              </span>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
                <p 
                  className="text-gray-700 leading-relaxed break-words"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.description) }}
                />
              </div>
            )}

            {/* Action Buttons for Authenticated Users */}
            {user && user.id !== product.seller_id && (
              <>
                {/* Buy Now Section */}
                <div className="border-t pt-6">
                  <Button 
                    onClick={handleBuyNow} 
                    disabled={paymentLoading} 
                    className="w-full mb-4"
                    size="lg"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {paymentLoading ? 'Processing...' : `Buy Now - ₹${product.price.toLocaleString()}`}
                  </Button>
                </div>

                {/* Bid Section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Make an Offer</h3>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Enter your offer amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <Textarea
                      placeholder="Optional message to seller"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      rows={2}
                    />
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

                {/* Contact Seller Section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Contact Seller</h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Send a message to the seller..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!contactMessage.trim()}
                      className="w-full"
                      variant="outline"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Sign In Prompt for Non-Authenticated Users */}
            {!user && (
              <div className="border-t pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-blue-900">Sign in to interact</h3>
                  <p className="text-blue-700 mb-3">
                    Sign in to place bids, contact sellers, and leave reviews.
                  </p>
                  <Button className="w-full" variant="outline">
                    Sign In
                  </Button>
                </div>
              </div>
            )}

            {/* Seller Info & Reviews Section */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 text-gray-900">Seller Information</h3>
              {seller && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg text-gray-900">{seller.full_name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(Math.round(seller.average_rating || 0))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({seller.total_ratings || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {seller.total_sales || 0} items sold
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Reviews</h4>
                  {user && user.id !== product.seller_id && !showReviewForm && (
                    <Button 
                      onClick={() => setShowReviewForm(true)}
                      variant="outline"
                      size="sm"
                    >
                      Write Review
                    </Button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h5 className="font-medium mb-3 text-gray-900">Write a Review</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Rating</label>
                        <div className="flex">
                          {renderStars(reviewRating, true, setReviewRating)}
                        </div>
                      </div>
                      <Textarea
                        placeholder="Share your experience with this seller..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={submitReview} 
                          disabled={reviewSubmitting}
                          size="sm"
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button 
                          onClick={() => setShowReviewForm(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-2">⭐</div>
                    <p className="text-gray-600 mb-2">No reviews yet</p>
                    {user && user.id !== product.seller_id && (
                      <Button 
                        onClick={() => setShowReviewForm(true)}
                        variant="outline"
                        size="sm"
                      >
                        Be the first to review this seller
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {review.buyer?.full_name || 'Anonymous'}
                          </span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        {review.comment && (
                          <p 
                            className="text-gray-600 mb-1"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(review.comment) }}
                          />
                        )}
                        <p className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
