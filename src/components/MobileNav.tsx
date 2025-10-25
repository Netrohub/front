import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/useApi";
import { useState } from "react";

const MobileNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { data: cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemsCount = cart?.items_count || 0;

  // Primary navigation items (most important - bottom row)
  const primaryNavItems = [
    { path: "/", icon: Home, label: t('home') },
    { path: "/products", icon: Search, label: t('search') },
    { path: "/cart", icon: ShoppingCart, label: t('cart'), badge: cartItemsCount },
    { path: "/account", icon: User, label: t('account') },
  ];

  // Secondary navigation items (less important - top row)
  const secondaryNavItems = [
    { path: "/wishlist", icon: Heart, label: t('wishlist') },
    { path: "/leaderboard", icon: Menu, label: t('leaderboard') },
  ];

  return (
    <>
      {/* Secondary Navigation (Top) */}
      <nav className="md:hidden fixed top-16 left-0 right-0 z-40 glass-card border-b border-border/30 backdrop-blur-xl">
        <div className="flex justify-center items-center h-12 px-4">
          <div className="flex items-center gap-6">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Primary Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/30 backdrop-blur-xl">
        <div className="grid grid-cols-4 h-16">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 relative min-h-[44px] min-w-[44px] ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground shadow-lg">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
