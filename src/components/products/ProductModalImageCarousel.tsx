import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

interface ProductModalImageCarouselProps {
  product: Product;
}

const ProductModalImageCarousel: React.FC<ProductModalImageCarouselProps> = ({ product }) => {
  return (
    <div className="lg:col-span-2 bg-gray-50 p-4">
      {product.image_urls && product.image_urls.length > 1 ? (
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {product.image_urls.map((url, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm h-full">
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
  );
};

export default ProductModalImageCarousel;