import ProductCard from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

const FeaturedProducts = () => {
  const { t } = useLanguage();
  const { data: productsData, isLoading, error } = useProducts({ featured: true, per_page: 6 });
  
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">Failed to load featured products</p>
            <p className="text-foreground/60 mt-2">Please try again later</p>
          </div>
        ) : productsData && productsData.data.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="text-foreground/60 text-lg">No featured products available</p>
            <p className="text-foreground/40 mt-2">Check back later for new featured items</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
