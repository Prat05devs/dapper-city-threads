import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Shield, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LocationSelector from '@/components/LocationSelector';

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'UK', name: 'UK', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'UAE', name: 'UAE', flag: '🇦🇪' },
];

const Home = () => {
  // State for location selector
  const [country, setCountry] = useState('IN');
  const [city, setCity] = useState('Delhi');
  const countryObj = countries.find((c) => c.code === country);

  const featuredProducts = [
    {
      id: 1,
      name: 'Off-White x Nike Air Jordan 1',
      price: '₹45,000',
      originalPrice: '₹85,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Delhi',
      tags: ['Limited Edition', 'Verified', 'Rare Find']
    },
    {
      id: 2,
      name: 'Supreme Box Logo Hoodie',
      price: '₹28,000',
      originalPrice: '₹55,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Bengaluru',
      tags: ['Supreme', 'Verified', 'Streetwear']
    },
    {
      id: 3,
      name: 'Rolex Submariner Vintage',
      price: '₹2,50,000',
      originalPrice: '₹4,50,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Mumbai',
      tags: ['Luxury', 'Verified', 'Vintage']
    },
    {
      id: 4,
      name: 'Travis Scott x Fragment Jordan 1',
      price: '₹65,000',
      originalPrice: '₹1,20,000',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Delhi',
      tags: ['Limited Edition', 'Collab', 'Rare Find']
    }
  ];

  const testimonials = [
    {
      name: 'Arjun Sharma',
      city: 'Delhi',
      comment: 'Finally found the Travis Scott Jordans I was hunting for months! Authentic and way below market price. Dapper is a goldmine for sneakerheads.',
      rating: 5,
      avatar: '👨‍🎓'
    },
    {
      name: 'Priya Patel',
      city: 'Bengaluru',
      comment: 'Sold my old Supreme collection and bought a Cartier watch - all verified and legit. The community here actually knows their stuff.',
      rating: 5,
      avatar: '👩‍🎨'
    },
    {
      name: 'Karan Singh',
      city: 'Dehradun',
      comment: 'Best place to flip limited drops and rare finds. Made ₹50k last month selling sneakers I copped for retail. This platform is fire! 🔥',
      rating: 5,
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Location Selector Section */}
      <div className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <LocationSelector/>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="/hero.jpg" alt="Fashion background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
              Hunt for Rare Drops Close to You
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow">
              Discover curated, limited‑edition fashion in your city. Sustainable, authentic, community-powered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link to="/buy">
                  Browse Rare Finds <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full">
                <Link to="/sell">
                  Sell Your Grails
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="container mx-auto px-4 pt-8 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">2K+ Items Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">95% Verified Authenticity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">₹50L+ Traded So Far</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">4.9★ Seller Rating</div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured in {city}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Handpicked and promoted—these are the hottest drops locally.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105 card-dark">
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-xl overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} className="bg-black/80 dark:bg-purple-600/80 text-white text-xs px-2 py-1 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge className="absolute top-3 right-3 bg-green-500 dark:bg-green-400 text-white text-xs">
                    {product.condition}
                  </Badge>
                </div>
                <CardContent className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm leading-tight">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">{product.price}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">From {product.seller}</p>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-400 dark:hover:to-blue-400 text-white text-xs px-3 rounded-full btn-neon">
                      Cop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-8 py-3 rounded-full font-semibold dark:bg-transparent">
              <Link to="/buy">
                View All Heat <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About / Mission Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why We Created Dapper</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Fast fashion is the world's second-most polluting industry. At Dapper, we believe clothing shouldn't end up in landfills—it deserves a second life.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              We're launching in cities like Delhi, Bengaluru, and Dehradun to reduce textile waste and bring sustainable fashion to everyone.
            </p>
            <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
              <li>Extend clothing lifecycle</li>
              <li>Offer sustainable style at affordable prices</li>
              <li>Build conscious communities across Indian cities</li>
            </ul>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/about">
                Learn About Our Story <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mid-page Conversion Callout */}
      <section className="py-10 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Ready to Elevate Your Style—or Your Income?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/sell">
                Sell Your Signature Drops
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-full">
              <Link to="/buy">
                Explore Rare Finds Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Community Speaks</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Real reviews from real collectors</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl dark:hover:shadow-purple-500/20 transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 testimonial-card">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;