
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FeaturedProductsSectionProps {
  city: string;
}

const featuredProducts = [
  {
    id: 1,
    name: 'Off-White x Nike Air Jordan 1',
    price: '₹45,000',
    originalPrice: '₹85,000',
    image: '/placeholder.svg',
    condition: 'Good',
    seller: 'Delhi',
    tags: ['Limited Edition', 'Verified', 'Rare Find'],
    discount: '47%'
  },
  {
    id: 2,
    name: 'Supreme Box Logo Hoodie',
    price: '₹28,000',
    originalPrice: '₹55,000',
    image: '/placeholder.svg',
    condition: 'As New',
    seller: 'Bengaluru',
    tags: ['Supreme', 'Verified', 'Streetwear'],
    discount: '49%'
  },
  {
    id: 3,
    name: 'Rolex Submariner Vintage',
    price: '₹2,50,000',
    originalPrice: '₹4,50,000',
    image: '/placeholder.svg',
    condition: 'Good',
    seller: 'Mumbai',
    tags: ['Luxury', 'Verified', 'Vintage'],
    discount: '44%'
  },
  {
    id: 4,
    name: 'Travis Scott x Fragment Jordan 1',
    price: '₹65,000',
    originalPrice: '₹1,20,000',
    image: '/placeholder.svg',
    condition: 'As New',
    seller: 'Delhi',
    tags: ['Limited Edition', 'Collab', 'Rare Find'],
    discount: '46%'
  }
];

const FeaturedProductsSection = ({ city }: FeaturedProductsSectionProps) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 px-4 py-2 text-sm font-semibold mb-4 border-0">
            <Zap className="w-4 h-4 mr-2" />
            Hot Drops
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Featured in <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{city}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            Handpicked and promoted—these are the hottest drops locally.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-3xl dark:hover:shadow-purple-500/25 transition-all duration-500 cursor-pointer border-0 shadow-xl hover:scale-105 card-dark bg-white dark:bg-gray-800 overflow-hidden">
              <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Discount badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 shadow-lg">
                    -{product.discount}
                  </Badge>
                </div>
                
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Badge className="bg-green-500 dark:bg-green-400 text-white text-xs font-semibold px-2 py-1">
                    {product.condition}
                  </Badge>
                </div>
                
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} className="bg-black/80 dark:bg-purple-600/80 text-white text-xs px-2 py-1 backdrop-blur-sm font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm leading-tight line-clamp-2">{product.name}</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{product.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">{product.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">From {product.seller}</p>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-400 dark:hover:to-blue-400 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Cop Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 dark:bg-transparent">
            <Link to="/buy">
              View All Heat
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
