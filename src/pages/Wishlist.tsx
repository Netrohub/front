import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const wishlistItems = [
  {
    id: "w1",
    name: "Premium Instagram Account - 50K",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    category: "Social Media",
    rating: 4.9,
    reviews: 145,
    featured: false,
    addedDate: "2 days ago",
  },
  {
    id: "w2",
    name: "Steam Account - 200+ Games",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    category: "Gaming",
    rating: 4.8,
    reviews: 234,
    featured: false,
    addedDate: "1 week ago",
  },
  {
    id: "w3",
    name: "YouTube Channel - 10K Subscribers",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80",
    category: "Social Media",
    rating: 4.7,
    reviews: 156,
    featured: false,
    addedDate: "2 weeks ago",
  },
];

const Wishlist = () => {
  const { t } = useLanguage();
  
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
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                {t('myWishlist')}
              </h1>
              <p className="text-foreground/60 mb-6">
                {wishlistItems.length} {t('itemsSavedForLater')}
              </p>
              <div className="flex justify-center gap-3">
                <Button size="lg" className="btn-glow">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('addAllToCart')}
                </Button>
                <Button size="lg" variant="outline" className="glass-card border-primary/30">
                  <Trash2 className="h-5 w-5 mr-2" />
                  {t('clearWishlist')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Wishlist Items */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {wishlistItems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <ProductCard {...item} />
                    <button className="absolute top-3 right-3 p-2 rounded-full glass-card border border-destructive/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="glass-card p-12 text-center max-w-2xl mx-auto">
                <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                  <Heart className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">{t('yourWishlistIsEmpty')}</h2>
                <p className="text-foreground/60 mb-6">
                  {t('startAddingProducts')}
                </p>
                <Button size="lg" className="btn-glow">
                  {t('browseProducts')}
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

export default Wishlist;