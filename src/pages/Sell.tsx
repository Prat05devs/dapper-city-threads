
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Plus, TrendingUp, Star, Eye } from 'lucide-react';
import ListingPaymentButton from '@/components/payments/ListingPaymentButton';

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productCondition, setProductCondition] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Sports & Recreation',
    'Books & Media',
    'Vehicles',
    'Services',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else if (data) {
        setProfileData(data);
        setStripeAccountId(data.stripe_account_id || '');
      }
      setLoading(false);
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      setLoading(false);
    }
  };

  const fetchUserProducts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setUserProducts(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (!e.target.files || e.target.files.length === 0) {
      setUploading(false);
      return;
    }

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const publicURL = `https://xdsbggqczqfvkhhskvkn.supabase.co/storage/v1/object/public/products/${filePath}`;
      setImageUrls(prevUrls => [...prevUrls, publicURL]);

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (urlToRemove: string) => {
    setImageUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to list a product.",
        variant: "destructive",
      });
      return;
    }

    if (!productName || !productDescription || !productPrice || imageUrls.length === 0 || !productCategory || !productCondition) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and upload at least one image.",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(productPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productName,
            description: productDescription,
            price: price,
            image_urls: imageUrls,
            seller_id: user.id,
            category: productCategory,
            condition: productCondition,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductCategory('');
      setProductCondition('');
      setImageUrls([]);

      toast({
        title: "Product listed!",
        description: "Your product has been listed successfully.",
      });

      // Refresh products list
      fetchUserProducts();
    } catch (error: any) {
      toast({
        title: "Failed to list product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to list a product</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your product listings and sales</p>
        </div>

        {!stripeAccountId && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connect your Stripe account to receive payments from sales.</p>
                </div>
              </div>
              <ListingPaymentButton type="listing_fee">
                Connect Stripe Account
              </ListingPaymentButton>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-xl sm:text-2xl font-bold">{userProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-xl sm:text-2xl font-bold">{profileData?.total_sales || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-xl sm:text-2xl font-bold">{profileData?.average_rating?.toFixed(1) || '0.0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Free Listings</p>
                <p className="text-xl sm:text-2xl font-bold">{profileData?.free_listings_used || 0}/3</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Add New Product Form */}
          {stripeAccountId && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle className="text-lg sm:text-xl">Add New Product</CardTitle>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      onClick={() => document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Product (Free)
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          type="text"
                          id="name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          type="number"
                          id="price"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Product Description</Label>
                      <Textarea
                        id="description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          className="w-full rounded-md border border-gray-200 px-3 py-2 mt-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <select
                          id="condition"
                          className="w-full rounded-md border border-gray-200 px-3 py-2 mt-1 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                          value={productCondition}
                          onChange={(e) => setProductCondition(e.target.value)}
                        >
                          <option value="">Select condition</option>
                          {conditions.map((condition) => (
                            <option key={condition} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label>Product Images</Label>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Input
                            type="file"
                            id="image"
                            className="hidden"
                            onChange={uploadImage}
                            accept="image/*"
                          />
                          <Label 
                            htmlFor="image" 
                            className="flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 shadow-sm hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <Upload className="mr-2 h-4 w-4" /> 
                            Upload Image
                          </Label>
                          {uploading && <Badge variant="secondary">Uploading...</Badge>}
                        </div>
                        
                        {imageUrls.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {imageUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={url} 
                                  alt={`Product ${index + 1}`} 
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(url)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      List Product
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Products / Product Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Recent Listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProducts.length > 0 ? (
                  userProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex gap-3 p-3 border rounded-lg">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{product.description}</p>
                        <p className="font-semibold text-green-600">₹{product.price}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No products listed yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
