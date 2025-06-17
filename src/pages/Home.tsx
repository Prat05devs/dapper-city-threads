
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Shield, Star, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CitySelector from '@/components/CitySelector';

const Home = () => {
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
    <div className="min-h-screen bg-white">
      <CitySelector />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-medium">
                <Crown className="w-4 h-4 mr-2" />
                Curated Luxury & Streetwear
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Hunt for{' '}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Rare Drops
              </span>
              <br className="hidden sm:block" />
              <span className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-medium">that others can't find</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              India's most exclusive marketplace for limited edition sneakers, designer watches, 
              rare streetwear, and luxury fashion. Verified authenticity, unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link to="/buy">
                  <Zap className="mr-2 w-5 h-5" />
                  Start Hunting <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full">
                <Link to="/sell">
                  Flip Your Grails
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">2K+</div>
                <div className="text-sm text-gray-600">Rare Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">₹50L+</div>
                <div className="text-sm text-gray-600">Traded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Gen-Z Trusts Dapper</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just another resale app. We're the culture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Authentic</h3>
              <p className="text-gray-600 leading-relaxed">Every piece is verified by our authentication team. No fakes, no stress, just real heat.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sustainable Flex</h3>
              <p className="text-gray-600 leading-relaxed">Rock rare pieces while keeping fashion circular. Good for the planet, better for your wallet.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">Connect with real collectors, sneakerheads, and fashion enthusiasts who share your passion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Today's Heat</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover limited drops and rare finds that you won't see anywhere else
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg hover:scale-105">
                <div className="relative aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} className="bg-black/80 text-white text-xs px-2 py-1 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white text-xs">
                    {product.condition}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-tight">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl font-bold text-purple-600">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">From {product.seller}</p>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs px-3 rounded-full">
                      Cop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-semibold">
              <Link to="/buy">
                View All Heat <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Community Speaks</h2>
            <p className="text-lg text-gray-600">Real reviews from real collectors</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.city}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Level Up Your Style?</h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Join thousands of collectors, sneakerheads, and fashion enthusiasts
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link to="/signin">
              Join the Culture <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
