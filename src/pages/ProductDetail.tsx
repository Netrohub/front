import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAddToCart, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useApi";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Shield, 
  Truck, 
  RotateCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleAddToCart = () => {
    if (!id) return;
    
    addToCart.mutate(
      { productId: parseInt(id), quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart!",
            description: "Product has been added to your cart.",
          });
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (!id) return;

    if (isWishlisted) {
      removeFromWishlist.mutate(parseInt(id), {
        onSuccess: () => {
          setIsWishlisted(false);
          toast({
            title: "Removed from wishlist",
            description: "Product removed from your wishlist.",
          });
        },
      });
    } else {
      addToWishlist.mutate(parseInt(id), {
        onSuccess: () => {
          setIsWishlisted(true);
          toast({
            title: "Added to wishlist!",
            description: "Product added to your wishlist.",
          });
        },
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    }
  };

  // Mock product data
  const product = {
    id: id || "1",
    name: "Premium Instagram Account - 50K Followers",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
    ],
    category: "Social Media",
    platform: "Instagram",
    rating: 4.9,
    reviews: 145,
    sales: 234,
    description: "Verified Instagram account with 50K+ real, engaged followers. Perfect for influencers, brands, or anyone looking to jumpstart their social media presence.",
    features: [
      "50,000+ Real Followers",
      "High Engagement Rate (8-12%)",
      "Verified Email Access",
      "Original Email Included",
      "No Bot Followers",
      "30-Day Support Included",
      "Instant Account Transfer",
      "Secure Transaction",
    ],
    seller: {
      name: "Digital Elite",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=seller1",
      rating: 4.9,
      totalSales: 1250,
      memberSince: "2023",
      verified: true,
    },
    specifications: {
      "Account Age": "3+ Years",
      "Followers": "50,000+",
      "Following": "500",
      "Posts": "200+",
      "Engagement Rate": "8-12%",
      "Verification": "Verified Email",
    },
  };

  const reviews = [
    {
      id: 1,
      user: "John D.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
      rating: 5,
      date: "2 days ago",
      verified: true,
      comment: "Amazing account! Everything as described. Seller was very helpful and the transfer was smooth. Highly recommend!",
      helpful: 24,
    },
    {
      id: 2,
      user: "Sarah M.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
      rating: 5,
      date: "1 week ago",
      verified: true,
      comment: "Great purchase! The followers are real and the engagement is excellent. Worth every penny.",
      helpful: 18,
    },
    {
      id: 3,
      user: "Mike R.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
      rating: 4,
      date: "2 weeks ago",
      verified: true,
      comment: "Good account overall. Had a minor issue but seller resolved it quickly.",
      helpful: 12,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Breadcrumb */}
        <section className="border-b border-border/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>/</span>
              <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <Card className="glass-card p-4 overflow-hidden">
                  <div className="aspect-square relative rounded-lg overflow-hidden mb-4 group">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discount > 0 && (
                      <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                        -{product.discount}% OFF
                      </Badge>
                    )}
                    <button
                      onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 glass-card rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 glass-card rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? "border-primary" : "border-border/30"
                        }`}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {product.category}
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                      {product.platform}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-foreground/20"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-foreground">{product.rating}</span>
                    </div>
                    <span className="text-foreground/60">({product.reviews} reviews)</span>
                    <span className="text-foreground/60">• {product.sales} sold</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-foreground/40 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-foreground/70 leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1 btn-glow"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {addToCart.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`glass-card ${isWishlisted ? "border-destructive text-destructive" : "border-primary/30"}`}
                    onClick={handleToggleWishlist}
                    disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-destructive" : ""}`} />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="glass-card border-primary/30"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="glass-card p-4 text-center">
                    <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground/60">Secure Payment</p>
                  </Card>
                  <Card className="glass-card p-4 text-center">
                    <Truck className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground/60">Instant Delivery</p>
                  </Card>
                  <Card className="glass-card p-4 text-center">
                    <RotateCcw className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-xs text-foreground/60">7-Day Guarantee</p>
                  </Card>
                </div>

                {/* Seller Info */}
                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={product.seller.avatar} />
                        <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{product.seller.name}</h3>
                          {product.seller.verified && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{product.seller.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{product.seller.totalSales} sales</span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/seller/${product.seller.name}`}>
                      <Button variant="outline" size="sm" className="glass-card border-primary/30">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Member since {product.seller.memberSince} • 98% positive reviews
                  </p>
                </Card>
              </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="glass-card border border-border/30">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-black text-foreground mb-4">Product Description</h2>
                  <p className="text-foreground/70 leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 glass-card rounded-lg border border-border/30">
                        <div className="p-1 rounded-lg bg-primary/10">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 glass-card rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-foreground mb-1">Important Information</h4>
                        <p className="text-sm text-foreground/70">
                          All accounts are verified and come with a 7-day money-back guarantee. 
                          After purchase, you'll receive instant access to account credentials.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-black text-foreground mb-6">Technical Specifications</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-4 glass-card rounded-lg border border-border/30">
                        <span className="text-foreground/60">{key}</span>
                        <span className="font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {/* Review Summary */}
                <Card className="glass-card p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                        {product.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-foreground/20"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground/60">Based on {product.reviews} reviews</p>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm text-foreground/60 w-8">{stars} ★</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent"
                              style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                            />
                          </div>
                          <span className="text-sm text-foreground/60 w-12 text-right">
                            {stars === 5 ? 123 : stars === 4 ? 17 : 5}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <Card key={review.id} className="glass-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground">{review.user}</h4>
                            {review.verified && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                                ✓ Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-foreground/20"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-foreground/60">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground/70 mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-foreground/60 hover:text-primary"
                        onClick={() => {
                          toast({
                            title: "Thank you!",
                            description: "Your feedback has been recorded.",
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-foreground/60 hover:text-primary"
                        onClick={() => {
                          toast({
                            title: "Reply Feature",
                            description: "Reply functionality will be available soon!",
                          });
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </Card>
                ))}

                <div className="text-center">
                  <Button variant="outline" className="glass-card border-primary/30">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;