import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/hooks/useApi";

const MobileNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { data: cart } = useCart();
  const cartItemsCount = cart?.items_count || 0;

  const navItems = [
    { path: "/", icon: Home, label: t('home') },
    { path: "/products", icon: Search, label: t('search') },
    { path: "/cart", icon: ShoppingCart, label: t('cart'), badge: cartItemsCount },
    { path: "/wishlist", icon: Heart, label: t('wishlist') },
    { path: "/account", icon: User, label: t('account') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/30 backdrop-blur-xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
