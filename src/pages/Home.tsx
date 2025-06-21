
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Shield, Star, Zap, Crown, Sparkles, TrendingUp } from 'lucide-react';
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
      <div className="w-full flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <LocationSelector/>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="/hero.jpg" alt="Fashion background" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 dark:from-black/80 dark:via-black/70 dark:to-black/60" />
        </div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold border-0 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Trending in {city}
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                Hunt for
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Rare Drops
              </span>
              <br />
              <span className="text-white">Close to You</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Discover curated, limited‑edition fashion in your city. 
              <span className="text-purple-300">Sustainable</span>, 
              <span className="text-blue-300"> authentic</span>, 
              <span className="text-indigo-300"> community-powered</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-700 hover:via-purple-600 hover:to-blue-700 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-purple-400/30">
                <Link to="/buy">
                  <TrendingUp className="mr-3 w-6 h-6" />
                  Browse Rare Finds
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-3 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Link to="/sell">
                  <Crown className="mr-3 w-6 h-6" />
                  Sell Your Grails
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Metrics Section */}
      <section className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 border-t-2 border-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-800 pt-12">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">2K+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Items Listed</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">95%</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Verified Authenticity</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">₹50L+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Traded So Far</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center justify-center">
              4.9<Star className="w-6 h-6 text-yellow-400 fill-current ml-1" />
            </div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Seller Rating</div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Listings Section */}
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

      {/* Enhanced Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 text-green-700 dark:text-green-300 px-4 py-2 text-sm font-semibold mb-6 border-0">
              <Recycle className="w-4 h-4 mr-2" />
              Sustainability Mission
            </Badge>
            
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-8">
              Why We Created <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Dapper</span>
            </h2>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 sm:p-12 mb-8 border border-purple-100 dark:border-gray-600 shadow-xl">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium leading-relaxed">
                Fast fashion is the world's second-most polluting industry. At Dapper, we believe clothing shouldn't end up in landfills—it deserves a second life.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-medium">
                We're launching in cities like Delhi, Bengaluru, and Dehradun to reduce textile waste and bring sustainable fashion to everyone.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Recycle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Extend Lifecycle</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Keep clothes in circulation longer</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Affordable Style</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sustainable fashion at great prices</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Build Community</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect conscious fashion lovers</p>
                </div>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to="/about">
                Learn About Our Story
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-8">Ready to Elevate Your Style—or Your Income?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-10 py-4 text-lg font-black rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
              <Link to="/sell">
                <Crown className="mr-3 w-6 h-6" />
                Sell Your Signature Drops
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-3 border-white text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Link to="/buy">
                <Sparkles className="mr-3 w-6 h-6" />
                Explore Rare Finds Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 text-yellow-700 dark:text-yellow-300 px-4 py-2 text-sm font-semibold mb-4 border-0">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Community Love
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">What Our Community Says</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Real reviews from real collectors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl dark:hover:shadow-purple-500/25 transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 testimonial-card group hover:scale-105 rounded-3xl">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed font-medium text-lg">"{testimonial.comment}"</p>
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
