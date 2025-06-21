
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  city: string;
}

const HeroSection = ({ city }: HeroSectionProps) => {
  return (
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
  );
};

export default HeroSection;
