import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal,
  TrendingUp,
  Star,
  ShoppingBag,
  Instagram,
  Youtube,
  MessageCircle
} from "lucide-react";

const categoryData = {
  "social-media": {
    name: "Social Media Accounts",
    description: "Premium verified social media accounts with real followers and engagement",
    icon: Instagram,
    color: "from-pink-500 to-purple-600",
    stats: {
      listings: "2,450",
      avgPrice: "$399",
      topSeller: "Digital Elite",
    },
    subcategories: [
      { name: "Instagram", icon: "📸", count: 850 },
      { name: "TikTok", icon: "🎵", count: 620 },
      { name: "YouTube", icon: "▶️", count: 480 },
      { name: "Twitter/X", icon: "🐦", count: 350 },
      { name: "Facebook", icon: "👥", count: 150 },
    ],
  },
  gaming: {
    name: "Gaming Accounts",
    description: "High-level gaming accounts, rare items, and exclusive content",
    icon: ShoppingBag,
    color: "from-blue-500 to-cyan-600",
    stats: {
      listings: "3,120",
      avgPrice: "$299",
      topSeller: "Game Masters",
    },
    subcategories: [
      { name: "Steam", icon: "🎮", count: 1200 },
      { name: "PlayStation", icon: "🎯", count: 850 },
      { name: "Xbox", icon: "🎪", count: 680 },
      { name: "Epic Games", icon: "⚡", count: 390 },
    ],
  },
};

const products = [
  {
    id: "cat1",
    name: "Premium Instagram Account - 50K",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 145,
    featured: true,
  },
  {
    id: "cat2",
    name: "TikTok Creator Account - Verified",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    category: "Social Media",
    rating: 4.8,
    reviews: 189,
    featured: false,
  },
  {
    id: "cat3",
    name: "YouTube Channel - 10K Subscribers",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    category: "Social Media",
    rating: 4.7,
    reviews: 156,
    featured: false,
  },
  {
    id: "cat4",
    name: "Twitter Verified Account",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 167,
    featured: true,
  },
  {
    id: "cat5",
    name: "Instagram Business Account - 100K",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80",
    category: "Social Media",
    rating: 4.8,
    reviews: 234,
    featured: false,
  },
  {
    id: "cat6",
    name: "TikTok - 50K Followers",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
    category: "Social Media",
    rating: 4.6,
    reviews: 123,
    featured: false,
  },
];

const CategoryLanding = () => {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = categoryData[category as keyof typeof categoryData] || categoryData["social-media"];
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-60" />
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br ${categoryInfo.color} opacity-20 rounded-full blur-[120px] animate-pulse`} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className={`inline-flex p-4 rounded-xl glass-card border border-primary/30 bg-gradient-to-br ${categoryInfo.color} bg-opacity-10`}>
                <CategoryIcon className="h-10 w-10 text-primary" />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {categoryInfo.name}
              </h1>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                {categoryInfo.description}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                  <Input
                    type="search"
                    placeholder={`Search ${categoryInfo.name.toLowerCase()}...`}
                    className="w-full pl-12 pr-4 h-14 glass-card border-primary/30 focus:border-primary/50 text-base"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto">
                <Card className="glass-card p-4">
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {categoryInfo.stats.listings}
                  </p>
                  <p className="text-xs text-foreground/60">Active Listings</p>
                </Card>
                <Card className="glass-card p-4">
                  <p className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {categoryInfo.stats.avgPrice}
                  </p>
                  <p className="text-xs text-foreground/60">Average Price</p>
                </Card>
                <Card className="glass-card p-4">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <p className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      4.8
                    </p>
                  </div>
                  <p className="text-xs text-foreground/60">Avg Rating</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="py-12 border-b border-border/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-black text-foreground mb-6">Browse by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {categoryInfo.subcategories.map((sub) => (
                <Card
                  key={sub.name}
                  className="glass-card p-4 text-center cursor-pointer hover:scale-105 transition-all group"
                >
                  <div className="text-3xl mb-2">{sub.icon}</div>
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {sub.name}
                  </h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {sub.count}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-8 glass-card p-4 rounded-lg">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                  <Button variant="outline" size="sm" className="glass-card border-primary/30">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    All Filters
                  </Button>
                  
                  <Select defaultValue="all-prices">
                    <SelectTrigger className="w-[180px] glass-card border-primary/30">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all-prices">All Prices</SelectItem>
                      <SelectItem value="under-100">Under $100</SelectItem>
                      <SelectItem value="100-300">$100 - $300</SelectItem>
                      <SelectItem value="300-500">$300 - $500</SelectItem>
                      <SelectItem value="over-500">Over $500</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-followers">
                    <SelectTrigger className="w-[180px] glass-card border-primary/30">
                      <SelectValue placeholder="Followers" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="all-followers">All Followers</SelectItem>
                      <SelectItem value="10k-50k">10K - 50K</SelectItem>
                      <SelectItem value="50k-100k">50K - 100K</SelectItem>
                      <SelectItem value="over-100k">Over 100K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select defaultValue="featured">
                  <SelectTrigger className="w-[180px] glass-card border-primary/30">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            <div className="mb-6">
              <p className="text-foreground/60">
                Showing <span className="text-foreground font-semibold">{products.length}</span> of{" "}
                <span className="text-foreground font-semibold">{categoryInfo.stats.listings}</span> products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <Button size="lg" className="btn-glow">
                <TrendingUp className="h-4 w-4 mr-2" />
                Load More Products
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryLanding;
