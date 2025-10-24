import { useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useWishlist, useRemoveFromWishlist, useAddToCart } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Wishlist = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { data: wishlist, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist.mutate(productId, {
      onSuccess: () => {
        toast({
          title: t('removedFromWishlist') || "Removed from wishlist",
          description: t('itemRemovedFromWishlist') || "Item has been removed from your wishlist.",
        });
      },
    });
  };

  const handleAddToCart = (productId: number, productName: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: t('addedToCart') || "Added to cart!",
            description: `${productName} ${t('hasBeenAddedToCart') || 'has been added to your cart.'}`,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {t('myWishlist') || 'My Wishlist'}
            </h1>
            <p className="text-foreground/60">{t('loadingWishlist') || 'Loading your wishlist...'}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card p-4 animate-pulse">
                <div className="aspect-square bg-muted/30 rounded-lg mb-4" />
                <div className="h-4 bg-muted/30 rounded mb-2" />
                <div className="h-4 bg-muted/30 rounded w-2/3" />
              </Card>
            ))}
          </div>
        </div>
      </AccountLayout>
    );
  }

  const items = wishlist?.items || [];

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {t('myWishlist') || 'My Wishlist'}
            </h1>
            <p className="text-foreground/60">
              {items.length} {items.length === 1 ? t('item') || 'item' : t('items') || 'items'} {t('saved') || 'saved'}
            </p>
          </div>
          <Heart className="h-8 w-8 text-primary fill-primary" />
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <Card className="glass-card p-12 text-center">
            <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t('wishlistEmpty') || 'Your wishlist is empty'}
            </h3>
            <p className="text-foreground/60 mb-6">
              {t('wishlistEmptyDescription') || 'Start adding products to your wishlist to save them for later!'}
            </p>
            <Button asChild className="btn-glow">
              <Link to="/products">
                {t('browseProducts') || 'Browse Products'}
              </Link>
            </Button>
          </Card>
        )}

        {/* Wishlist Items */}
        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <Card key={item.id} className="glass-card overflow-hidden group">
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  <Link to={`/products/${item.id}`}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'}
                      alt={item.name}
                      className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-destructive hover:text-white backdrop-blur-sm"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={removeFromWishlist.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {item.category}
                    </Badge>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="font-semibold text-foreground">{item.rating}</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/products/${item.id}`}>
                    <h3 className="line-clamp-2 font-semibold text-base hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${item.price?.toFixed(2) || '0.00'}
                    </p>
                    {item.originalPrice && (
                      <p className="text-sm text-foreground/40 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full gap-2 btn-glow"
                    onClick={() => handleAddToCart(item.id, item.name)}
                    disabled={addToCart.isPending}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {addToCart.isPending ? t('adding') || 'Adding...' : t('addToCart') || 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Wishlist;

