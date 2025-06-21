
import React from 'react';
import { Star } from 'lucide-react';

const MetricsSection = () => {
  return (
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
  );
};

export default MetricsSection;
