import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoverCard = ({ title, imageUrl, link, align = 'left' }: { title: string; imageUrl: string; link: string; align?: 'left' | 'right' }) => {
  const content = (
    <div className="space-y-4">
      <h3 className="font-serif text-3xl font-medium">{title}</h3>
      <Button asChild variant="outline" className="rounded-full border-primary/50 text-primary hover:bg-primary/5 hover:text-primary">
        <Link to={link}>Explore <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </div>
  );

  const image = <img src={imageUrl} alt={title} className="w-full h-auto object-cover rounded-2xl aspect-[4/5]" />;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {align === 'left' ? (
        <>
          {content}
          {image}
        </>
      ) : (
        <>
          <div className="hidden md:block">{image}</div>
          <div className="text-right">{content}</div>
          <div className="md:hidden">{image}</div>
        </>
      )}
    </div>
  );
};

const DiscoverCollectionSection = () => {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-24">
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-center">Discover Our Collection</h2>
        <div className="mt-16 space-y-24">
          <DiscoverCard 
            title="Vintage Finds for the Bold" 
            imageUrl="/placeholder.svg"
            link="/buy?category=vintage"
            align="left"
          />
          <DiscoverCard 
            title="Premium Designer Steals" 
            imageUrl="/placeholder.svg"
            link="/buy?category=designer"
            align="right"
          />
           <DiscoverCard 
            title="Curated Streetwear Staples" 
            imageUrl="/placeholder.svg"
            link="/buy?category=streetwear"
            align="left"
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoverCollectionSection; 