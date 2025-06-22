
import React, { useState } from 'react';
import LocationButton from '@/components/LocationButton';
import HeroSection from '@/components/home/HeroSection';
import MetricsSection from '@/components/home/MetricsSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import MissionSection from '@/components/home/MissionSection';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Home = () => {
  // State for location selector
  const [country, setCountry] = useState('IN');
  const [city, setCity] = useState('Delhi');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Floating Location Button */}
      <div className="fixed top-20 left-4 z-50">
        <LocationButton
          country={country}
          city={city}
          onCountryChange={setCountry}
          onCityChange={setCity}
        />
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
