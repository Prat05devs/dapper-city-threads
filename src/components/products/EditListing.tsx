import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';

interface EditListingProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditListing = ({ product, isOpen, onClose, onUpdate }: EditListingProps) => {
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
  const [saving, setSaving] = useState(false);

  const categories = ['Clothing', 'Shoes', 'Accessories', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    if (product) {
      setProductName(product.name || '');
      setProductDescription(product.description || '');
      setProductPrice(product.price?.toString() || '');
      setProductCategory(product.category || '');
      setProductCondition(product.condition || '');
      setCity(product.city || '');
      setCountry(product.country || 'IN');
      setImageUrls(product.image_urls || []);
    }
  }, [product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (!e.target.files || e.target.files.length === 0) {
      setUploading(false);
      return;
    }
    const file = e.target.files[0];
    const filePath = `${product.seller_id}/${Date.now()}_${file.name}`;
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
    if (!productName || !productDescription || !productPrice || !productCategory || !productCondition || !city || !country || imageUrls.length === 0) {
      return toast({ title: "Missing Information", description: "Please fill out all fields including location and upload at least one image.", variant: "destructive" });
    }

    setSaving(true);
    const { error } = await supabase
      .from('products')
      .update({
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        category: productCategory,
        condition: productCondition,
        city: city,
        country: country,
        image_urls: imageUrls,
      })
      .eq('id', product.id);

    if (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "Your product has been updated." });
      onUpdate();
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editProductName">Product Title</Label>
            <Input 
              id="editProductName" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              placeholder="e.g., Vintage Leather Jacket" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editProductDescription">Description</Label>
            <Textarea 
              id="editProductDescription" 
              value={productDescription} 
              onChange={(e) => setProductDescription(e.target.value)} 
              placeholder="Describe the item, its condition, brand, etc." 
              rows={4} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editProductPrice">Price (₹)</Label>
              <Input 
                id="editProductPrice" 
                type="number" 
                value={productPrice} 
                onChange={(e) => setProductPrice(e.target.value)} 
                placeholder="e.g., 2500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductCategory">Category</Label>
              <Select value={productCategory} onValueChange={setProductCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editProductCondition">Condition</Label>
            <Select value={productCondition} onValueChange={setProductCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imageUrls.map(url => (
                <div key={url} className="relative group">
                  <img src={url} alt="Product" className="w-full h-auto object-cover aspect-square rounded-md" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" 
                    onClick={() => removeImage(url)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Label htmlFor="editImageUpload" className="cursor-pointer w-full h-auto aspect-square border-2 border-dashed border-muted hover:border-primary flex items-center justify-center rounded-md">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <Input 
                  id="editImageUpload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  disabled={uploading} 
                />
              </Label>
            </div>
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || saving} className="flex-1">
              {saving ? 'Updating...' : 'Update Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditListing;