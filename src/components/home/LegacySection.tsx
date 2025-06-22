import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LegacySection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image Collage */}
          <div className="relative h-[400px] md:h-[500px]">
             <img 
              src="/placeholder.svg" 
              alt="Sustainable fashion concept" 
              className="absolute top-0 left-0 w-[65%] h-[65%] object-cover rounded-2xl shadow-xl"
            />
            <img 
              src="/placeholder.svg" 
              alt="Hands holding a clothing item" 
              className="absolute bottom-0 right-0 w-[50%] h-[50%] object-cover rounded-2xl shadow-xl border-8 border-background"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-medium">
              Our Vision for a Stylish, Sustainable Future
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe that great style shouldn't come at the cost of our planet. Dapper is founded on the principle of circular fashion—a system where quality garments are kept in use, not sent to landfills. We are creating a community that celebrates conscious consumption and the enduring value of pre-loved clothing.
            </p>
            <Button asChild variant="link" className="p-0 text-base text-primary hover:no-underline">
              <Link to="/about">Learn More &rarr;</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LegacySection; 