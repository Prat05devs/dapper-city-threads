import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, Star, MessageSquare, CreditCard, Send, User, ShoppingCart, DollarSign } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
  };

  const handleBidMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBidMessage(e.target.value);
  };

  const handleContactMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContactMessage(e.target.value);
  };

  const handleReviewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewComment(e.target.value);
  };

  useEffect(() => {
    if (product && isOpen) {
      fetchSellerData();
      fetchSellerReviews();
      checkIfLiked();
    }
  }, [product?.id, isOpen, user?.id]);

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

  const toggleLike = useCallback(async () => {
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
  }, [user, product, isLiked, toast]);

  const placeBid = useCallback(async () => {
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
        title: "High bid",
        description: "Your bid is higher than the asking price. The seller may accept it immediately.",
        variant: "default",
      });
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
  }, [user, product, bidAmount, bidMessage, toast]);

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
      fetchSellerReviews();
    }

    setReviewSubmitting(false);
  };

  const sendMessage = useCallback(async () => {
    if (!user || !product || !contactMessage.trim()) {
      toast({
        title: "Please sign in and enter a message",
        description: "You need to be signed in and enter a message to contact the seller.",
        variant: "destructive",
      });
      return;
    }

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
  }, [user, product, contactMessage, toast]);

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

      if (!sellerProfile.stripe_account_id) {
        toast({
          title: "Payment Unavailable",
          description: "The seller hasn't set up their payment account yet. Please contact the seller.",
          variant: "destructive",
        });
        return;
      }

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

      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          bid_id: bidData.id,
          product_id: product.id,
          amount: Number(product.price),
          seller_stripe_account_id: sellerProfile.stripe_account_id,
        },
      });

      if (error) throw error;

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

  const renderStars = useCallback((rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ));
  }, []);

  const ActionButtons = () => {
    if (!user) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <h3 className="font-semibold mb-2 text-blue-900">Sign in to interact</h3>
          <p className="text-blue-700 mb-3">Sign in to purchase, make offers, and contact sellers.</p>
          <Button className="w-full" variant="outline">Sign In</Button>
        </div>
      );
    }

    if (user.id === product.seller_id) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600">This is your product listing</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Make Offer Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Make an Offer
          </h4>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount"
              value={bidAmount}
              onChange={handleBidAmountChange}
              className="flex-1"
            />
            <Button 
              onClick={placeBid} 
              disabled={loading || !bidAmount} 
              variant="outline"
            >
              {loading ? 'Placing...' : 'Bid'}
            </Button>
          </div>
          <Textarea
            placeholder="Optional message to seller"
            value={bidMessage}
            onChange={handleBidMessageChange}
            rows={2}
            className="text-sm"
          />
        </div>

        {/* Contact Seller Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contact Seller
          </h4>
          <div className="flex gap-2">
            <Textarea
              placeholder="Message seller..."
              value={contactMessage}
              onChange={handleContactMessageChange}
              rows={2}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!contactMessage.trim()}
              variant="outline"
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const SellerInfo = () => (
    <div className="space-y-4">
      {seller && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{seller.full_name}</h4>
              <p className="text-sm text-gray-600">{seller.total_sales || 0} items sold</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(seller.average_rating || 0))}
            </div>
            <p className="text-sm text-gray-600">({seller.total_ratings || 0} reviews)</p>
          </div>
        </div>
      )}
    </div>
  );

  const ReviewsSection = () => (
    <div className="space-y-4">
      {user && user.id !== product.seller_id && (
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Customer Reviews</h4>
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
            size="sm"
          >
            {showReviewForm ? 'Cancel' : 'Write Review'}
          </Button>
        </div>
      )}

      {showReviewForm && (
        <div className="p-4 border rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {renderStars(reviewRating, true, setReviewRating)}
            </div>
          </div>
          <Textarea
            placeholder="Share your experience..."
            value={reviewComment}
            onChange={handleReviewCommentChange}
            rows={3}
          />
          <Button 
            onClick={submitReview} 
            disabled={reviewSubmitting}
            className="w-full"
          >
            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {reviews.map((review) => (
            <div key={review.id} className="pb-4 border-b last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{review.buyer?.full_name || 'Anonymous'}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
          {/* Left - Images (2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-gray-50 p-4">
            {product.image_urls && product.image_urls.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.image_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                        <img 
                          src={url} 
                          alt={`${product.name} - ${index + 1}`}
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
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                {product.image_urls && product.image_urls.length > 0 ? (
                  <img 
                    src={product.image_urls[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📷</div>
                      <p>No image available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Product Details (1/3 width on large screens) */}
          <div className="lg:col-span-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{product.condition}</Badge>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ₹{product.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {product.city && product.country 
                        ? `${product.city}, ${product.country}` 
                        : 'Location not specified'
                      }
                    </span>
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
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Action Buttons */}
                <ActionButtons />

                {/* Tabs for Details */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Details</TabsTrigger>
                    <TabsTrigger value="seller">Seller</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-4">
                    {product.description && (
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p 
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(product.description) }}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="seller">
                    <SellerInfo />
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <ReviewsSection />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;