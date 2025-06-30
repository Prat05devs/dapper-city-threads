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
    { name: 'Prateek Thapliyal', role: 'Founder & CEO', image: '/Founder.jpeg' }
  ];

  return (
    <div className="bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="container mx-auto px-2 sm:px-4 py-12 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-4 text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter">A Message from the Founder</h1>
            <div className="bg-background rounded-xl px-6 py-10 shadow-md text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto md:mx-0 leading-relaxed space-y-4 tracking-wide">
  <p className="text-2xl font-bold text-primary">Hey boys and girls!</p>
  <p>
    Let's bring <span className="font-semibold text-foreground">Dapper</span> to life — together. This is a two-way street. It's not just me posting or sourcing pieces from second-hand markets like a typical thrift store. This is bigger. This is about redefining what a thrift store means.
  </p>
  <p>
    Let's come together for the real purpose of thrift: showing the world how fashion can be created and loved through pre-owned gems.
  </p>
  <p>
    So let's go! Let's list those cool pieces you've got. Let's help our fellow Gen Zs build the fashion they've always dreamed of <span className="italic">sustainably, creatively, authentically</span>.
  </p>
  <p>
    Dapper is all about community. It's about showing love to those designer clothes, limited-edition kicks, unique watches the items hiding in your shelves, waiting to be loved again.
  </p>
  <p>
    Don't stash them. Don't toss them. Pass them on to someone who will truly cherish them.
  </p>
  <p className="text-lg font-medium text-primary">
    Let's make Dapper a movement, a revolution. Let's take it global.
  </p>
  <p>
    Open those closets. Dig out those rare finds the pieces that deserve the spotlight again. And while you're at it, explore what others have listed.
  </p>
  <p>
    Maybe that watch you've always wanted is waiting for you. Maybe that one-of-a-kind dress, purse, or blazer is finally within reach.
  </p>
  <p className="font-semibold">
    It's not just fashion, it's a CIRCULAR FASHION ECONOMY. It's a STATEMENT. A COMMUNITY. A VIBE.
  </p>
  <p className="text-primary font-bold text-xl">Let's create it TOGETHER.</p>
  <p className="pt-2 text-sm uppercase tracking-wider text-muted-foreground">#DapperByPrateek</p>
</div>

          </div>
          <div className="order-1 md:order-2 flex justify-center items-center h-full">
            <img src="/about.jpg" alt="Team at Dapper" className="w-full h-64 sm:h-96 md:h-full object-cover rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Inside Dapper Section */}
      <section className="container mx-auto px-2 sm:px-4 pb-12 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          <h2 className="text-lg font-semibold uppercase tracking-widest text-center md:text-left">INSIDE DAPPER</h2>
          <div className="md:col-span-2 space-y-8 md:space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">We seek to close the loop on fashion by creating a trusted ecosystem for pre-loved clothing. Our vision is to empower individuals to make sustainable choices without sacrificing style, turning every wardrobe into a source of endless possibility and minimal waste.</p>
            </div>
             <div>
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">We are dedicated to curating the finest pre-loved garments and making them accessible to a global community. Through a seamless digital experience and a commitment to authenticity, we aim to redefine the second-hand market as the first choice for the conscious consumer.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Design & Soul Section */}
      <section className="bg-secondary/50 py-12 sm:py-20 md:py-24">
        <div className="container mx-auto px-2 sm:px-4">
           <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-center">STYLE • SUSTAINABILITY</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start mt-8 sm:mt-16">
              <div className="space-y-4 text-center md:text-left">
                <h3 className="text-lg font-semibold uppercase tracking-widest">OUR VALUES</h3>
                <p className="text-muted-foreground max-w-md mx-auto md:mx-0">Rooted in the belief that great style and a healthy planet can coexist, our values guide every decision we make.</p>
                <img src="/dapper.png" alt="Curated clothing item" className="w-full h-auto object-cover rounded-2xl pt-1" />
              </div>
              <div>
                {values.map(value => (
                  <div key={value.num} className="flex items-center justify-between border-b border-border py-4 sm:py-6">
                    <p className="text-xl sm:text-2xl font-semibold">{value.name}</p>
                    <span className="text-lg text-muted-foreground">{value.num}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Designers Section */}
      <section className="container mx-auto px-2 sm:px-4 py-12 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 items-start">
          <h2 className="text-lg font-semibold uppercase tracking-widest text-center md:text-left">THE TEAM BEHIND THE VISION</h2>
          <div className="md:col-span-2 space-y-4 text-center md:text-left">
            <p className="text-xl sm:text-2xl font-semibold">Each member of our team brings a unique perspective, bound by a shared passion for thoughtful curation and timeless quality. Together, we shape a space that feels personal, purposeful, and beautifully made.</p>
            <p className="text-muted-foreground">Founded on a love for fashion's history and a vision for its future, Dapper grew from the belief that pre-loved items carry stories worth telling. Every garment is a piece of art; every transaction, a connection. This is our purpose: to unite sellers and buyers in a shared appreciation for style that endures.</p>
          </div>
        </div>
        <div className="mt-8 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {designers.map(designer => (
            <div key={designer.name}>
              <img src={designer.image} alt={designer.name} className="w-full h-64 sm:h-auto object-cover grayscale aspect-[4/5] rounded-2xl" />
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
