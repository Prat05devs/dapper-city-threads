
import React, { useState, useEffect } from 'react';
import { Plus, Star, Edit, Trash2, Eye, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/products/ImageUpload';
import StripeConnectButton from '@/components/payments/StripeConnectButton';
import ListingPaymentButton from '@/components/payments/ListingPaymentButton';

const categories = [
  'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 
  'Toys', 'Automotive', 'Health & Beauty', 'Jewelry', 'Other'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    imageUrls: []
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchProfile();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load your products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const canCreateFreeListing = () => {
    return profile && profile.free_listings_used < 3;
  };

  const needsListingPayment = () => {
    return profile && profile.free_listings_used >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // Check if user needs to pay for listing
    if (needsListingPayment()) {
      toast({
        title: "Payment Required",
        description: "You have used all your free listings. Please pay the listing fee to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...formData,
          price: parseFloat(formData.price),
          seller_id: user.id,
          image_urls: formData.imageUrls
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your product has been listed successfully.",
      });

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        imageUrls: []
      });
      setIsAddingProduct(false);
      fetchProducts();
      fetchProfile();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product listing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Product deleted successfully.",
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const openProductModal = (product) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <img src="${product.image_urls?.[0] || '/placeholder.svg'}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-4">
        <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-2">${product.description || 'No description'}</p>
        <p class="text-lg font-bold text-green-600 mb-4">₹${product.price}</p>
        <button class="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors" onclick="this.closest('.fixed').remove()">Close</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please Sign In</h2>
            <p className="text-gray-600">You need to be signed in to access the seller dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your product listings and sales</p>
        </div>

        {/* Stripe Connect Alert */}
        {profile && !profile.stripe_onboarding_completed && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span>Connect your Stripe account to receive payments from sales.</span>
              <StripeConnectButton onSuccess={fetchProfile} />
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Listings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.total_sales || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.average_rating?.toFixed(1) || '0.0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Free Listings</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.free_listings_used || 0}/3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Section */}
        <div className="mb-6">
          {canCreateFreeListing() ? (
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product (Free)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ImageUpload
                    onImagesChange={(urls) => setFormData({...formData, imageUrls: urls})}
                    existingImages={formData.imageUrls}
                  />

                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  You have used all your free listings. Pay ₹30 to create additional listings.
                </AlertDescription>
              </Alert>
              <ListingPaymentButton type="listing_fee" />
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.image_urls?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.is_featured && (
                  <Badge className="absolute top-2 left-2 bg-yellow-500">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-lg sm:text-xl font-bold text-green-600 mb-4">₹{product.price}</p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openProductModal(product)}
                      className="flex-1 min-w-0"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 min-w-0"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  {!product.is_featured && (
                    <div className="space-y-2">
                      <ListingPaymentButton 
                        type="featured_3_days" 
                        productId={product.id}
                      >
                        Feature 3 days - ₹100
                      </ListingPaymentButton>
                      <ListingPaymentButton 
                        type="featured_7_days" 
                        productId={product.id}
                      >
                        Feature 7 days - ₹200
                      </ListingPaymentButton>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600">Start by adding your first product to sell!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sell;
