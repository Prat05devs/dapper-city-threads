import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-black tracking-tighter mb-8">
          Ready to Start?
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground mb-12">
          Whether you're looking to refresh your wardrobe with unique pieces or declutter and earn, Dapper City Threads is your new destination.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-none font-semibold text-lg px-8 py-6 group">
            <Link to="/buy">
              Shop The Collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-none font-semibold text-lg px-8 py-6 border-2 border-primary group">
            <Link to="/sell">
              Sell Your Items
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
