import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryImage } from "@/lib/categoryImages";
import { 
  GitCompare, 
  X, 
  Plus, 
  Star, 
  ShoppingCart,
  Check
} from "lucide-react";

const compareProducts = [
  {
    id: "c1",
    name: "Premium Instagram Account - 50K",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 145,
    features: {
      "Followers": "50,000",
      "Engagement Rate": "8-12%",
      "Account Age": "3+ Years",
      "Verified Email": true,
      "Original Email": true,
      "Bot Followers": false,
      "Support Period": "30 Days",
      "Money Back": "7 Days",
    }
  },
  {
    id: "c2",
    name: "Instagram Account - 100K",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    category: "Social Media",
    rating: 4.8,
    reviews: 234,
    features: {
      "Followers": "100,000",
      "Engagement Rate": "10-15%",
      "Account Age": "5+ Years",
      "Verified Email": true,
      "Original Email": true,
      "Bot Followers": false,
      "Support Period": "60 Days",
      "Money Back": "14 Days",
    }
  },
  {
    id: "c3",
    name: "Instagram Account - 25K",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
    category: "Social Media",
    rating: 4.7,
    reviews: 89,
    features: {
      "Followers": "25,000",
      "Engagement Rate": "6-10%",
      "Account Age": "2+ Years",
      "Verified Email": true,
      "Original Email": false,
      "Bot Followers": false,
      "Support Period": "15 Days",
      "Money Back": "7 Days",
    }
  },
];

const Compare = () => {
  const [products, setProducts] = useState(compareProducts);

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const allFeatureKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.features)))
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-40" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex p-3 rounded-xl glass-card border border-primary/30 mb-6">
                <GitCompare className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Compare Products
              </h1>
              <p className="text-foreground/60">
                Compare up to 4 products side-by-side to find the perfect match
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                    {/* Header Row - Product Images */}
                    <div className="sticky left-0 bg-background/95 backdrop-blur-sm z-10"></div>
                    {products.map((product) => (
                      <Card key={product.id} className="glass-card p-4">
                        <div className="relative">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="aspect-square rounded-lg overflow-hidden mb-4">
                            <img 
                              src={getCategoryImage(product.category, product.image)} 
                              alt={product.category} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
                            {product.category}
                          </Badge>
                          <h3 className="font-bold text-foreground mb-2 text-sm">{product.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating)
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-foreground/20"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-foreground/60 ml-1">({product.reviews})</span>
                          </div>
                          <p className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                            ${product.price}
                          </p>
                          <Button size="sm" className="w-full btn-glow">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {products.length < 4 && (
                      <Card className="glass-card p-4 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="text-center">
                          <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm text-foreground/60">Add Product</p>
                        </div>
                      </Card>
                    )}

                    {/* Feature Rows */}
                    {allFeatureKeys.map((featureKey) => (
                      <>
                        <div className="sticky left-0 bg-background/95 backdrop-blur-sm z-10 p-4 flex items-center">
                          <span className="font-semibold text-foreground">{featureKey}</span>
                        </div>
                        {products.map((product) => {
                          const value = product.features[featureKey];
                          return (
                            <Card key={`${product.id}-${featureKey}`} className="glass-card p-4 flex items-center justify-center">
                              {typeof value === "boolean" ? (
                                value ? (
                                  <Check className="h-5 w-5 text-primary" />
                                ) : (
                                  <X className="h-5 w-5 text-destructive" />
                                )
                              ) : (
                                <span className="text-foreground text-center">{value || "—"}</span>
                              )}
                            </Card>
                          );
                        })}
                        {products.length < 4 && <div className="glass-card p-4"></div>}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="glass-card p-12 text-center max-w-2xl mx-auto">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                  <GitCompare className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No products to compare</h2>
                <p className="text-foreground/60 mb-6">
                  Add products to your comparison list to see them side-by-side
                </p>
                <Button size="lg" className="btn-glow">
                  Browse Products
                </Button>
              </Card>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;