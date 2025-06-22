import React from 'react';
import ProductGrid from '@/components/products/ProductGrid';

const Buy = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* New Hero Section */}
        <div className="py-24 sm:py-32 text-center">
          <h1 className="text-sm font-semibold text-primary uppercase tracking-widest">Our Collection</h1>
          <p className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Discover Timeless Elegance
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground">
              Explore our curated selection of pre-loved designer pieces, timeless classics, and unique vintage finds. Each item is carefully selected for its quality, style, and story.
            </p>
          </div>
        </div>
        
        <ProductGrid />
        
      </div>
    </div>
  );
};

export default Buy;
