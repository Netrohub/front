import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart, useRemoveFromCart } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

// Removed hardcoded cart items - now using real cart data

const Cart = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();

  // Use real cart data
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const serviceFee = cart?.service_fee || 0;
  const total = cart?.total || 0;

  const handleRemoveItem = (itemId: number) => {
    removeFromCart.mutate(itemId, {
      onSuccess: () => {
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        });
      },
    });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simple coupon validation (replace with real API call)
      const validCoupons = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'SAVE20': { discount: 20, type: 'percentage' },
        'FIRST5': { discount: 5, type: 'dollar' }
      };
      
      const coupon = validCoupons[couponCode.toUpperCase()];
      
      if (!coupon) {
        throw new Error('Invalid coupon code');
      }
      
      toast({
        title: "Coupon applied!",
        description: `Coupon "${couponCode.toUpperCase()}" has been applied. ${coupon.discount}${coupon.type === 'percentage' ? '%' : '$'} discount.`,
      });
      setCouponCode("");
    } catch (error: any) {
      toast({
        title: "Invalid Coupon",
        description: error.message || "Please check with admin for valid coupons.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              {t('shoppingCart')}
            </h1>
            <p className="text-foreground/60">{items.length} {t('itemsInCart')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <Card className="glass-card p-8 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <ShoppingBag className="h-12 w-12 text-foreground/40" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h3>
                      <p className="text-foreground/60 mb-4">Add some products to get started!</p>
                      <Button asChild>
                        <Link to="/products">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {t('continueShopping')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                items.map((item: any) => (
                  <Card key={item.id} className="glass-card p-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                        <img
                          src={item.product?.images?.[0] || item.product?.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80'}
                          alt={item.product?.title || item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">
                              {item.product?.title || item.product?.name || 'Product'}
                            </h3>
                            <p className="text-sm text-foreground/60">
                              by {item.product?.seller?.name || 'Seller'}
                            </p>
                            <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                              {item.product?.category || 'Category'}
                            </Badge>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeFromCart.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-foreground/60">Quantity: {item.quantity}</span>
                          <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}

              {/* Coupon Code */}
              <Card className="glass-card p-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      placeholder={t('enterCouponCode')}
                      className="pl-10 glass-card border-border/50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="glass-card border-primary/30 hover:border-primary/50"
                    onClick={handleApplyCoupon}
                  >
                    {t('apply')}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">{t('orderSummary')}</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>{t('subtotal')}</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>{t('serviceFee')} (3%)</span>
                    <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border/30 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">{t('total')}</span>
                      <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full btn-glow mb-3" size="lg">
                    {t('proceedToCheckout')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link to="/products">
                  <Button variant="outline" className="w-full glass-card border-border/50" size="lg">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t('continueShopping')}
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-border/30 space-y-3 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{t('secureCheckout')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{t('instantDelivery')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span>{t('moneyBackGuarantee')}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
