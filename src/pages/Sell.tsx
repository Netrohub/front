import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  DollarSign, 
  Tag,
  ArrowRight,
  Store
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";

const Sell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    platform: "",
    stock_quantity: "1",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (urls: string[]) => {
    setImageUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ FIXED: Implement actual API call to create product with uploaded images
      const productData = {
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category) || 1, // Default category
        stock_quantity: parseInt(formData.stock_quantity) || 1,
        specifications: {
          platform: formData.platform,
        },
        images: imageUrls, // ✅ Now using real uploaded image URLs
      };

      const product = await apiClient.createProduct(productData);

      toast({
        title: "Product Listed Successfully!",
        description: `Your product "${product.name}" has been created and is now live`,
      });

      // Redirect to seller dashboard
      navigate("/dashboard?tab=seller");
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
        <ConditionalStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Store className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sell Your Product
                </h1>
                <p className="text-foreground/60 mt-1">
                  List your gaming accounts, digital assets, and more
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="glass-card p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Fortnite Account - Level 250 - Rare Skins"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product, include details about features, stats, items, etc."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                    />
                  </div>

                  {/* Category & Platform */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="gaming-accounts">Gaming Accounts</option>
                        <option value="digital-assets">Digital Assets</option>
                        <option value="game-items">Game Items</option>
                        <option value="gift-cards">Gift Cards</option>
                        <option value="software">Software</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Input
                        id="platform"
                        name="platform"
                        placeholder="e.g. PC, PlayStation, Xbox"
                        value={formData.platform}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Product Images
                </h2>

                <ImageUpload
                  maxFiles={5}
                  value={imageUrls}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/dashboard?tab=seller")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      List Product
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sell;

