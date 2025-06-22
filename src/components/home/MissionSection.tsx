import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const MissionSection = () => {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] lg:h-[600px] group">
            <img 
              src="/MissionSection.jpg" 
              alt="Our Mission" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary opacity-10 group-hover:opacity-0 transition-opacity"></div>
            <div className="absolute -bottom-4 -left-4 border-[16px] border-background w-1/3 h-1/3"></div>
            <div className="absolute -top-4 -right-4 border-[16px] border-background w-1/3 h-1/3"></div>
          </div>
          <div className="space-y-8">
            <div className="relative">
              <span className="absolute -top-4 -left-4 font-serif text-2xl text-muted-foreground opacity-50">(03)</span>
              <h2 className="font-serif text-5xl md:text-6xl font-black tracking-tighter">
                Our Mission
              </h2>
              <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary"></div>
            </div>

            <p className="text-lg md:text-xl max-w-lg text-muted-foreground leading-relaxed">
              Fast fashion is the world's second-most polluting industry. At Dapper, we believe clothing shouldn't end up in landfills—it deserves a second life. We're launching in cities to reduce textile waste and bring sustainable fashion to everyone.
            </p>
            
            <Button asChild size="lg" variant="outline" className="rounded-none font-semibold text-lg px-8 py-6 border-2 border-primary group">
              <Link to="/about">
                Learn Our Story
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
