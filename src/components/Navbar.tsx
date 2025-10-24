import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, LogOut, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get accurate cart count
  const cartCount = cart?.items?.length || 0;

  // Load avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      setAvatar(user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user");
    }

    // Listen for avatar changes (when user uploads new avatar)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_avatar' && e.newValue) {
        setAvatar(e.newValue);
      }
    };

    // Custom event for same-tab avatar updates
    const handleAvatarUpdate = () => {
      const updatedAvatar = localStorage.getItem('user_avatar');
      if (updatedAvatar) {
        setAvatar(updatedAvatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarUpdated', handleAvatarUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, [user?.avatar]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      analytics.customEvent('search', { query: searchQuery.trim() });
    }
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    
    const loadingToast = toast.loading('🚪 Signing out...');
    
    try {
      await logout();
      
      toast.dismiss(loadingToast);
      toast.success('👋 Logged out successfully!', {
        description: 'See you next time!',
        duration: 2000,
      });
      
      analytics.customEvent('logout');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Logout failed');
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 glass-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded-lg gradient-primary blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-primary-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
                Nexo
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group">
                {t('home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/products" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group">
                {t('products')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/members" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group">
                {t('members')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
              <Link to="/leaderboard" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors relative group">
                {t('leaderboard')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
              <Input
                type="search"
                placeholder={t('searchPlaceholder') || "Search game accounts, social accounts..."}
                className="w-full pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-muted/70 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Mobile Search */}
          <div className="flex lg:hidden flex-1 max-w-xs mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-muted/70 transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            
            {/* Sell Button - Mobile Only */}
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="md:hidden glass-card border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Link to="/seller/onboarding">
                <span className="text-sm font-medium">Sell</span>
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatar || user?.avatar || ""} alt={user?.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border-border/50" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('myAccount')}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account/wishlist" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>My Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.roles?.includes('seller') && (
                      <DropdownMenuItem asChild>
                        {user?.subscription?.plan === 'Elite' ? (
                          <Link to="/seller/dashboard" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('sellerDashboard')}</span>
                          </Link>
                        ) : (
                          <div className="cursor-not-allowed opacity-50" title="Elite plan required">
                            <User className="mr-2 h-4 w-4" />
                            <span>{t('sellerDashboard')} (Elite Only)</span>
                          </div>
                        )}
                      </DropdownMenuItem>
                    )}
                    {user?.roles?.includes('admin') && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/disputes" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">{t('login')}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">{t('register')}</Link>
                </Button>
              </>
            )}
            
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 glass-card">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
                <Link 
                  to="/products" 
                  className="block px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('products')}
                </Link>
                <Link 
                  to="/members" 
                  className="block px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('members')}
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="block px-4 py-3 rounded-lg text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('leaderboard')}
                </Link>
              </div>

              {/* Mobile Auth Section */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-border/30 space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      {t('login')}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      {t('register')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
