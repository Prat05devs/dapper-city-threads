
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesChange, 
  existingImages = [], 
  maxImages = 5 
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(existingImages);
  const { toast } = useToast();

  const uploadImage = useCallback(async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (imageUrls.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(uploadImage);
      const newUrls = await Promise.all(uploadPromises);
      const updatedUrls = [...imageUrls, ...newUrls];
      setImageUrls(updatedUrls);
      onImagesChange(updatedUrls);
      
      toast({
        title: "Images uploaded successfully",
        description: `${newUrls.length} image(s) uploaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedUrls);
    onImagesChange(updatedUrls);
  };

  return (
    <div className="space-y-4">
      <Label>Product Images *</Label>
      
      {/* Image Preview Grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {imageUrls.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <div>
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </span>
                </Button>
              </Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
            <p className="text-sm text-gray-500">
              Upload up to {maxImages - imageUrls.length} more images (PNG, JPG up to 10MB each)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
