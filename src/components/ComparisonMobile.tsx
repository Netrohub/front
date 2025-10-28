import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Star } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface ComparisonProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  features: Record<string, string | number | boolean>;
}

interface ComparisonMobileProps {
  products: ComparisonProduct[];
  removeProduct: (id: string) => void;
}

/**
 * Mobile-optimized comparison view
 * Shows products in vertical cards instead of horizontal table
 */
export const ComparisonMobile: React.FC<ComparisonMobileProps> = ({ 
  products, 
  removeProduct 
}) => {
  return (
    <div className="md:hidden space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="glass-card p-4 relative">
          {/* Remove Button */}
          <button
            onClick={() => removeProduct(product.id)}
            className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground z-10 hover:bg-destructive/90 transition-colors"
            aria-label={`Remove ${product.name} from comparison`}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden mb-4">
            <OptimizedImage 
              src={product.image} 
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category Badge */}
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-2">
            {product.category}
          </Badge>

          {/* Product Name */}
          <h3 className="font-bold text-lg text-foreground mb-2 pr-8">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-foreground/20"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-foreground/60">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <span className="text-sm text-foreground/60 block mb-1">Price</span>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${product.price}
            </span>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {Object.entries(product.features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-foreground/60">{key}</span>
                <span className="font-semibold text-foreground text-sm">
                  {typeof value === 'boolean' 
                    ? (value ? '✓' : '✗')
                    : value
                  }
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Empty State */}
      {products.length === 0 && (
        <Card className="glass-card p-8 text-center">
          <p className="text-foreground/60">No products to compare</p>
        </Card>
      )}
    </div>
  );
};

export default ComparisonMobile;

