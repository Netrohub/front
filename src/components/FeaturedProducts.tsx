import ProductCard from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";

const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Audio",
    rating: 4.8,
    reviews: 234,
    featured: true,
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Wearables",
    rating: 4.6,
    reviews: 189,
    featured: true,
  },
  {
    id: "3",
    name: "Professional Camera Kit",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    category: "Photography",
    rating: 4.9,
    reviews: 156,
    featured: true,
  },
  {
    id: "4",
    name: "Gaming Laptop Ultra",
    price: 1899.99,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    category: "Computers",
    rating: 4.7,
    reviews: 342,
    featured: false,
  },
  {
    id: "5",
    name: "Wireless Mechanical Keyboard",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    category: "Electronics",
    rating: 4.5,
    reviews: 278,
    featured: false,
  },
  {
    id: "6",
    name: "4K Action Camera",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80",
    category: "Photography",
    rating: 4.8,
    reviews: 167,
    featured: false,
  },
];

const FeaturedProducts = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center space-y-3">
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('featuredAccounts')}
          </h2>
          <p className="text-foreground/60 text-lg">{t('premiumVerified')}</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
