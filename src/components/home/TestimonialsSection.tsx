import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, Zap } from 'lucide-react';

const benefits = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Verified Authenticity',
    description: 'Shop with confidence. Every premium item is meticulously authenticated by our team of experts, so you only get the real deal.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Quality Curation',
    description: 'We do the hunting for you. Our collection is hand-picked for style, quality, and condition, ensuring you only see the best of the best.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Seamless Experience',
    description: 'Whether you\'re buying or selling, our platform is designed to be intuitive, fast, and enjoyable. The future of thrift is here.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-secondary/50">
      <div className="container mx-auto px-4 py-24">
        <h2 className="font-serif text-4xl md:text-5xl font-medium text-center">Why You'll Love Dapper</h2>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="bg-background border-none rounded-2xl p-8 text-center shadow-lg">
              <div className="flex justify-center mb-4">{benefit.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
