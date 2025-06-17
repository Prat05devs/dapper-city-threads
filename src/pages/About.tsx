
import React from 'react';
import { Heart, Globe, Users, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const team = [
    {
      name: 'Arjun Sharma',
      role: 'Co-Founder & CEO',
      image: '/placeholder.svg',
      bio: 'Passionate about sustainable fashion and technology. Previously worked at leading e-commerce platforms.'
    },
    {
      name: 'Priya Patel',
      role: 'Co-Founder & CTO',
      image: '/placeholder.svg',
      bio: 'Tech enthusiast with a vision for circular economy. Expert in building scalable marketplace platforms.'
    },
    {
      name: 'Sneha Gupta',
      role: 'Head of Community',
      image: '/placeholder.svg',
      bio: 'Community builder and sustainability advocate. Connects cities and users through shared values.'
    },
    {
      name: 'Karan Singh',
      role: 'Head of Operations',
      image: '/placeholder.svg',
      bio: 'Operations expert ensuring smooth city-to-city expansion and logistics management.'
    }
  ];

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Sustainability First',
      description: 'Every decision we make prioritizes environmental impact and circular economy principles.'
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Community Driven',
      description: 'We believe in the power of communities to create positive change through shared resources.'
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: 'Quality & Trust',
      description: 'We ensure every transaction is safe, fair, and beneficial for all parties involved.'
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-600" />,
      title: 'Local Impact',
      description: 'We connect local communities while building a global movement for sustainable fashion.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About Dapper</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of sustainable fashion through community-driven circular economy, 
            connecting conscious consumers across Indian cities to buy, sell, and donate pre-loved clothing.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Fashion is the second most polluting industry globally, and fast fashion culture has created 
                an environmental crisis. At Dapper, we're changing this narrative by creating a platform 
                where fashion finds new life through community-driven sharing.
              </p>
              <p className="text-gray-700 mb-6">
                Starting with Indian cities like Delhi, Bengaluru, and Dehradun, we're building localized 
                marketplaces that reduce textile waste, support circular economy, and make sustainable 
                fashion accessible to everyone.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Reduce textile waste by extending clothing lifecycle</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Make sustainable fashion affordable and accessible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Build conscious communities across Indian cities</span>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-2xl p-8">
              <img 
                src="/placeholder.svg" 
                alt="Sustainable fashion mission" 
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 text-lg mb-8">
              Dapper was born from a simple observation: our wardrobes are full of clothes we rarely wear, 
              while millions of garments end up in landfills every year. Our founders, Arjun and Priya, 
              noticed this paradox in their own lives and communities.
            </p>
            <p className="text-gray-700 mb-8">
              After witnessing the environmental impact of fast fashion and the growing awareness among 
              young Indians about sustainable living, they decided to create a platform that would make 
              circular fashion simple, safe, and social.
            </p>
            <p className="text-gray-700">
              What started as a small experiment in Delhi has now grown into a movement, connecting 
              conscious consumers across multiple cities and preventing thousands of clothing items 
              from ending up in waste.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every feature we build
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to make sustainable fashion accessible to everyone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Together with our community, we're making a real difference in sustainable fashion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <p className="text-green-100">Items Sold</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <p className="text-green-100">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">800+</div>
              <p className="text-green-100">Items Donated</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <p className="text-green-100">Cities Connected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Looking Ahead</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our vision extends beyond just buying and selling clothes. We're building a comprehensive 
            ecosystem for sustainable fashion that includes AI-powered styling, community events, 
            brand partnerships, and global expansion.
          </p>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Join us in revolutionizing how India thinks about fashion. Together, we can make 
            sustainable style the norm, not the exception.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
