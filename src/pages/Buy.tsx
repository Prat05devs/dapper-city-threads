
import React, { useState } from 'react';
import { Search, Filter, Heart, Star, Crown, Zap } from 'lucide-react';
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
      name: 'Off-White x Nike Air Jordan 1 Retro High',
      price: '₹45,000',
      originalPrice: '₹85,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Rahul K.',
      city: 'Delhi',
      category: 'sneakers',
      likes: 156,
      tags: ['Limited Edition', 'Verified', 'Off-White'],
      rarity: 'Ultra Rare',
      authentication: 'Verified'
    },
    {
      id: 2,
      name: 'Supreme Box Logo Hoodie FW20',
      price: '₹28,000',
      originalPrice: '₹55,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Priya M.',
      city: 'Bengaluru',
      category: 'streetwear',
      likes: 89,
      tags: ['Supreme', 'Verified', 'Streetwear'],
      rarity: 'Rare',
      authentication: 'Verified'
    },
    {
      id: 3,
      name: 'Rolex Submariner Date (Vintage 1991)',
      price: '₹2,50,000',
      originalPrice: '₹4,50,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Amit S.',
      city: 'Mumbai',
      category: 'watches',
      likes: 234,
      tags: ['Luxury', 'Verified', 'Vintage'],
      rarity: 'Ultra Rare',
      authentication: 'Expert Verified'
    },
    {
      id: 4,
      name: 'Travis Scott x Fragment Jordan 1 Low',
      price: '₹65,000',
      originalPrice: '₹1,20,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Sneha G.',
      city: 'Delhi',
      category: 'sneakers',
      likes: 312,
      tags: ['Travis Scott', 'Fragment', 'Collab'],
      rarity: 'Ultra Rare',
      authentication: 'Verified'
    },
    {
      id: 5,
      name: 'Bape x Adidas Superstar Black',
      price: '₹18,000',
      originalPrice: '₹35,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Karan P.',
      city: 'Dehradun',
      category: 'sneakers',
      likes: 67,
      tags: ['Bape', 'Adidas', 'Collab'],
      rarity: 'Rare',
      authentication: 'Verified'
    },
    {
      id: 6,
      name: 'Chrome Hearts Cross Ring',
      price: '₹45,000',
      originalPrice: '₹85,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Meera J.',
      city: 'Bengaluru',
      category: 'accessories',
      likes: 143,
      tags: ['Chrome Hearts', 'Luxury', 'Silver'],
      rarity: 'Rare',
      authentication: 'Expert Verified'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Ultra Rare': return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'Rare': return 'bg-gradient-to-r from-blue-600 to-indigo-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Rare Finds & Heat</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover authenticated luxury pieces and limited drops from verified sellers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search rare items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sneakers">Sneakers</SelectItem>
                <SelectItem value="streetwear">Streetwear</SelectItem>
                <SelectItem value="watches">Luxury Watches</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="bags">Designer Bags</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-10k">Under ₹10,000</SelectItem>
                <SelectItem value="10k-50k">₹10,000 - ₹50,000</SelectItem>
                <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                <SelectItem value="above-100k">Above ₹1,00,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select>
              <SelectTrigger className="rounded-xl border-gray-200">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="newest">Newest Drops</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rarity">Rarity Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105 bg-white">
              <div className="relative aspect-square bg-gray-100 rounded-t-2xl overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 p-0"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                
                {/* Rarity Badge */}
                <Badge className={`absolute top-3 left-3 text-white text-xs px-3 py-1 ${getRarityColor(product.rarity)} border-0`}>
                  <Crown className="w-3 h-3 mr-1" />
                  {product.rarity}
                </Badge>
                
                {/* Authentication Badge */}
                <Badge className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  {product.authentication}
                </Badge>
                
                {/* Condition Badge */}
                <Badge className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs px-2 py-1">
                  {product.condition}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 border-purple-200 text-purple-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight line-clamp-2">{product.name}</h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{product.price}</span>
                  <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>By {product.seller}</span>
                  <span>{product.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Heart className="w-3 h-3 fill-current text-red-400" />
                    <span>{product.likes}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-4 rounded-full">
                    Cop Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold">
            Load More Heat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
