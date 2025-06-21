import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import ProductModal from './ProductModal';
import ProductFilters, { FilterState } from './ProductFilters';
import CitySelector from '../geography/CitySelector';

type Product = Tables<'products'>;

const ProductGrid: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    condition: '',
    priceRange: [0, 500000],
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchProducts();
    // Auto-run debug checks on mount
    debugCheckAllProducts();
    debugTestConnection();
  }, [filters, selectedCity]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log('🔍 Starting product fetch...');
      console.log('🔍 Current filters:', filters);
      console.log('🔍 Selected city:', selectedCity);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          seller:profiles!inner(
            full_name,
            city,
            average_rating,
            total_ratings
          )
        `)
        .or('status.eq.active,status.is.null');

      // Apply city filter
      if (selectedCity) {
        query = query.eq('seller.city', selectedCity);
        console.log('🏙️ Applied city filter:', selectedCity);
      }
      
      console.log('🔍 Base query created');

      // Apply search filter
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        console.log('🔍 Applied search filter:', filters.search);
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
        console.log('🔍 Applied category filter:', filters.category);
      }

      // Apply condition filter
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
        console.log('🔍 Applied condition filter:', filters.condition);
      }

      // Apply price range filter
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      console.log('🔍 Applied price range filter:', filters.priceRange);

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
      console.log('🔍 Final query prepared, executing...');

      const { data, error } = await query;

      console.log('🔍 Query result:', { 
        data: data?.length || 0, 
        error: error?.message || 'No error',
        firstProduct: data?.[0] ? {
          id: data[0].id,
          name: data[0].name,
          status: data[0].status,
          seller_id: data[0].seller_id
        } : 'No products'
      });

      if (data && !error) {
        console.log('✅ Products fetched successfully:', data.length);
        setProducts(data);
      } else {
        console.error('❌ Error fetching products:', error);
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Exception in fetchProducts:', error);
      setProducts([]);
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
      priceRange: [0, 500000],
      sortBy: 'newest',
    });
    setSelectedCity('');
  };

  // Debug function to create a sample product
  const createSampleProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: 'Sample Product',
          description: 'This is a sample product for testing',
          price: 1000,
          category: 'Clothing',
          condition: 'Good',
          seller_id: '00000000-0000-0000-0000-000000000000', // This will need a real user ID
          image_urls: ['https://via.placeholder.com/400x400?text=Sample+Product'],
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating sample product:', error);
      } else {
        console.log('Sample product created:', data);
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating sample product:', error);
    }
  };

  const handleLike = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!user) {
      // Show sign in prompt
      return;
    }
    
    // TODO: Implement like functionality
    console.log('Like functionality to be implemented');
  };

  // Debug function to check all products in database
  const debugCheckAllProducts = async () => {
    try {
      console.log('🔍 Checking all products in database...');
      
      // Query without any filters
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(50);

      console.log('🔍 All products query result:', {
        count: data?.length || 0,
        error: error?.message || 'No error',
        products: data?.map(p => ({
          id: p.id,
          name: p.name,
          status: p.status,
          seller_id: p.seller_id,
          created_at: p.created_at
        })) || []
      });

      // Also check profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .limit(10);

      console.log('🔍 Profiles query result:', {
        count: profiles?.length || 0,
        error: profilesError?.message || 'No error',
        profiles: profiles || []
      });

    } catch (error) {
      console.error('❌ Error in debug check:', error);
    }
  };

  // Debug function to test RLS policies
  const debugTestRLS = async () => {
    try {
      console.log('🔍 Testing RLS policies...');
      
      // Test with different query approaches
      const queries = [
        { name: 'Simple select', query: supabase.from('products').select('*').limit(5) },
        { name: 'With status filter', query: supabase.from('products').select('*').eq('status', 'active').limit(5) },
        { name: 'With null status', query: supabase.from('products').select('*').is('status', null).limit(5) },
        { name: 'With OR condition', query: supabase.from('products').select('*').or('status.eq.active,status.is.null').limit(5) }
      ];

      for (const { name, query } of queries) {
        const { data, error } = await query;
        console.log(`🔍 ${name}:`, {
          count: data?.length || 0,
          error: error?.message || 'No error'
        });
      }

    } catch (error) {
      console.error('❌ Error in RLS test:', error);
    }
  };

  // Debug function to test Supabase connection
  const debugTestConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1);

      console.log('🔍 Connection test result:', {
        success: !error,
        error: error?.message || 'No error',
        data: data
      });

      // Test auth status
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 Auth status:', {
        authenticated: !!user,
        userId: user?.id || 'Not authenticated'
      });

    } catch (error) {
      console.error('❌ Connection test error:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            className="w-full sm:w-auto"
          />
        </div>
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
        {/* City Selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <CitySelector
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            className="w-full sm:w-auto"
          />
          {selectedCity && (
            <div className="text-sm text-gray-600">
              Showing products in {selectedCity}
            </div>
          )}
        </div>

        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {loading ? 'Loading products...' : 'No products match your current filters. Try adjusting your search criteria or check back later for new listings.'}
              </p>
              <div className="space-y-3">
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear all filters
                </Button>
                <Button onClick={() => fetchProducts()} variant="outline" className="w-full">
                  Refresh Products (Debug)
                </Button>
                <Button onClick={createSampleProduct} variant="outline" className="w-full">
                  Create Sample Product (Debug)
                </Button>
                <Button onClick={debugCheckAllProducts} variant="outline" className="w-full">
                  Check All Products (Debug)
                </Button>
                <Button onClick={debugTestRLS} variant="outline" className="w-full">
                  Test RLS Policies (Debug)
                </Button>
                <Button onClick={debugTestConnection} variant="outline" className="w-full">
                  Test Supabase Connection (Debug)
                </Button>
                <p className="text-sm text-gray-500">
                  Debug: {products.length} products loaded
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  product.is_featured ? 'ring-2 ring-yellow-400 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50' : ''
                }`}
                onClick={() => handleProductClick(product)}
              >
                {product.is_featured && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <div className="aspect-square bg-gray-100 overflow-hidden relative rounded-t-lg">
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
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base sm:text-lg truncate flex-1 pr-2">{product.name}</h3>
                    {user && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                        onClick={(e) => handleLike(e, product)}
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-green-600">₹{product.price?.toLocaleString() || '0'}</span>
                    <Badge variant="secondary" className="text-xs">{product.condition || 'Unknown'}</Badge>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {(product as any).seller?.city || 'Location not specified'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      <span>{product.likes_count || 0} likes</span>
                    </div>
                    <span className="text-xs truncate">{product.category || 'Uncategorized'}</span>
                  </div>
                  
                  {/* Debug info - remove in production */}
                  <div className="mt-2 text-xs text-gray-400">
                    Status: {product.status || 'none'} | ID: {product.id.slice(0, 8)}...
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
