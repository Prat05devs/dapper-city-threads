import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, DollarSign, MessageSquare, Send } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';

type Product = Tables<'products'>;

interface ProductModalActionsProps {
  product: Product;
  user: User | null;
  bidAmount: string;
  setBidAmount: (amount: string) => void;
  bidMessage: string;
  setBidMessage: (message: string) => void;
  contactMessage: string;
  setContactMessage: (message: string) => void;
  loading: boolean;
  paymentLoading: boolean;
  onPlaceBid: () => void;
  onSendMessage: () => void;
  onBuyNow: () => void;
}

const ProductModalActions: React.FC<ProductModalActionsProps> = ({
  product,
  user,
  bidAmount,
  setBidAmount,
  bidMessage,
  setBidMessage,
  contactMessage,
  setContactMessage,
  loading,
  paymentLoading,
  onPlaceBid,
  onSendMessage,
  onBuyNow,
}) => {
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
      {/* Buy Now Button */}
      <Button 
        onClick={onBuyNow} 
        disabled={paymentLoading} 
        className="w-full"
        size="lg"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {paymentLoading ? 'Processing...' : `Buy Now - ₹${product.price.toLocaleString()}`}
      </Button>

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
            onChange={(e) => setBidAmount(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={onPlaceBid} 
            disabled={loading || !bidAmount} 
            variant="outline"
          >
            {loading ? 'Placing...' : 'Offer'}
          </Button>
        </div>
        <Textarea
          placeholder="Optional message to seller"
          value={bidMessage}
          onChange={(e) => setBidMessage(e.target.value)}
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
            onChange={(e) => setContactMessage(e.target.value)}
            rows={2}
            className="flex-1"
          />
          <Button 
            onClick={onSendMessage} 
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

export default ProductModalActions;