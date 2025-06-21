
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>
      
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
  );
};

export default CTASection;
