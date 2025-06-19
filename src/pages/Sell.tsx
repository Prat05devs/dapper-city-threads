
import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Package, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';
import ImageUpload from '@/components/products/ImageUpload';

type Product = Tables<'products'>;

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeListings, setActiveListings] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: '',
    price: '',
    description: '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchActiveListings();
    }
  }, [user]);

  const fetchActiveListings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    if (imageUrls.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image for your product.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          category: formData.category,
          condition: formData.condition,
          price: parseFloat(formData.price),
          description: formData.description,
          image_urls: imageUrls,
          seller_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Listing created successfully!",
        description: "Your product is now live and available for buyers.",
      });

      // Reset form
      setFormData({
        name: '',
        category: '',
        condition: '',
        price: '',
        description: '',
      });
      setImageUrls([]);
      
      // Refresh listings
      fetchActiveListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error creating listing",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMakeFeatured = async (productId: string, days: number) => {
    if (!user) return;

    try {
      // Call Stripe payment function for featured listing
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          productId,
          type: `featured_${days}_days`,
          amount: days === 3 ? 500 : 800, // $5 for 3 days, $8 for 7 days
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Payment error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Please sign in to access the seller dashboard.</p>
            <Button onClick={() => window.location.href = '/signin'} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your listings, track sales, and list new items for the Dapper community.</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create">Create Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeListings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Your products for sale
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    Coming soon
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeListings.reduce((sum, product) => sum + (product.likes_count || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all listings
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Active Listings */}
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <p className="text-sm text-gray-600">Items currently available for sale</p>
              </CardHeader>
              <CardContent>
                {activeListings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No active listings yet.</p>
                    <Button onClick={() => document.querySelector('[value="create"]')?.click()}>
                      Create Your First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        {listing.image_urls && listing.image_urls.length > 0 ? (
                          <img 
                            src={listing.image_urls[0]} 
                            alt={listing.name} 
                            className="w-16 h-16 object-cover rounded-lg" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium">{listing.name}</h3>
                          <p className="text-sm text-gray-600">Price: ₹{listing.price}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{listing.likes_count || 0} likes</span>
                            <span className="capitalize">{listing.condition}</span>
                            {listing.is_featured && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {!listing.is_featured && (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMakeFeatured(listing.id, 3)}
                              >
                                Feature 3d (₹5)
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMakeFeatured(listing.id, 7)}
                              >
                                Feature 7d (₹8)
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Listing
                </CardTitle>
                <p className="text-sm text-gray-600">List your pre-loved fashion items for the Dapper community</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="productName">Product Name *</Label>
                      <Input 
                        id="productName" 
                        placeholder="e.g., Vintage Leather Jacket" 
                        className="mt-1"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Shoes">Shoes</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Books">Books</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                        required
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="As New">As New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="Enter your asking price" 
                        className="mt-1"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the item's condition, style, fit, and any other relevant details..."
                      className="mt-1 min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <ImageUpload 
                    onImagesChange={setImageUrls}
                    existingImages={imageUrls}
                    maxImages={5}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={loading}
                    >
                      {loading ? 'Creating Listing...' : 'Create Listing'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Sell;
