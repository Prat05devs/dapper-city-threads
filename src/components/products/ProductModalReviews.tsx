import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';
import { renderStars } from './product-modal-utils';

type Product = Tables<'products'>;
type SellerReview = Tables<'seller_reviews'> & {
  buyer?: {
    full_name: string | null;
  };
};

interface ProductModalReviewsProps {
  product: Product;
  user: User | null;
  reviews: SellerReview[];
  showReviewForm: boolean;
  setShowReviewForm: (show: boolean) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  reviewSubmitting: boolean;
  onSubmitReview: () => void;
}

const ProductModalReviews: React.FC<ProductModalReviewsProps> = ({
  product,
  user,
  reviews,
  showReviewForm,
  setShowReviewForm,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  reviewSubmitting,
  onSubmitReview,
}) => {
  return (
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
            onChange={(e) => setReviewComment(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={onSubmitReview} 
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
        <div className="space-y-4 max-h-60 overflow-y-auto">
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
};

export default ProductModalReviews;