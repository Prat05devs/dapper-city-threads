import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import ProductModal from './ProductModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Product = Tables<'products'>;

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    switch (sortBy) {
      case 'oldest': query = query.order('created_at', { ascending: true }); break;
      case 'price_low': query = query.order('price', { ascending: true }); break;
      case 'price_high': query = query.order('price', { ascending: false }); break;
      default: query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query.limit(24);
    if (data) setProducts(data);
    else console.error('Error fetching products:', error);
    setLoading(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="bg-card border-none rounded-lg overflow-hidden group cursor-pointer"
      onClick={() => handleProductClick(product)}
    >
      <div className="overflow-hidden aspect-[4/5]">
        <img 
          src={product.image_urls?.[0] || '/placeholder.svg'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base truncate">{product.name}</h3>
        <p className="text-muted-foreground mt-1">₹{product.price.toLocaleString()}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
        <div className="w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-24">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductGrid;
