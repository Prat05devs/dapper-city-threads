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
import { Upload, X, Plus, Eye } from 'lucide-react';
import ListingPaymentButton from '@/components/payments/ListingPaymentButton';

interface Category {
  id: number;
  name: string;
}

const Sell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchStripeAccountId();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchStripeAccountId = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching Stripe Account ID:", error);
        toast({
          title: "Error fetching Stripe Account ID",
          description: "Please try again or contact support.",
          variant: "destructive",
        });
      } else if (data && data.stripe_account_id) {
        setStripeAccountId(data.stripe_account_id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Unexpected error fetching Stripe Account ID:", error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
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

      const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${filePath}`;
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

    if (!productName || !productDescription || !productPrice || imageUrls.length === 0 || !selectedCategory) {
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
            category_id: selectedCategory,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setImageUrls([]);
      setSelectedCategory(null);

      toast({
        title: "Product listed!",
        description: "Your product has been listed successfully.",
      });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List a Product</h1>

      {stripeAccountId ? (
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Images</Label>
                <div className="flex space-x-2">
                  <Input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={uploadImage}
                  />
                  <Label htmlFor="image" className="flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Label>
                  {uploading && <Badge variant="secondary">Uploading...</Badge>}
                </div>
                <div className="mt-2 flex space-x-2">
                  {imageUrls.map((url) => (
                    <div key={url} className="relative">
                      <img src={url} alt="Product" className="h-20 w-20 rounded object-cover" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6 rounded-full"
                        onClick={() => removeImage(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit">List Product</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <ListingPaymentButton setLoading={setLoading} setStripeAccountId={setStripeAccountId} />
      )}
    </div>
  );
};

export default Sell;
