import React, { useState, useCallback, useMemo, memo, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  CreditCard,
  Tag,
  Ticket,
  FileText,
  Search,
  Menu,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Listings', href: '/admin/listings', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Disputes', href: '/admin/disputes', icon: AlertTriangle },
  { name: 'Payouts', href: '/admin/payouts', icon: CreditCard },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load theme from localStorage
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | null;
    return savedTheme || 'light';
  });

  // Load locale from localStorage
  const [locale, setLocaleState] = useState<'en' | 'ar'>(() => {
    const savedLocale = localStorage.getItem('admin-locale') as 'en' | 'ar' | null;
    return savedLocale || 'en';
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  // Apply locale on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
    localStorage.setItem('admin-locale', locale);
  }, [locale]);

  const handleLogout = async () => {
    // Clear auth tokens from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('refresh_token');
    
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Global search functionality
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['admin-global-search', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { users: [], products: [], orders: [] };
      
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.allSettled([
          apiClient.request<any>('/admin/users?search=' + encodeURIComponent(searchQuery) + '&per_page=5'),
          apiClient.request<any>('/admin/products?search=' + encodeURIComponent(searchQuery) + '&limit=5'),
          apiClient.request<any>('/admin/orders?search=' + encodeURIComponent(searchQuery) + '&per_page=5'),
        ]);

        return {
          users: usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [],
          products: productsRes.status === 'fulfilled' ? (productsRes.value.data || []) : [],
          orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data || []) : [],
        };
      } catch {
        return { users: [], products: [], orders: [] };
      }
    },
    enabled: searchQuery.length >= 2,
    staleTime: 30 * 1000,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to a search results page or handle search
      toast.info('Search', {
        description: `Searching for "${searchQuery}"...`,
      });
      // Could navigate to a search results page: navigate(`/admin/search?q=${searchQuery}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
  }, [theme]);

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocaleState(newLocale);
  }, [locale]);

  const handleProfileClick = () => {
    // Navigate to admin profile page or open profile modal
    navigate('/admin/profile');
  };

  const handleSettingsClick = () => {
    // Navigate to admin settings page
    navigate('/admin/settings');
  };

  // Memoize navigation click handler
  const handleNavClick = useCallback((href: string) => {
    navigate(href);
    setSidebarOpen(false);
  }, [navigate]);

  // Memoize SidebarContent component to prevent re-renders
  const SidebarContent = useMemo(() => {
    const SidebarComponent = () => (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => handleNavClick(item.href)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>
    );
    return SidebarComponent;
  }, [location.pathname, handleNavClick]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex h-screen">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <Card className="flex flex-col h-full">
            <SidebarContent />
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-background border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
                
                <div className="flex-1 max-w-md relative">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search users, products, orders..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow clicks
                      onKeyDown={handleSearchKeyDown}
                    />
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {isSearchFocused && searchQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 text-center text-muted-foreground">Searching...</div>
                      ) : searchResults && (searchResults.users.length > 0 || searchResults.products.length > 0 || searchResults.orders.length > 0) ? (
                        <div className="p-2">
                          {searchResults.users.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Users</div>
                              {searchResults.users.map((user: any) => (
                                <button
                                  key={user.id}
                                  className="w-full px-3 py-2 text-left hover:bg-muted rounded flex items-center gap-2"
                                  onClick={() => {
                                    navigate(`/admin/users/${user.id}`);
                                    setSearchQuery('');
                                    setIsSearchFocused(false);
                                  }}
                                >
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {searchResults.products.length > 0 && (
                            <div className="mb-2">
                              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Products</div>
                              {searchResults.products.map((product: any) => (
                                <button
                                  key={product.id}
                                  className="w-full px-3 py-2 text-left hover:bg-muted rounded flex items-center gap-2"
                                  onClick={() => {
                                    navigate(`/admin/listings/${product.id}`);
                                    setSearchQuery('');
                                    setIsSearchFocused(false);
                                  }}
                                >
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">{product.name || product.title}</div>
                                    <div className="text-sm text-muted-foreground">${product.price}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {searchResults.orders.length > 0 && (
                            <div>
                              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Orders</div>
                              {searchResults.orders.map((order: any) => (
                                <button
                                  key={order.id}
                                  className="w-full px-3 py-2 text-left hover:bg-muted rounded flex items-center gap-2"
                                  onClick={() => {
                                    navigate(`/admin/orders/${order.id}`);
                                    setSearchQuery('');
                                    setIsSearchFocused(false);
                                  }}
                                >
                                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <div className="font-medium">Order #{order.order_number || order.id}</div>
                                    <div className="text-sm text-muted-foreground">${order.total_amount || order.amount}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : searchQuery.length >= 2 ? (
                        <div className="p-4 text-center text-muted-foreground">No results found</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Locale toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLocale}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  {locale.toUpperCase()}
                </Button>

                {/* Theme toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="hidden sm:block">Admin</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default memo(AdminLayout);
