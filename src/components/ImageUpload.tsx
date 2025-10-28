import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface ImageUploadProps {
  maxFiles?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  disabled?: boolean;
}

interface UploadedImage {
  url: string;
  filename: string;
  uploading?: boolean;
}

export const ImageUpload = ({ 
  maxFiles = 5, 
  value = [], 
  onChange, 
  disabled = false 
}: ImageUploadProps) => {
  const [images, setImages] = useState<UploadedImage[]>(
    value.map(url => ({ url, filename: url.split('/').pop() || '' }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const updateParent = useCallback((newImages: UploadedImage[]) => {
    if (onChange) {
      onChange(newImages.filter(img => !img.uploading).map(img => img.url));
    }
  }, [onChange]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF and WebP images are allowed';
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.request<any>(
        '/upload/product-image',
        {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          headers: undefined,
        }
      );

      return {
        url: response.url,
        filename: response.filename,
      };
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if we can add more files
    const remainingSlots = maxFiles - images.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Maximum Files Reached',
        description: `You can only upload up to ${maxFiles} images`,
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate all files first
    for (const file of filesToUpload) {
      const error = validateFile(file);
      if (error) {
        toast({
          title: 'Invalid File',
          description: error,
          variant: 'destructive',
        });
        return;
      }
    }

    // Add uploading placeholders
    const uploadingImages = filesToUpload.map(file => ({
      url: URL.createObjectURL(file),
      filename: file.name,
      uploading: true,
    }));

    setImages(prev => [...prev, ...uploadingImages]);

    // Upload files
    const uploadPromises = filesToUpload.map((file, index) => 
      uploadFile(file).then(result => ({ result, index }))
    );

    const results = await Promise.all(uploadPromises);

    // Update images with uploaded URLs
    setImages(prev => {
      const newImages = [...prev];
      results.forEach(({ result, index }) => {
        const uploadingIndex = prev.length - filesToUpload.length + index;
        if (result) {
          newImages[uploadingIndex] = result;
        } else {
          // Remove failed upload
          newImages.splice(uploadingIndex, 1);
        }
      });
      updateParent(newImages);
      return newImages;
    });

    toast({
      title: 'Upload Complete',
      description: `${results.filter(r => r.result).length} image(s) uploaded successfully`,
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      updateParent(newImages);
      return newImages;
    });

    toast({
      title: 'Image Removed',
      description: 'Image has been removed from the list',
    });
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`
          relative border-2 border-dashed transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={disabled ? undefined : handleClickUpload}
      >
        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                {isDragging ? 'Drop images here' : 'Upload Product Images'}
              </p>
              <p className="text-sm text-foreground/60">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-foreground/50 mt-2">
                PNG, JPG, GIF or WebP (max 5MB each)
              </p>
              <p className="text-xs text-foreground/50">
                {images.length} / {maxFiles} images uploaded
              </p>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                {image.uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <div className="p-2 bg-muted">
                <p className="text-xs text-foreground/60 truncate">
                  {image.filename}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <ImageIcon className="h-12 w-12 mx-auto text-foreground/20 mb-3" />
          <p className="text-sm text-foreground/60">No images uploaded yet</p>
        </Card>
      )}
    </div>
  );
};

