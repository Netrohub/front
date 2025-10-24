import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  TrendingUp,
  Award,
  MessageCircle,
  Share2,
  User,
  ThumbsUp
} from "lucide-react";

const SellerProfile = () => {
  const { seller } = useParams();

  // Mock seller data
  const sellerData = {
    name: seller || "Digital Elite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=seller1",
    banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
    verified: true,
    rating: 4.9,
    totalSales: 1250,
    totalReviews: 876,
    memberSince: "January 2023",
    location: "United States",
    responseTime: "< 1 hour",
    description: "Premium digital marketplace seller specializing in verified social media accounts and gaming assets. Trusted by thousands of satisfied customers worldwide.",
    stats: [
      { label: "Total Sales", value: "1,250", icon: ShoppingBag },
      { label: "Positive Reviews", value: "98%", icon: ThumbsUp },
      { label: "Response Rate", value: "99%", icon: MessageCircle },
      { label: "Average Rating", value: "4.9", icon: Star },
    ],
  };

  const products = [
    {
      id: "sp1",
      name: "Premium Instagram Account - 50K",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      category: "Social Media",
      rating: 4.9,
      reviews: 145,
      featured: true,
    },
    {
      id: "sp2",
      name: "TikTok Creator Account - Verified",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
      category: "Social Media",
      rating: 4.8,
      reviews: 189,
      featured: false,
    },
    {
      id: "sp3",
      name: "YouTube Channel - 10K Subscribers",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
      category: "Social Media",
      rating: 4.7,
      reviews: 156,
      featured: false,
    },
  ];

  const reviews = [
    {
      id: 1,
      user: "John D.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
      rating: 5,
      date: "2 days ago",
      product: "Premium Instagram Account",
      comment: "Excellent seller! Fast delivery and great communication.",
    },
    {
      id: 2,
      user: "Sarah M.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
      rating: 5,
      date: "1 week ago",
      product: "TikTok Account",
      comment: "Very professional and trustworthy. Highly recommend!",
    },
    {
      id: 3,
      user: "Mike R.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
      rating: 4,
      date: "2 weeks ago",
      product: "YouTube Channel",
      comment: "Good experience overall. Product as described.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Banner */}
        <section className="relative h-64 overflow-hidden border-b border-border/30">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${sellerData.banner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        </section>

        {/* Profile Header */}
        <section className="relative -mt-20">
          <div className="container mx-auto px-4">
            <Card className="glass-card p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={sellerData.avatar} />
                  <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-foreground">{sellerData.name}</h1>
                    {sellerData.verified && (
                      <Badge className="badge-glow border-0">
                        ✓ Verified Seller
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-foreground/60 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(sellerData.rating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-foreground/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{sellerData.rating}</span>
                      <span>({sellerData.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{sellerData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {sellerData.memberSince}</span>
                    </div>
                  </div>

                  <p className="text-foreground/70 mb-4 max-w-2xl">
                    {sellerData.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button className="btn-glow">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button variant="outline" className="glass-card border-primary/30">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              {sellerData.stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="glass-card p-6 text-center">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-foreground/60">{stat.label}</p>
                  </Card>
                );
              })}
            </div>

            {/* Content Tabs */}
            <div className="mt-8">
              <Tabs defaultValue="products" className="space-y-6">
                <TabsList className="glass-card border border-border/30">
                  <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Button variant="outline" className="glass-card border-primary/30">
                      Load More Products
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="glass-card p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-foreground">{review.user}</h4>
                              <p className="text-sm text-foreground/60">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-foreground/20"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs mb-2">
                            {review.product}
                          </Badge>
                          <p className="text-foreground/70">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <div className="text-center">
                    <Button variant="outline" className="glass-card border-primary/30">
                      Load More Reviews
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="about">
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-black text-foreground mb-6">About This Seller</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-2">Overview</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          {sellerData.description} With over {sellerData.totalSales} successful transactions 
                          and a {sellerData.rating}-star rating, we pride ourselves on delivering quality products 
                          and exceptional customer service.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-2">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Social Media Accounts
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Gaming Assets
                          </Badge>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Digital Services
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-2">Policies</h3>
                        <ul className="space-y-2 text-foreground/70">
                          <li>• Instant delivery on all digital products</li>
                          <li>• 7-day money-back guarantee</li>
                          <li>• 24/7 customer support</li>
                          <li>• Verified and authentic products only</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerProfile;