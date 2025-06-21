
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const testimonials = [
  {
    name: 'Arjun Sharma',
    city: 'Delhi',
    comment: 'Finally found the Travis Scott Jordans I was hunting for months! Authentic and way below market price. Dapper is a goldmine for sneakerheads.',
    rating: 5,
    avatar: '👨‍🎓'
  },
  {
    name: 'Priya Patel',
    city: 'Bengaluru',
    comment: 'Sold my old Supreme collection and bought a Cartier watch - all verified and legit. The community here actually knows their stuff.',
    rating: 5,
    avatar: '👩‍🎨'
  },
  {
    name: 'Karan Singh',
    city: 'Dehradun',
    comment: 'Best place to flip limited drops and rare finds. Made ₹50k last month selling sneakers I copped for retail. This platform is fire! 🔥',
    rating: 5,
    avatar: '👨‍💻'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 text-yellow-700 dark:text-yellow-300 px-4 py-2 text-sm font-semibold mb-4 border-0">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Community Love
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">What Our Community Says</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Real reviews from real collectors</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl dark:hover:shadow-purple-500/25 transition-all duration-500 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 testimonial-card group hover:scale-105 rounded-3xl">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{testimonial.city}</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed font-medium text-lg">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
