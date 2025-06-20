
import React from 'react';
import { Recycle, MapPin, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Donate = () => {
  const handleSchedulePickup = () => {
    const emailSubject = encodeURIComponent('Donation Pickup Request - Dapper');
    const emailBody = encodeURIComponent(`
Hello Dapper Team,

I would like to schedule a pickup for my clothing donations.

Contact Information:
- Name: [Your Name]
- Phone: [Your Phone]
- Email: [Your Email]

Pickup Address:
[Your Full Address]

Donation Items:
[List your items here]

Preferred Pickup Time:
[Your preferred date and time]

Additional Notes:
[Any special instructions]

Thank you for supporting sustainable fashion!

Best regards,
[Your Name]
    `);
    
    window.location.href = `mailto:donations@dapper.com?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Donate Items</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Give your gently used fashion items a new life and help support our community programs. 
            Schedule a free pickup or learn about drop-off options.
          </p>
        </div>

        {/* Impact Section */}
        <div className="bg-green-600 rounded-2xl p-8 text-white mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Fashion That Doesn't Cost the Earth</h2>
              <p className="text-green-100 mb-6">
                Every garment has a story and an environmental footprint. At Dapper, 
                we extend the lifecycle of clothing, reducing waste and demand for new production.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Recycle className="w-6 h-6 text-green-200" />
                  <div>
                    <h3 className="font-semibold">Circular Economy</h3>
                    <p className="text-green-100 text-sm">We keep clothing in circulation, extending its useful life and reducing landfill waste.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gift className="w-6 h-6 text-green-200" />
                  <div>
                    <h3 className="font-semibold">Community Impact</h3>
                    <p className="text-green-100 text-sm">Your donations help support our community programs and reduce waste.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <img 
                src="/DonationImpact.jpg" 
                alt="Sustainable fashion donation" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="schedule" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="schedule">Schedule Pickup</TabsTrigger>
            <TabsTrigger value="guidelines">Donation Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Schedule a Free Pickup
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Fill out the form below and we'll arrange a convenient pickup time for your donations.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" className="mt-1" placeholder="Enter your full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" className="mt-1" placeholder="your@email.com" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" className="mt-1" placeholder="Enter your phone number" />
                    </div>
                  </div>
                </div>

                {/* Pickup Address */}
                <div>
                  <h3 className="font-semibold mb-4">Pickup Address</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" className="mt-1" placeholder="Enter your complete address" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" className="mt-1" placeholder="City" />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" className="mt-1" placeholder="State" />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input id="zipCode" className="mt-1" placeholder="ZIP Code" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donation Details */}
                <div>
                  <h3 className="font-semibold mb-4">Donation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="items">List of Items *</Label>
                      <Textarea 
                        id="items" 
                        className="mt-1" 
                        placeholder="Please list the items you're donating (e.g., 3 shirts, 2 jeans, 1 jacket...)"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred Pickup Time</Label>
                      <Input 
                        id="preferredTime" 
                        className="mt-1" 
                        placeholder="e.g., Weekdays 10 AM - 2 PM" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea 
                        id="notes" 
                        className="mt-1" 
                        placeholder="Any special instructions or notes for our pickup team..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleSchedulePickup}
                >
                  Schedule Pickup
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Schedule</h3>
                      <p className="text-sm text-gray-600">Fill out the form with your pickup details and preferred time.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Prepare</h3>
                      <p className="text-sm text-gray-600">Pack your clean, gently used items in bags or boxes.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Pickup</h3>
                      <p className="text-sm text-gray-600">Our driver will collect your donations at the scheduled time.</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-600 font-bold">4</span>
                      </div>
                      <h3 className="font-semibold mb-2">Impact</h3>
                      <p className="text-sm text-gray-600">Your items help support our community programs and reduce waste.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Donation Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-green-600 mb-2">What We Accept</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Clean, gently used clothing for all ages</li>
                      <li>Shoes in good condition</li>
                      <li>Accessories like bags, belts, and jewelry</li>
                      <li>Seasonal items and formal wear</li>
                      <li>Traditional and ethnic clothing</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">What We Cannot Accept</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Items that are torn, stained, or heavily worn</li>
                      <li>Undergarments and swimwear</li>
                      <li>Items with strong odors or pet hair</li>
                      <li>Non-clothing items (furniture, electronics, etc.)</li>
                      <li>Items that pose health or safety risks</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Quality Standards</h4>
                    <p className="text-blue-700 text-sm">
                      All donations are tax-deductible. You'll receive a receipt for your contribution. 
                      Items that don't meet our quality standards are responsibly recycled through our textile partners.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Donate;
