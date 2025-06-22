import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    { num: '01', name: 'Quality Curation' },
    { num: '02', name: 'Authenticity Guaranteed' },
    { num: '03', name: 'Community Trust' },
    { num: '04', name: 'Sustainable Impact' },
    { num: '05', name: 'Conscious Consumption' },
    { num: '06', name: 'Empowering Sellers' },
  ];

  const designers = [
    { name: 'Prateek Thapliyal', role: 'Founder & CEO', image: '/Founder.jpeg' },
    { name: 'Jane Doe', role: 'Head of Curation', image: '/placeholder.svg' },
    { name: 'John Smith', role: 'Lead Developer', image: '/placeholder.svg' },
  ];

  return (
    <div className="bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">MEET DAPPER</h1>
            <p className="text-muted-foreground text-lg max-w-md">
              At Dapper, we see a world where fashion is circular. Our platform connects discerning individuals who appreciate style and sustainability, creating a community where every piece has a past and a future.
            </p>
          </div>
          <p className="text-muted-foreground">
            We are dedicated to more than just commerce. We're building a movement that celebrates conscious consumption and the timeless appeal of well-made clothing.
          </p>
        </div>
        <img src="/placeholder.svg" alt="Team at Dapper" className="mt-16 w-full h-[500px] object-cover rounded-2xl" />
      </section>

      {/* Inside Dapper Section */}
      <section className="container mx-auto px-4 pb-24 sm:pb-32">
        <div className="grid md:grid-cols-3 gap-12">
          <h2 className="text-lg font-semibold uppercase tracking-widest">INSIDE DAPPER</h2>
          <div className="md:col-span-2 space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground max-w-2xl">We seek to close the loop on fashion by creating a trusted ecosystem for pre-loved clothing. Our vision is to empower individuals to make sustainable choices without sacrificing style, turning every wardrobe into a source of endless possibility and minimal waste.</p>
            </div>
             <div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground max-w-2xl">We are dedicated to curating the finest pre-loved garments and making them accessible to a global community. Through a seamless digital experience and a commitment to authenticity, we aim to redefine the second-hand market as the first choice for the conscious consumer.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Design & Soul Section */}
      <section className="bg-secondary/50 py-24 sm:py-32">
        <div className="container mx-auto px-4">
           <h2 className="text-7xl md:text-9xl font-bold tracking-tighter">STYLE • SUSTAINABILITY</h2>
           <div className="grid md:grid-cols-2 gap-12 items-start mt-16">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold uppercase tracking-widest">OUR VALUES</h3>
                <p className="text-muted-foreground max-w-md">Rooted in the belief that great style and a healthy planet can coexist, our values guide every decision we make.</p>
                <img src="/placeholder.svg" alt="Curated clothing item" className="w-full h-auto object-cover rounded-2xl pt-8" />
              </div>
              <div>
                {values.map(value => (
                  <div key={value.num} className="flex items-center justify-between border-b border-border py-6">
                    <p className="text-2xl font-semibold">{value.name}</p>
                    <span className="text-lg text-muted-foreground">{value.num}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Designers Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <h2 className="text-lg font-semibold uppercase tracking-widest">THE TEAM BEHIND THE VISION</h2>
          <div className="md:col-span-2 space-y-4">
            <p className="text-2xl font-semibold">Each member of our team brings a unique perspective, bound by a shared passion for thoughtful curation and timeless quality. Together, we shape a space that feels personal, purposeful, and beautifully made.</p>
            <p className="text-muted-foreground">Founded on a love for fashion's history and a vision for its future, Dapper grew from the belief that pre-loved items carry stories worth telling. Every garment is a piece of art; every transaction, a connection. This is our purpose: to unite sellers and buyers in a shared appreciation for style that endures.</p>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {designers.map(designer => (
            <div key={designer.name}>
              <img src={designer.image} alt={designer.name} className="w-full h-auto object-cover grayscale aspect-[4/5] rounded-2xl" />
              <h3 className="font-semibold text-lg mt-4">{designer.name}</h3>
              <p className="text-muted-foreground">{designer.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
