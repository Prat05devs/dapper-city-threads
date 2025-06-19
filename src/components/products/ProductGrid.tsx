
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import ProductModal from './ProductModal';
import ProductFilters, { FilterState } from './ProductFilters';

type Product = Tables<'products'>;

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    condition: '',
    priceRange: [0, 1000],
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply condition filter
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }

      // Apply sorting - featured products first, then by selected sort
      switch (filters.sortBy) {
        case 'oldest':
          query = query.order('is_featured', { ascending: false })
                      .order('created_at', { ascending: true });
          break;
        case 'price_low':
          query = query.order('is_featured', { ascending: false })
                      .order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('is_featured', { ascending: false })
                      .order('price', { ascending: false });
          break;
        case 'most_liked':
          query = query.order('is_featured', { ascending: false })
                      .order('likes_count', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false })
                      .order('created_at', { ascending: false });
      }

      query = query.limit(20);

      const { data, error } = await query;

      if (data && !error) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      condition: '',
      priceRange: [0, 1000],
      sortBy: 'newest',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer hover:shadow-lg transition-shadow duration-300 ${
                  product.is_featured ? 'ring-2 ring-yellow-400 shadow-lg' : ''
                }`}
                onClick={() => handleProductClick(product)}
              >
                {product.is_featured && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900 border-yellow-600">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <div className="aspect-square bg-gray-100 overflow-hidden relative">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <img 
                      src={product.image_urls[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate flex-1">{product.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like functionality
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <Badge variant="secondary">{product.condition}</Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Location</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{product.likes_count} likes</span>
                    </div>
                    <span>{product.category}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default ProductGrid;
