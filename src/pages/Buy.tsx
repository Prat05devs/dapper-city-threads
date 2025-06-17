
import React, { useState } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Buy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Vintage Leather Jacket',
      price: '₹2,500',
      originalPrice: '₹8,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Rahul K.',
      city: 'Delhi',
      category: 'jackets',
      likes: 24
    },
    {
      id: 2,
      name: 'Designer Silk Dress',
      price: '₹1,800',
      originalPrice: '₹5,500',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Priya M.',
      city: 'Bengaluru',
      category: 'dresses',
      likes: 18
    },
    {
      id: 3,
      name: 'Classic Denim Jeans',
      price: '₹800',
      originalPrice: '₹3,200',
      image: '/placeholder.svg',
      condition: 'Fair',
      seller: 'Amit S.',
      city: 'Dehradun',
      category: 'jeans',
      likes: 12
    },
    {
      id: 4,
      name: 'Cotton Summer Top',
      price: '₹450',
      originalPrice: '₹1,500',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Sneha G.',
      city: 'Delhi',
      category: 'tops',
      likes: 15
    },
    {
      id: 5,
      name: 'Formal Blazer',
      price: '₹1,200',
      originalPrice: '₹4,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Karan P.',
      city: 'Bengaluru',
      category: 'blazers',
      likes: 9
    },
    {
      id: 6,
      name: 'Ethnic Kurta',
      price: '₹600',
      originalPrice: '₹2,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Meera J.',
      city: 'Delhi',
      category: 'ethnic',
      likes: 21
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buy Pre-Loved Fashion</h1>
          <p className="text-gray-600">Discover unique pieces from verified sellers in your city</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="jackets">Jackets</SelectItem>
                <SelectItem value="dresses">Dresses</SelectItem>
                <SelectItem value="jeans">Jeans</SelectItem>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="blazers">Blazers</SelectItem>
                <SelectItem value="ethnic">Ethnic Wear</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-500">Under ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                <SelectItem value="above-2000">Above ₹2,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                  {product.condition}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-green-600">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>By {product.seller}</span>
                  <span>{product.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Heart className="w-3 h-3" />
                    <span>{product.likes}</span>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
            Load More Items
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
