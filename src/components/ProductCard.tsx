import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { MobileIconButton } from "@/components/ui/mobile-icon-button";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  subcategory?: string;
  platform?: string;
  level?: string;
  type?: string;
  images: string[];
  tags?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showStatus?: boolean;
}

const ProductCard = ({ product, variant = "default", showStatus = false }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Safety check: if product is undefined or null, return null
  if (!product) {
    console.warn('ProductCard: product is undefined or null');
    return null;
  }

  const displayPrice = product.discount_price || product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const fallbackImage = `https://api.dicebear.com/7.x/shapes/svg?seed=${product.title || 'product'}`;
  const productImage = product.images && product.images.length > 0 && !imageError 
    ? product.images[0] 
    : fallbackImage;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'pending':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'sold':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const cardClasses = {
    default: "group hover:scale-[1.02] transition-all duration-300",
    compact: "group hover:scale-[1.01] transition-all duration-200",
    featured: "group hover:scale-[1.03] transition-all duration-300 ring-2 ring-primary/20"
  };

  const imageClasses = {
    default: "h-48",
    compact: "h-32",
    featured: "h-56"
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className={`glass-card overflow-hidden ${cardClasses[variant]} relative`}>
        {/* Product Image */}
        <div className={`relative ${imageClasses[variant]} overflow-hidden`}>
          <OptimizedImage
            src={productImage}
            alt={product.title}
            fallback={fallbackImage}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-xs">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Status Badge */}
          {showStatus && (
            <Badge className={`absolute top-2 right-2 text-xs ${getStatusColor(product.status)}`}>
              {product.status}
            </Badge>
          )}

          {/* Wishlist Button */}
          <MobileIconButton
            variant="ghost"
            className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground/60'}`} />
          </MobileIconButton>

          {/* Platform/Type Badge */}
          {product.platform && (
            <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs bg-background/80">
              {product.platform}
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Category & Level */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.level && (
              <Badge variant="outline" className="text-xs">
                Level {product.level}
              </Badge>
            )}
          </div>

          {/* Description */}
          {variant !== "compact" && (
            <p className="text-xs text-foreground/60 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-foreground/50 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-foreground/60">4.8</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && variant === "featured" && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-foreground/50">
            <span>
              {new Date(product.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>234</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;