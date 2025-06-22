import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const featuredProducts = [
  {
    id: 1,
    name: 'Off-White x Nike Air Jordan 1',
    price: '₹45,000',
    image: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'Supreme Box Logo Hoodie',
    price: '₹28,000',
    image: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Rolex Submariner Vintage',
    price: '₹2,50,000',
    image: '/placeholder.svg',
  },
  {
    id: 4,
    name: 'Travis Scott x Fragment Jordan 1',
    price: '₹65,000',
    image: '/placeholder.svg',
  }
];

const FeaturedProductsSection = () => {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12">
          <div className="relative inline-block">
            <span className="absolute -top-4 -left-4 font-serif text-2xl text-muted-foreground opacity-50">(02)</span>
            <h2 className="font-serif text-5xl md:text-6xl font-black tracking-tighter">
              Featured Items
            </h2>
            <div className="absolute -bottom-2 left-0 w-2/3 h-1 bg-primary"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="bg-transparent border-0 shadow-none rounded-none group">
              <div className="overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-4 bg-transparent text-center">
                <h3 className="font-serif text-xl font-bold text-primary mb-2">{product.name}</h3>
                <p className="font-sans text-lg text-muted-foreground">{product.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="rounded-none font-semibold text-lg px-8 py-6 border-2 border-primary group">
            <Link to="/buy">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
