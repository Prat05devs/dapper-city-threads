
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MissionSection = () => {
  return (
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
  );
};

export default MissionSection;
