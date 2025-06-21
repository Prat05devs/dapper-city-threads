
import React, { useState } from 'react';
import LocationSelector from '@/components/LocationSelector';
import HeroSection from '@/components/home/HeroSection';
import MetricsSection from '@/components/home/MetricsSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import MissionSection from '@/components/home/MissionSection';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Location Selector Section */}
      <div className="w-full flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-b border-purple-100 dark:border-gray-600 transition-colors duration-300">
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <LocationSelector/>
        </div>
      </div>

      <HeroSection city={city} />
      <MetricsSection />
      <FeaturedProductsSection city={city} />
      <MissionSection />
      <CTASection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
