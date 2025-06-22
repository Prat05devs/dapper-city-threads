import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HandHeart, Recycle, Users, Gift } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationSelector from '@/components/LocationSelector';
import { useAuth } from '@/contexts/AuthContext';

const Donate = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    items: ''
  });

  const { location, setLocation } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCountryChange = (country: string) => {
    setLocation(prev => ({ ...prev, country }));
  };

  const handleCityChange = (city: string) => {
    setLocation(prev => ({ ...prev, city }));
  };

  const handleSchedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent('Donation Pickup Request - Dapper City Threads');
    const body = encodeURIComponent(`
Dear Dapper City Threads Team,

I would like to schedule a donation pickup with the following details:

Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${location.city}, ${location.country}
Pickup Address: ${formData.address}
Donation Items: ${formData.items}

Please contact me to arrange the pickup date and time.

Thank you,
${formData.fullName}
    `);
    
    const mailtoLink = `mailto:ishupoochi@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const impactCards = [
    {
      icon: <HandHeart className="h-8 w-8 text-primary" />,
      title: 'Local Community Support',
      description: 'Your donations are given directly to those in need within your city, making a tangible local impact.'
    },
    {
      icon: <Recycle className="h-8 w-8 text-primary" />,
      title: 'Sustainable Recycling',
      description: 'Items that cannot be donated are sent to our trusted partners for responsible recycling, closing the loop on fashion waste.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Empowering Change',
      description: 'By choosing to donate, you contribute to a more sustainable future and support our mission of conscious consumption.'
    }
  ];

  return (
    <div className="bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter">GIVE WITH PURPOSE</h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Extend the life of your cherished garments. Your decision to donate supports local communities and champions a more sustainable world.
            </p>
          </div>
          <p className="text-muted-foreground">
            We've created a seamless process for you to make a meaningful impact. For a small pickup fee, we handle the logistics, ensuring your items find a new home or are responsibly recycled.
          </p>
        </div>
        <img src="/DonationImpact.jpg" alt="Donated clothing" className="mt-16 w-full h-[500px] object-cover rounded-2xl" />
      </section>

      {/* Impact Section */}
      <section className="bg-secondary/50 py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-medium">How Your Donation Makes a Difference</h2>
            <p className="text-muted-foreground mt-4">
              Our process is designed for maximum positive impact. We believe in transparency and responsibility, ensuring every donated item is treated with care and purpose.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactCards.map(card => (
              <Card key={card.title} className="bg-background border-none rounded-2xl p-8 text-center shadow-lg">
                <div className="flex justify-center mb-4">{card.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form & Guidelines Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <Tabs defaultValue="schedule" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Schedule Pickup</TabsTrigger>
            <TabsTrigger value="guidelines">Donation Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule" className="mt-8">
            <Card className="border-border p-4 sm:p-8 rounded-2xl">
              <CardHeader>
                <CardTitle>Schedule Your Pickup</CardTitle>
                <p className="text-muted-foreground">We charge a nominal fee to cover logistics and support our operations.</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSchedulePickup}>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Your Name" 
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>Location</Label>
                    <LocationSelector
                      valueCountry={location.country}
                      valueCity={location.city}
                      onCountryChange={handleCountryChange}
                      onCityChange={handleCityChange}
                      compact={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Pickup Address</Label>
                    <Input 
                      id="address" 
                      placeholder="123 Main St, Your City" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="items">Donation Items</Label>
                    <Textarea 
                      id="items" 
                      placeholder="e.g., 5 shirts, 2 pairs of jeans, 1 jacket" 
                      rows={4}
                      value={formData.items}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Schedule My Pickup
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="mt-8">
             <Card className="border-border p-4 sm:p-8 rounded-2xl">
                <CardHeader>
                  <CardTitle>Our Donation Process & Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto"><span className="text-lg font-bold">1</span></div>
                        <h4 className="font-semibold">Schedule</h4>
                        <p className="text-sm text-muted-foreground">Fill out the pickup form with your details.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto"><span className="text-lg font-bold">2</span></div>
                        <h4 className="font-semibold">Prepare</h4>
                        <p className="text-sm text-muted-foreground">Pack your clean, gently used items.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto"><span className="text-lg font-bold">3</span></div>
                        <h4 className="font-semibold">Pickup</h4>
                        <p className="text-sm text-muted-foreground">Our team will collect your donation.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto"><span className="text-lg font-bold">4</span></div>
                        <h4 className="font-semibold">Impact</h4>
                        <p className="text-sm text-muted-foreground">Your items are donated or recycled.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-green-600">What We Accept</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Clean, gently used clothing</li>
                        <li>Shoes, bags, and accessories</li>
                        <li>Items with no major damage</li>
                        <li>Premium and designer brands</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-red-600">What We Cannot Accept</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Torn, stained, or broken items</li>
                        <li>Undergarments and swimwear</li>
                        <li>Non-clothing items</li>
                        <li>Items with strong odors</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </section>

    </div>
  );
};

export default Donate;
