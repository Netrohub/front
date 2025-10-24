import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { getCategoryImage } from "@/lib/categoryImages";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrefetch } from "@/hooks/usePrefetch";
import { useAddToCart } from "@/hooks/useApi";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

const ProductCard = ({ id, name, price, image, category, rating, reviews, featured }: ProductCardProps) => {
  const { t } = useLanguage();
  const { prefetchProduct } = usePrefetch();
  const addToCart = useAddToCart();
  
  // Use category-based image instead of product-specific image
  const displayImage = getCategoryImage(category, image);
  
  // Prefetch product data on hover
  const handleMouseEnter = () => {
    if (typeof id === 'number') {
      prefetchProduct(id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation();
    
    const productId = typeof id === 'string' ? parseInt(id) : id;
    addToCart.mutate({ productId, quantity: 1 });
  };
  
  return (
    <Link to={`/products/${id}`} onMouseEnter={handleMouseEnter}>
      <Card className="glass-card overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform touch-target min-h-[44px]">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          <img
            src={displayImage}
            alt={category}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          {featured && (
            <Badge className="absolute left-2 top-2 sm:left-3 sm:top-3 badge-glow border-0 font-semibold text-xs sm:text-sm">
              ⭐ {t('featured')}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-2 sm:p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-[9px] sm:text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-1.5 sm:px-2 py-0.5">
              {category}
            </Badge>
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-semibold text-foreground text-xs sm:text-sm">{rating}</span>
              <span className="text-muted-foreground text-[9px] sm:text-[10px]">({reviews})</span>
            </div>
          </div>
          <h3 className="line-clamp-2 font-semibold text-xs sm:text-sm group-hover:text-primary transition-colors min-h-[2rem] sm:min-h-[2.5rem] leading-tight">{name}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 sm:p-3 pt-0">
        <Button 
          className="w-full gap-2 btn-glow text-xs sm:text-sm h-8 sm:h-9 min-h-[44px] touch-target"
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
        >
          <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          {addToCart.isPending ? t('adding') || 'Adding...' : t('addToCart')}
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default ProductCard;
