import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

type Product = Tables<'products'>;

const NewArrivalsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (data) setProducts(data);
      if (error) console.error("Error fetching new arrivals:", error);
      setLoading(false);
    };
    fetchNewArrivals();
  }, []);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="bg-white rounded-lg overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <img src={product.image_urls?.[0] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-white/50 rounded-full hover:bg-white">
          <Heart className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base truncate text-gray-800">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
          <Button size="icon" variant="ghost">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium">Freshly Curated</h2>
            <p className="mt-2 opacity-80 max-w-lg">
              Hand-picked daily, our new arrivals feature unique vintage and premium designer pieces. Your next favorite outfit is waiting to be discovered.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex items-center gap-2 hover:bg-white/10">
            <ArrowRight className="h-5 w-5"/>
            <ArrowRight className="h-5 w-5 -ml-3"/>
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection; 