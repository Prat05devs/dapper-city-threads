import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LocationSelector from '@/components/LocationSelector';

const CreateListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productCondition, setProductCondition] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('IN');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = ['Clothing', 'Shoes', 'Accessories', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (!e.target.files || e.target.files.length === 0) {
      setUploading(false);
      return;
    }
    const file = e.target.files[0];
    const filePath = `${user!.id}/${Date.now()}_${file.name}`;
    try {
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrls(prev => [...prev, data.publicUrl]);
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => setImageUrls(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast({ title: "Authentication Error", description: "Please sign in to sell.", variant: "destructive" });
    if (!productName || !productDescription || !productPrice || !productCategory || !productCondition || !city || !country || imageUrls.length === 0) {
      return toast({ title: "Missing Information", description: "Please fill out all fields including location and upload at least one image.", variant: "destructive" });
    }

    const { error } = await supabase.from('products').insert([{
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      category: productCategory,
      condition: productCondition,
      city: city,
      country: country,
      image_urls: imageUrls,
      seller_id: user.id,
      status: 'active'
    }]);

    if (error) {
      toast({ title: "Listing Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your product has been listed." });
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductCategory('');
      setProductCondition('');
      setCity('');
      setCountry('IN');
      setImageUrls([]);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">Create New Listing</h1>
      <div className="max-w-3xl w-full px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Title</Label>
            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g., Vintage Leather Jacket" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">Description</Label>
            <Textarea id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Describe the item, its condition, brand, etc." rows={5} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price (₹)</Label>
              <Input id="productPrice" type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="e.g., 2500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Select value={productCategory} onValueChange={setProductCategory}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="productCondition">Condition</Label>
              <Select value={productCondition} onValueChange={setProductCondition}>
                <SelectTrigger><SelectValue placeholder="Select Condition" /></SelectTrigger>
                <SelectContent>{conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <LocationSelector
              valueCountry={country}
              valueCity={city}
              onCountryChange={setCountry}
              onCityChange={setCity}
              compact={false}
            />
          </div>

          <div className="space-y-4">
            <Label>Images</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {imageUrls.map(url => (
                <div key={url} className="relative group">
                  <img src={url} alt="Uploaded product" className="w-full h-auto object-cover aspect-square rounded-md" />
                  <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={() => removeImage(url)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
              <Label htmlFor="imageUpload" className="cursor-pointer w-full h-auto aspect-square border-2 border-dashed border-muted hover:border-primary flex items-center justify-center rounded-md">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <Input id="imageUpload" type="file" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </Label>
            </div>
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={uploading}>
            {uploading ? 'Listing...' : 'List Your Item'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing; 