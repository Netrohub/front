import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib/api";
import { sellerApiClient, sellerQueryKeys } from "@/lib/sellerApi";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import { Card } from "@/components/ui/card";
import KYCStatusComponent from "@/components/KYCStatus";
import { getText } from "./shared/FeatureFlags";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  DollarSign, 
  Shield,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LayoutDashboard
} from "lucide-react";

const OverviewTab = () => {
  const { user } = useAuth();
  
  // Check if user has seller role
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if KYC is completed
  const isKYCVerified = user?.emailVerified && user?.phoneVerified && user?.kycStatus === 'verified';
  
  // Fetch user data (orders, wallet)
  const { data: userOrders } = useQuery({
    queryKey: queryKeys.user.orders,
    queryFn: () => apiClient.getOrders(),
    enabled: !!user,
  });

  const { data: userWallet } = useQuery({
    queryKey: queryKeys.user.wallet,
    queryFn: () => apiClient.getWallet(),
    enabled: !!user,
  });

  // Fetch seller data if user has seller role
  const { data: sellerDashboard } = useQuery({
    queryKey: sellerQueryKeys.dashboard(),
    queryFn: () => sellerApiClient.getDashboard(),
    enabled: !!user && hasSellingsRole,
  });

  // Calculate shared KPIs
  const totalOrders = userOrders?.length || 0;
  const completedOrders = userOrders?.filter(order => order.status === 'completed' || order.status === 'delivered').length || 0;
  const walletBalance = userWallet?.balance || 0;
  const totalRevenue = sellerDashboard?.stats?.totalRevenue || 0;
  const activeListings = sellerDashboard?.stats?.activeListings || 0;

  const overviewStats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: totalOrders > 0 ? `${completedOrders} completed` : "No orders yet",
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Wallet Balance",
      value: `$${walletBalance.toFixed(2)}`,
      change: "Available funds",
      icon: DollarSign,
      color: "from-primary to-accent",
    },
  ];

  // Add seller stats if user has seller role
  if (hasSellingsRole) {
    overviewStats.push(
      {
        label: "Active Listings",
        value: activeListings.toString(),
        change: activeListings > 0 ? `${activeListings} products` : "No listings",
        icon: Package,
        color: "from-green-500 to-emerald-600",
      },
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        change: "All time earnings",
        icon: TrendingUp,
        color: "from-purple-500 to-purple-700",
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Banner */}
      {!isKYCVerified && (
        <Card className="glass-card p-4 border-orange-500/30 bg-orange-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-1">
                {getText('IDENTITY_VERIFICATION_REQUIRED')}
              </h3>
              <p className="text-xs text-orange-600 dark:text-orange-300 mb-2">
                Complete your KYC verification to access all features and increase transaction limits.
              </p>
              <KYCStatusComponent />
            </div>
          </div>
        </Card>
      )}

      {/* Overview Stats */}
      <div>
        <SectionHeader 
          title="Account Overview"
          description="Your key metrics at a glance"
          icon={LayoutDashboard}
        />
        
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              variant="compact"
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card p-6">
        <SectionHeader 
          title="Quick Actions"
          description="Common tasks and shortcuts"
        />
        
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/dashboard?tab=buyer" className="block">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer hover:border-blue-500/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">View Orders</h4>
                  <p className="text-xs text-foreground/60">Check your purchase history</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/account/wallet" className="block">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer hover:border-green-500/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Manage Wallet</h4>
                  <p className="text-xs text-foreground/60">Add funds or withdraw</p>
                </div>
              </div>
            </Card>
          </Link>
          
          {hasSellingsRole && (
            <Link to="/dashboard?tab=seller" className="block">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer hover:border-purple-500/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Package className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Manage Listings</h4>
                    <p className="text-xs text-foreground/60">Edit your products</p>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab;
