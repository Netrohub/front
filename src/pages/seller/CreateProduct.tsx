import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Plus, Save, Copy, Check, Shield } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateProduct } from "@/hooks/useApi";

const CreateProduct = () => {
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    platform: '',
    game: '',
    price: '',
    description: ''
  });
  
  // Ownership verification state
  const [ownershipVerificationOpen, setOwnershipVerificationOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationStep, setVerificationStep] = useState<'code' | 'delivery'>('code');
  const [deliveryInfo, setDeliveryInfo] = useState({
    method: '',
    instructions: '',
    timeframe: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
    return code;
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(verificationCode);
    toast({
      title: "Code Copied! ✅",
      description: "Verification code copied to clipboard",
    });
  };

  const handleSubmitAccount = () => {
    console.log('Form data:', formData);
    console.log('Ownership verification open:', ownershipVerificationOpen);
    
    if (!formData.productName || !formData.category || !formData.platform || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Only require ownership verification for social media accounts
    const socialMediaPlatforms = ['instagram', 'twitter', 'tiktok', 'facebook', 'youtube', 'snapchat'];
    const isSocialMediaAccount = socialMediaPlatforms.includes(formData.platform);
    
    console.log('Platform:', formData.platform);
    console.log('Is social media:', isSocialMediaAccount);
    
    if (isSocialMediaAccount) {
      console.log('Opening ownership verification for social media');
      generateVerificationCode();
      setOwnershipVerificationOpen(true);
    } else {
      console.log('Opening delivery info for non-social media');
      // For non-social media accounts, go directly to delivery info
      setVerificationStep('delivery');
      setOwnershipVerificationOpen(true);
    }
  };

  const handleVerifyOwnership = () => {
    // Simulate verification process
    toast({
      title: "Ownership Verified! ✅",
      description: "Account ownership has been confirmed",
    });
    setVerificationStep('delivery');
  };

  const handleSubmitDeliveryInfo = () => {
    if (!deliveryInfo.method || !deliveryInfo.instructions) {
      toast({
        title: "Missing Information",
        description: "Please fill in delivery method and instructions",
        variant: "destructive",
      });
      return;
    }
    
    // Create the product with all information
    const productData = new FormData();
    productData.append('title', formData.productName);
    productData.append('category', formData.category);
    productData.append('platform', formData.platform);
    productData.append('game', formData.game);
    productData.append('price', formData.price);
    productData.append('description', formData.description);
    productData.append('delivery_method', deliveryInfo.method);
    productData.append('delivery_instructions', deliveryInfo.instructions);
    productData.append('delivery_timeframe', deliveryInfo.timeframe);
    
    // Add images
    images.forEach((image, index) => {
      productData.append(`images[${index}]`, image);
    });
    
    createProduct.mutate(productData);
    setOwnershipVerificationOpen(false);
    setVerificationStep('code');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Create Product
          </h1>
          <p className="text-foreground/60">List a new product on the marketplace</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
            <div className="space-y-5">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-foreground">
                  Product Name *
                </Label>
                <Input
                  id="productName"
                  placeholder="e.g., Steam Account - 500+ Games"
                  className="glass-card border-border/50 focus:border-primary/50"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-foreground">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="glass-card border-border/50 bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card border-border z-50">
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="digital-services">Digital Services</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform/Type */}
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-foreground">
                  Platform/Type *
                </Label>
                <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                  <SelectTrigger className="glass-card border-border/50 bg-background">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card border-border z-50">
                    <SelectItem value="steam">Steam</SelectItem>
                    <SelectItem value="playstation">PlayStation</SelectItem>
                    <SelectItem value="xbox">Xbox</SelectItem>
                    <SelectItem value="epic">Epic Games</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  className="glass-card border-border/50 focus:border-primary/50 min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <p className="text-xs text-foreground/50">
                  Provide detailed information about the product, its features, and condition
                </p>
              </div>
            </div>
          </Card>

          {/* Pricing */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Pricing & Stock</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Price (USD) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 glass-card border-border/50 focus:border-primary/50"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-foreground">
                  Stock Quantity *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  className="glass-card border-border/50 focus:border-primary/50"
                  min="0"
                />
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Product Images</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden glass-card border border-border/50 group">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg glass-card border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-foreground/60 hover:text-primary"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Upload Image</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-foreground/50">
                Upload up to 6 images. First image will be the main product image.
              </p>
            </div>
          </Card>


          {/* Actions */}
          <Card className="glass-card p-6">
            <div className="flex gap-3">
              <Button type="button" onClick={handleSubmitAccount} className="btn-glow">
                <Save className="h-4 w-4 mr-2" />
                Submit Account
              </Button>
              <Button type="button" variant="outline" className="glass-card border-border/50">
                Save as Draft
              </Button>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </div>
          </Card>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Ownership Verification Modal */}
        {ownershipVerificationOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="glass-card p-6 w-full max-w-md mx-4">
              {verificationStep === 'code' ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Ownership Verification</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/60">
                      To verify ownership of your {formData.platform} account, please follow these steps:
                    </p>
                    
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-primary font-medium mb-2">Step 1: Add this code to your bio</p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={verificationCode}
                          readOnly
                          className="font-mono text-center bg-background"
                        />
                        <Button
                          size="sm"
                          onClick={copyVerificationCode}
                          className="btn-glow"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-foreground/5 border border-border/30">
                      <p className="text-sm text-foreground/60">
                        Add the verification code to your {formData.platform} bio and keep it there for at least 24 hours.
                      </p>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleVerifyOwnership}
                        className="flex-1 btn-glow"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        I've Added the Code
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setOwnershipVerificationOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-green-500" />
                    <h3 className="text-lg font-bold text-foreground">Delivery Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/60">
                      How will you deliver this {formData.platform} account to the buyer?
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="deliveryMethod" className="text-foreground">Delivery Method *</Label>
                        <Select value={deliveryInfo.method} onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, method: value }))}>
                          <SelectTrigger className="glass-card border-border/50 bg-background">
                            <SelectValue placeholder="Select delivery method" />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-card border-border z-50">
                            <SelectItem value="email">Email (Login credentials)</SelectItem>
                            <SelectItem value="direct-transfer">Direct Account Transfer</SelectItem>
                            <SelectItem value="screenshot">Screenshot Instructions</SelectItem>
                            <SelectItem value="video-call">Video Call Setup</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryInstructions" className="text-foreground">Delivery Instructions *</Label>
                        <Textarea
                          id="deliveryInstructions"
                          placeholder="Describe how you will deliver the account..."
                          className="glass-card border-border/50 focus:border-primary/50 min-h-[100px]"
                          value={deliveryInfo.instructions}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, instructions: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="deliveryTimeframe" className="text-foreground">Delivery Timeframe</Label>
                        <Select value={deliveryInfo.timeframe} onValueChange={(value) => setDeliveryInfo(prev => ({ ...prev, timeframe: value }))}>
                          <SelectTrigger className="glass-card border-border/50 bg-background">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent className="glass-card bg-card border-border z-50">
                            <SelectItem value="instant">Instant (0-5 minutes)</SelectItem>
                            <SelectItem value="fast">Fast (5-30 minutes)</SelectItem>
                            <SelectItem value="standard">Standard (30 minutes - 2 hours)</SelectItem>
                            <SelectItem value="extended">Extended (2-24 hours)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleSubmitDeliveryInfo}
                        className="flex-1 btn-glow"
                        disabled={createProduct.isPending}
                      >
                        {createProduct.isPending ? 'Creating...' : 'Create Product'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setOwnershipVerificationOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default CreateProduct;
