import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isValidTab, VALID_TAB_IDS, type DashboardTab } from "@/lib/dashboardUtils";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store,
  User,
  Wallet,
  Bell,
  CreditCard,
  Shield
} from "lucide-react";
import { useEffect, useMemo } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get current tab from URL params, default to 'overview'
  const currentTab = (searchParams.get('tab') || 'overview') as DashboardTab;
  
  // Check if user has seller role (has any active or pending listings)
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if user has active products - this would come from API but for now using role
  const hasActiveListings = hasSellingsRole;
  
  // Memoize tabs array to prevent unnecessary re-renders
  // Only recreate when hasActiveListings changes
  const tabs = useMemo(() => {
    const baseTabs = [
      // Main Dashboard Tabs
      {
        id: 'overview' as const,
        label: 'Overview',
        icon: LayoutDashboard,
        description: 'Dashboard summary',
        category: 'main'
      },
      {
        id: 'buyer' as const,
        label: 'Buyer',
        icon: ShoppingBag,
        description: 'Orders and purchases',
        category: 'main'
      },
      // Account Management Tabs
      {
        id: 'profile' as const,
        label: 'Profile',
        icon: User,
        description: 'Account settings',
        category: 'account'
      },
      {
        id: 'orders' as const,
        label: 'Orders',
        icon: ShoppingBag,
        description: 'Order history',
        category: 'account'
      },
      {
        id: 'wallet' as const,
        label: 'Wallet',
        icon: Wallet,
        description: 'Balance & transactions',
        category: 'account'
      },
      {
        id: 'notifications' as const,
        label: 'Notifications',
        icon: Bell,
        description: 'Alerts & messages',
        category: 'account'
      },
      {
        id: 'billing' as const,
        label: 'Billing',
        icon: CreditCard,
        description: 'Payment methods',
        category: 'account'
      },
      {
        id: 'kyc' as const,
        label: 'KYC',
        icon: Shield,
        description: 'Verification',
        category: 'account'
      }
    ];
    
    // Add seller tab only if user has listings
    if (hasActiveListings) {
      baseTabs.splice(2, 0, {
        id: 'seller' as const,
        label: 'Seller',
        icon: Store,
        description: 'Manage your listings',
        category: 'main'
      });
    }
    
    return baseTabs;
  }, [hasActiveListings]);

  const handleTabChange = (value: string) => {
    // Update URL with new tab
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    navigate(`/dashboard?${newSearchParams.toString()}`, { replace: true });
  };

  // Redirect to valid tab if current tab is invalid
  useEffect(() => {
    if (!isValidTab(currentTab)) {
      navigate('/dashboard?tab=overview', { replace: true });
    }
    // Also check if seller tab is accessed without proper role
    if (currentTab === 'seller' && !hasActiveListings) {
      navigate('/dashboard?tab=overview', { replace: true });
    }
  }, [currentTab, hasActiveListings, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <ConditionalStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-4 sm:py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-foreground/60">
                  Welcome back, {user?.name || user?.username}!
                </p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="w-full md:w-auto overflow-x-auto scrollbar-hide relative">
              {/* Scroll Indicator for Mobile */}
              <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" 
                   aria-hidden="true" />
              
              <TabsList 
                className="inline-flex w-auto min-w-full md:min-w-0 glass-card p-1.5 h-auto rounded-xl gap-1"
                aria-label="Dashboard navigation tabs"
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 px-3 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm font-medium min-w-[70px] sm:min-w-[100px] rounded-lg transition-all whitespace-nowrap active:scale-95"
                      aria-label={`${tab.label} tab - ${tab.description}`}
                      title={tab.description}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="text-[10px] sm:text-sm">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {children}
            </div>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
