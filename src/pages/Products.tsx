import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronDown,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/hooks/useApi";
import { ProductFilters } from "@/lib/api";

const products = [
  {
    id: "p1",
    name: "Premium Instagram Account - 50K",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 145,
    featured: true,
  },
  {
    id: "p2",
    name: "Steam Account - 200+ Games",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    category: "Gaming",
    rating: 4.8,
    reviews: 234,
    featured: true,
  },
  {
    id: "p3",
    name: "TikTok Creator Account - Verified",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 189,
    featured: false,
  },
  {
    id: "p4",
    name: "YouTube Channel - 10K Subscribers",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    category: "Social Media",
    rating: 4.7,
    reviews: 156,
    featured: false,
  },
  {
    id: "p5",
    name: "PlayStation Plus - 3 Years Premium",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    category: "Gaming",
    rating: 4.8,
    reviews: 298,
    featured: false,
  },
  {
    id: "p6",
    name: "Twitter Verified Account",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 167,
    featured: true,
  },
  {
    id: "p7",
    name: "Discord Server - 5K Members",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&q=80",
    category: "Social Media",
    rating: 4.6,
    reviews: 123,
    featured: false,
  },
  {
    id: "p8",
    name: "Epic Games - Fortnite Rare Account",
    price: 699.99,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    category: "Gaming",
    rating: 4.8,
    reviews: 342,
    featured: false,
  },
  {
    id: "p9",
    name: "Spotify Premium Family - 2 Years",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=800&q=80",
    category: "Digital Services",
    rating: 4.7,
    reviews: 234,
    featured: false,
  },
];

const categories = [
  "All Products",
  "Social Accounts",
  "Gaming Accounts",
];

const priceRanges = [
  "All Prices",
  "Under $100",
  "$100 - $300",
  "$300 - $500",
  "Over $500",
];

const Products = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all-products");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all-prices");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Build filters for API
  const filters: ProductFilters = useMemo(() => {
    const apiFilters: ProductFilters = {
      page: currentPage,
      per_page: 12,
    };

    if (searchQuery) {
      apiFilters.search = searchQuery;
    }

    if (selectedCategory !== "all-products") {
      apiFilters.category = selectedCategory;
    }

    if (selectedPriceRange !== "all-prices") {
      switch (selectedPriceRange) {
        case "under-$100":
          apiFilters.max_price = 100;
          break;
        case "$100---$300":
          apiFilters.min_price = 100;
          apiFilters.max_price = 300;
          break;
        case "$300---$500":
          apiFilters.min_price = 300;
          apiFilters.max_price = 500;
          break;
        case "over-$500":
          apiFilters.min_price = 500;
          break;
      }
    }

    // Map sort options to API format
    switch (sortBy) {
      case "price-low":
        apiFilters.sort = "price_asc";
        break;
      case "price-high":
        apiFilters.sort = "price_desc";
        break;
      case "rating":
        apiFilters.sort = "rating";
        break;
      case "newest":
        apiFilters.sort = "newest";
        break;
      default:
        apiFilters.featured = true;
        break;
    }

    return apiFilters;
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, currentPage]);

  const { data: productsData, isLoading, error } = useProducts(filters);

  const clearFilter = (filterType: string) => {
    if (filterType === "category") setSelectedCategory("all-products");
    if (filterType === "price") setSelectedPriceRange("all-prices");
  };

  const activeFilters = [];
  if (selectedCategory !== "all-products") {
    const categoryName = categories.find(cat => 
      cat.toLowerCase().replace(" ", "-") === selectedCategory
    );
    if (categoryName) activeFilters.push({ type: "category", label: categoryName });
  }
  if (selectedPriceRange !== "all-prices") {
    const priceName = priceRanges.find(range => 
      range.toLowerCase().replace(" ", "-") === selectedPriceRange
    );
    if (priceName) activeFilters.push({ type: "price", label: priceName });
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-40" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 text-center">
                {t('allProducts')}
              </h1>
              <p className="text-center text-foreground/60 mb-8 text-sm sm:text-base">
                {t('browseProducts')}
              </p>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-12 pr-4 h-12 glass-card border-primary/30 focus:border-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="mb-8 glass-card p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="glass-card border-primary/30"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    {t('filters')} {showFilters ? '▼' : '▶'}
                  </Button>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[160px] glass-card border-primary/30">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase().replace(" ", "-")}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger className="w-full sm:w-[160px] glass-card border-primary/30">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range.toLowerCase().replace(" ", "-")}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[160px] glass-card border-primary/30">
                      <SelectValue placeholder={t('sortBy')} />
                    </SelectTrigger>
                    <SelectContent className="glass-card">
                      <SelectItem value="featured">{t('featured')}</SelectItem>
                      <SelectItem value="price-low">{t('priceLowToHigh')}</SelectItem>
                      <SelectItem value="price-high">{t('priceHighToLow')}</SelectItem>
                      <SelectItem value="rating">{t('highestRated')}</SelectItem>
                      <SelectItem value="newest">{t('newestFirst')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className={`glass-card ${viewMode === 'grid' ? 'border-primary bg-primary/10' : 'border-primary/30'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className={`glass-card ${viewMode === 'list' ? 'border-primary bg-primary/10' : 'border-primary/30'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {activeFilters.map((filter) => (
                    <Badge key={filter.type} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {filter.label}
                      <button 
                        className="ml-2 hover:text-primary/70"
                        onClick={() => clearFilter(filter.type)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Advanced Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                      <Select>
                        <SelectTrigger className="glass-card border-primary/30">
                          <SelectValue placeholder="Any Rating" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="4+">4+ Stars</SelectItem>
                          <SelectItem value="3+">3+ Stars</SelectItem>
                          <SelectItem value="2+">2+ Stars</SelectItem>
                          <SelectItem value="1+">1+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Seller Type</label>
                      <Select>
                        <SelectTrigger className="glass-card border-primary/30">
                          <SelectValue placeholder="Any Seller" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="verified">Verified Sellers</SelectItem>
                          <SelectItem value="premium">Premium Sellers</SelectItem>
                          <SelectItem value="new">New Sellers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Availability</label>
                      <Select>
                        <SelectTrigger className="glass-card border-primary/30">
                          <SelectValue placeholder="Any Status" />
                        </SelectTrigger>
                        <SelectContent className="glass-card">
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" className="glass-card border-primary/30">
                      Clear All
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-foreground/60">
                {isLoading ? (
                  <span>Loading...</span>
                ) : productsData ? (
                  <>
                    {t('showing')} <span className="text-foreground font-semibold">{productsData.data.length}</span> {t('of')} <span className="text-foreground font-semibold">{productsData.meta.total}</span> {t('productsText')}
                  </>
                ) : (
                  <span>No products found</span>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">Failed to load products</p>
                <p className="text-foreground/60 mt-2">Please try again later</p>
              </div>
            ) : productsData && productsData.data.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid gap-4 grid-cols-1"}>
                {productsData.data.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.title}
                    price={product.price}
                    image={product.images[0] || "/placeholder.svg"}
                    category={product.category}
                    rating={product.rating}
                    reviews={product.reviews_count}
                    featured={product.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">{t('noProductsFound')}</p>
              </div>
            )}

            {/* Load More */}
            {productsData && productsData.meta.last_page > currentPage && (
              <div className="mt-12 text-center">
                <Button 
                  size="lg" 
                  className="btn-glow"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  {t('loadMore')}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
