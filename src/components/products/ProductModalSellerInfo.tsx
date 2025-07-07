import React from 'react';
import { User } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { renderStars } from './product-modal-utils';

type Profile = Tables<'profiles'>;

interface ProductModalSellerInfoProps {
  seller: Profile | null;
}

const ProductModalSellerInfo: React.FC<ProductModalSellerInfoProps> = ({ seller }) => {
  return (
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
};

export default ProductModalSellerInfo;