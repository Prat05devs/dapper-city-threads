
import React from 'react';
import ProductGrid from '@/components/products/ProductGrid';

const Buy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Shop Sustainable Fashion
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover unique, pre-loved fashion pieces and give them a new life while reducing environmental impact.
          </p>
          <div className="text-lg opacity-90">
            Browse all available items • Make offers • Connect with sellers
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Available Items</h2>
            <p className="text-gray-600">
              All products are available for viewing. Sign in to place bids, contact sellers, and leave reviews.
            </p>
          </div>
        </div>
        
        <ProductGrid />
      </div>
    </div>
  );
};

export default Buy;
