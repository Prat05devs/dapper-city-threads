import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type Product = Tables<'products'>;
type Profile = Tables<'profiles'>;
type SellerReview = Tables<'seller_reviews'> & {
  buyer?: {
    full_name: string | null;
  };
};

export const useProductModal = (product: Product | null, isOpen: boolean) => {
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
      fetchSellerReviews();
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

  return {
    seller,
    reviews,
    isLiked,
    bidAmount,
    setBidAmount,
    bidMessage,
    setBidMessage,
    contactMessage,
    setContactMessage,
    loading,
    paymentLoading,
    reviewSubmitting,
    showReviewForm,
    setShowReviewForm,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    toggleLike,
    placeBid,
    submitReview,
    sendMessage,
    handleBuyNow,
  };
};