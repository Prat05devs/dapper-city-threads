import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { sanitizeHTML } from '@/lib/sanitize';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useProductModal } from '@/hooks/use-product-modal';
import ProductModalImageCarousel from './ProductModalImageCarousel';
import ProductModalActions from './ProductModalActions';
import ProductModalSellerInfo from './ProductModalSellerInfo';
import ProductModalReviews from './ProductModalReviews';

type Product = Tables<'products'>;

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { user } = useAuth();
  const {
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
  } = useProductModal(product, isOpen);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[90vh]">
          {/* Left - Images (2/3 width on large screens) */}
          <ProductModalImageCarousel product={product} />

          {/* Right - Product Details (1/3 width on large screens) */}
          <div className="lg:col-span-1 flex flex-col h-full">
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
                <ProductModalActions
                  product={product}
                  user={user}
                  bidAmount={bidAmount}
                  setBidAmount={setBidAmount}
                  bidMessage={bidMessage}
                  setBidMessage={setBidMessage}
                  contactMessage={contactMessage}
                  setContactMessage={setContactMessage}
                  loading={loading}
                  paymentLoading={paymentLoading}
                  onPlaceBid={placeBid}
                  onSendMessage={sendMessage}
                  onBuyNow={handleBuyNow}
                />

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
                    <ProductModalSellerInfo seller={seller} />
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <ProductModalReviews
                      product={product}
                      user={user}
                      reviews={reviews}
                      showReviewForm={showReviewForm}
                      setShowReviewForm={setShowReviewForm}
                      reviewRating={reviewRating}
                      setReviewRating={setReviewRating}
                      reviewComment={reviewComment}
                      setReviewComment={setReviewComment}
                      reviewSubmitting={reviewSubmitting}
                      onSubmitReview={submitReview}
                    />
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