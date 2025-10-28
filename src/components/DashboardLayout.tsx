import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store,
  Crown
} from "lucide-react";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get current tab from URL params, default to 'overview'
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Check if user has seller role (has any active or pending listings)
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if user has active products - this would come from API but for now using role
  const hasActiveListings = hasSellingsRole;
  
  // Available tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Dashboard summary'
    },
    {
      id: 'buyer',
      label: 'Buyer',
      icon: ShoppingBag,
      description: 'Orders and purchases'
    }
  ];
  
  // Add seller tab only if user has listings
  if (hasActiveListings) {
    tabs.push({
      id: 'seller',
      label: 'Seller',
      icon: Store,
      description: 'Manage your listings'
    });
  }

  const handleTabChange = (value: string) => {
    // Update URL with new tab
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', value);
    navigate(`/dashboard?${newSearchParams.toString()}`, { replace: true });
  };

  // Redirect to valid tab if current tab is invalid
  useEffect(() => {
    const validTabs = tabs.map(t => t.id);
    if (!validTabs.includes(currentTab)) {
      navigate('/dashboard?tab=overview', { replace: true });
    }
  }, [currentTab, tabs, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
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
            <TabsList className="inline-flex w-auto glass-card p-1.5 h-auto rounded-xl gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 px-3 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-white text-xs sm:text-sm font-medium min-w-[70px] sm:min-w-[100px] rounded-lg transition-all"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-[10px] sm:text-sm">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

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
