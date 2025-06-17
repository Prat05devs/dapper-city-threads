
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CitySelector from '@/components/CitySelector';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Vintage Leather Jacket',
      price: '₹2,500',
      originalPrice: '₹8,000',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Delhi'
    },
    {
      id: 2,
      name: 'Designer Silk Dress',
      price: '₹1,800',
      originalPrice: '₹5,500',
      image: '/placeholder.svg',
      condition: 'As New',
      seller: 'Bengaluru'
    },
    {
      id: 3,
      name: 'Classic Denim Jeans',
      price: '₹800',
      originalPrice: '₹3,200',
      image: '/placeholder.svg',
      condition: 'Fair',
      seller: 'Dehradun'
    },
    {
      id: 4,
      name: 'Cotton Summer Top',
      price: '₹450',
      originalPrice: '₹1,500',
      image: '/placeholder.svg',
      condition: 'Good',
      seller: 'Delhi'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      city: 'Delhi',
      comment: 'Found amazing vintage pieces at unbeatable prices. The quality inspection gives me confidence in every purchase.',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      city: 'Bengaluru',
      comment: 'Selling my clothes was so easy! The dashboard helps me track everything, and I love contributing to sustainability.',
      rating: 5
    },
    {
      name: 'Sneha Gupta',
      city: 'Dehradun',
      comment: 'The donation process is seamless. Knowing my clothes help others while reducing waste feels incredible.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CitySelector />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Sustainable Style for the{' '}
              <span className="text-green-600">Conscious Consumer</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover unique fashion pieces that are kind to the planet and your wallet. 
              Join our circular fashion movement across Indian cities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                <Link to="/buy">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                <Link to="/sell">
                  Sell With Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Circular Economy</h3>
              <p className="text-gray-600">We keep clothing in circulation, extending its useful life and reducing landfill waste.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">Each item is carefully inspected to ensure it meets our quality standards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">Connect with conscious consumers in your city and support local sustainability efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover unique pre-loved fashion pieces from verified sellers in your city
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {product.condition}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500">From {product.seller}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link to="/buy">
                View All Items <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-gray-600">Hear from conscious consumers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-none shadow-md">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.city}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Movement?</h2>
          <p className="text-xl mb-8 text-green-100">
            Start your sustainable fashion journey today
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
            <Link to="/signin">
              Create Your Account <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
