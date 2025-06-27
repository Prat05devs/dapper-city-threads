import React from 'react';
import ProductGrid from '@/components/products/ProductGrid';

const Buy = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* New Hero Section */}
<div className="relative py-24 sm:py-32 text-center overflow-hidden rounded-2xl mb-8">
  {/* Video background */}
  <video
    className="absolute inset-0 w-full h-full object-cover z-0"
    src="/buy-hero.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-black/60 z-0" />
  <div className="relative z-10">
    <h1 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest">
      Our Collection
    </h1>
    <p className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
      Discover Timeless Elegance
    </p>
    <div className="mt-8 max-w-2xl mx-auto">
      <p className="text-lg text-white/90 dark:text-muted-foreground">
        Explore our curated selection of pre-loved designer pieces, timeless classics, and unique vintage finds. Each item is carefully selected for its quality, style, and story.
      </p>
    </div>
    </div>
  </div>

        
        <ProductGrid />
        
      </div>
    </div>
  );
};

export default Buy;
