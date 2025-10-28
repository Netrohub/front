import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, LogOut, Heart, Menu, X, Store } from "lucide-react";
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
import gtmAnalytics from "@/lib/gtm";

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

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
      gtmAnalytics.search(searchQuery.trim());
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
      
      gtmAnalytics.logout();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Logout failed');
    }
  };
  
  return (
    <>
      {/* Mobile Header - Dropdown Navigation */}
      <nav className="md:hidden sticky top-0 z-50 w-full border-b border-border/50 glass-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 glass-card shadow-lg z-50 max-h-[80vh] overflow-y-auto">
              <div className="container mx-auto px-4 py-4">
                {/* Search Bar */}
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70" />
                    <Input
                      type="search"
                      placeholder={t('searchPlaceholder') || "Search..."}
                      className="w-full pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:bg-muted/70 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  <Link
                    to="/"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-foreground/70">{t('home')}</span>
                  </Link>
                  <Link
                    to="/products"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-foreground/70">{t('products')}</span>
                  </Link>
                  <Link
                    to="/members"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-foreground/70">{t('members')}</span>
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-foreground/70">{t('leaderboard')}</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-sm font-medium text-foreground/70">{t('wishlist')}</span>
                  </Link>
                </div>

                {/* User Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    
                    {isAuthenticated ? (
                      <>
                        <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10">
                          <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                            <ShoppingCart className="h-4 w-4" />
                            {cartCount > 0 && (
                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                                {cartCount}
                              </span>
                            )}
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                              <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarImage 
                                  src={avatar || user?.avatar || ""} 
                                  alt={user?.name || ""} 
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                                  {user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-64 glass-card border-border/50" align="end" forceMount>
                            <div className="flex items-center justify-start gap-3 p-3">
                              <Avatar className="h-10 w-10 border border-primary/20">
                                <AvatarImage 
                                  src={avatar || user?.avatar || ""} 
                                  alt={user?.name || ""} 
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                  {user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col space-y-1 leading-none">
                                <p className="font-medium text-sm">{user?.name}</p>
                                <p className="w-[200px] truncate text-xs text-muted-foreground">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link to={`/@${user?.username}`} className="cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                                <User className="mr-2 h-4 w-4" />
                                <span>View Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/dashboard" className="cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                                <User className="mr-2 h-4 w-4" />
                                <span>{t('myAccount')}</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/account/wishlist" className="cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                                <Heart className="mr-2 h-4 w-4" />
                                <span>My Wishlist</span>
                              </Link>
                            </DropdownMenuItem>
                            {user?.roles?.includes('seller') && (
                              <DropdownMenuItem asChild>
                                <Link to="/dashboard?tab=seller" className="cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                                  <User className="mr-2 h-4 w-4" />
                                  <span>{t('sellerDashboard')}</span>
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {user?.roles?.includes('admin') && (
                              <DropdownMenuItem asChild>
                                <Link to="/admin/disputes" className="cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
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
                      <div className="flex gap-2">
                        <Button asChild variant="ghost" size="sm" className="text-sm px-3 h-10" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/login">{t('login')}</Link>
                        </Button>
                        <Button asChild size="sm" className="text-sm px-3 h-10" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/register">{t('register')}</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Header - Full navigation */}
      <nav className="hidden md:block sticky top-0 z-50 w-full border-b border-border/50 glass-card">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
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
            
            {/* Navigation Links */}
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

            {/* Search Bar */}
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

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <>
                  <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors h-10 w-10">
                    <Link to="/cart">
                      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatar || user?.avatar || ""} alt={user?.name || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
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
                          <Link to="/dashboard?tab=seller" className="cursor-pointer">
                            <Store className="mr-2 h-4 w-4" />
                            <span>{t('sellerDashboard')}</span>
                          </Link>
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
                  <Button asChild variant="ghost" size="sm" className="text-sm px-3 h-10">
                    <Link to="/login">{t('login')}</Link>
                  </Button>
                  <Button asChild size="sm" className="text-sm px-3 h-10">
                    <Link to="/register">{t('register')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
