import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight">
              Premium Thrift. Reimagined for 2025.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Dapper is the future of second-hand style. We're building the ultimate platform for curated, high-quality thrifted fashion, dedicated to the next generation of conscious consumers.
            </p>
            <div className="flex items-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6">
                <Link to="/buy">Explore Now</Link>
              </Button>
              <Button variant="ghost" size="lg" className="rounded-full">
                <PlayCircle className="mr-2 h-5 w-5" />
                Our Vision
              </Button>
            </div>
          </div>
          
          {/* Image Collage */}
          <div className="relative h-[500px] hidden lg:block">
            <img 
              src="/placeholder.svg" 
              alt="Stylish person wearing thrifted fashion" 
              className="absolute top-0 left-0 w-[60%] h-[70%] object-cover rounded-2xl shadow-xl"
            />
            <img 
              src="/placeholder.svg" 
              alt="Close-up of a premium clothing item" 
              className="absolute bottom-0 right-0 w-[55%] h-[55%] object-cover rounded-2xl shadow-xl border-8 border-background"
            />
             <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-secondary/50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
