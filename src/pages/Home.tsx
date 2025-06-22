import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import MetricsSection from '@/components/home/MetricsSection';
import DiscoverCollectionSection from '@/components/home/DiscoverCollectionSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import LegacySection from '@/components/home/LegacySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
// import LegacySection from '@/components/home/LegacySection';
// import TestimonialsSection from '@/components/home/TestimonialsSection';

const Home = () => {
  return (
    <div className="bg-background text-foreground">
      <HeroSection />
      <MetricsSection />
      <DiscoverCollectionSection />
      <NewArrivalsSection />
      <LegacySection />
      <TestimonialsSection />
      {/* 
        The following components need to be created or updated:
        <LegacySection />
        <TestimonialsSection />
      */}
    </div>
  );
};

export default Home;
