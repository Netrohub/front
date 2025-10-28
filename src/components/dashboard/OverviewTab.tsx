import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib/api";
import { sellerApiClient, sellerQueryKeys } from "@/lib/sellerApi";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import ErrorState from "./shared/ErrorState";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import KYCStatusComponent from "@/components/KYCStatus";
import { getText } from "./shared/FeatureFlags";
import { Link } from "react-router-dom";
import { OverviewTabSkeleton } from "./shared/DashboardSkeleton";
import { 
  formatDate, 
  formatCurrency, 
  getOrderStatusColor,
  safeGet,
  DASHBOARD_LIMITS 
} from "@/lib/dashboardUtils";
import { useState } from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  Shield,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  LayoutDashboard,
  Clock,
  ArrowRight,
  XCircle,
  X
} from "lucide-react";

const OverviewTab = () => {
  const { user } = useAuth();
  const [kycBannerDismissed, setKycBannerDismissed] = useState(
    localStorage.getItem('kycBannerDismissed') === 'true'
  );
  
  // Check if user has seller role
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if KYC is completed
  const isKYCVerified = user?.emailVerified && user?.phoneVerified && user?.kycStatus === 'verified';
  
  // Fetch user data (orders, wallet) with error handling
  const { 
    data: userOrders, 
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders 
  } = useQuery({
    queryKey: queryKeys.user.orders,
    queryFn: () => apiClient.getOrders({ limit: DASHBOARD_LIMITS.ORDERS_PER_PAGE }),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  const { 
    data: userWallet, 
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet 
  } = useQuery({
    queryKey: queryKeys.user.wallet,
    queryFn: () => apiClient.getWallet(),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch seller data if user has seller role
  const { 
    data: sellerDashboard, 
    isLoading: sellerLoading,
    error: sellerError,
    refetch: refetchSeller 
  } = useQuery({
    queryKey: sellerQueryKeys.dashboard(),
    queryFn: () => sellerApiClient.getDashboard(),
    enabled: !!user && hasSellingsRole,
    retry: 2,
    retryDelay: 1000,
  });

  // Check if still loading
  const isLoading = ordersLoading || walletLoading || (hasSellingsRole ? sellerLoading : false);
  
  // Check if any errors occurred
  const hasError = ordersError || walletError || (hasSellingsRole && sellerError);

  // Show loading skeleton
  if (isLoading) {
    return <OverviewTabSkeleton />;
  }

  // Show error state if any API failed
  if (hasError) {
    const errorMessage = ordersError ? "Failed to load orders" : 
                        walletError ? "Failed to load wallet" : 
                        "Failed to load dashboard data";
    
    return (
      <ErrorState 
        message={errorMessage}
        description="Please check your internet connection and try again."
        retry={() => {
          if (ordersError) refetchOrders();
          if (walletError) refetchWallet();
          if (sellerError) refetchSeller();
        }}
      />
    );
  }

  // Calculate shared KPIs with safe data access
  const totalOrders = safeGet(userOrders?.length, 0);
  const completedOrders = userOrders?.filter(order => 
    order?.status === 'completed' || order?.status === 'delivered'
  ).length || 0;
  const walletBalance = safeGet(userWallet?.balance, 0);
  const totalRevenue = safeGet(sellerDashboard?.stats?.totalRevenue, 0);
  const activeListings = safeGet(sellerDashboard?.stats?.activeListings, 0);

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
      value: formatCurrency(walletBalance),
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
        value: formatCurrency(totalRevenue),
        change: "All time earnings",
        icon: TrendingUp,
        color: "from-purple-500 to-purple-700",
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* KYC Status Banner - Dismissible */}
      {!isKYCVerified && !kycBannerDismissed && (
        <Card className="glass-card p-4 border-orange-500/30 bg-orange-500/5 relative">
          <button
            onClick={() => {
              setKycBannerDismissed(true);
              localStorage.setItem('kycBannerDismissed', 'true');
            }}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-orange-500/10 transition-colors"
            aria-label="Dismiss KYC reminder"
          >
            <X className="h-4 w-4 text-orange-600" />
          </button>
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1 pr-6">
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
          <Link to="/dashboard?tab=buyer" className="block" aria-label="View your orders">
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
          
          <Link to="/dashboard?tab=wallet" className="block" aria-label="Manage your wallet">
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
            <Link to="/dashboard?tab=seller" className="block" aria-label="Manage your product listings">
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

      {/* Recent Orders Preview */}
      {totalOrders > 0 && (
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader 
              title="Recent Orders"
              description="Your latest purchases"
            />
            <Link to="/dashboard?tab=buyer" aria-label="View all orders">
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {userOrders?.slice(0, DASHBOARD_LIMITS.QUICK_VIEW).map((order) => {
              if (!order) return null;
              
              const getStatusIcon = (status: string) => {
                switch (status) {
                  case 'completed':
                  case 'delivered':
                    return <CheckCircle className="h-4 w-4 text-green-600" />;
                  case 'processing':
                  case 'pending':
                    return <Clock className="h-4 w-4 text-orange-600" />;
                  case 'cancelled':
                    return <XCircle className="h-4 w-4 text-red-600" />;
                  default:
                    return <Package className="h-4 w-4 text-gray-600" />;
                }
              };

              return (
                <Link 
                  key={order.id || Math.random()} 
                  to={`/account/orders/${order.id}`}
                  aria-label={`View order ${order.order_number || order.id}`}
                >
                  <Card className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          {getStatusIcon(order?.status || 'pending')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            Order #{order.order_number || order.id || 'N/A'}
                          </h4>
                          <p className="text-xs text-foreground/60">
                            {formatDate(order.created_at)} • {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`text-xs whitespace-nowrap ${getOrderStatusColor(order?.status || 'pending')}`}
                        aria-label={`Order status: ${order?.status || 'unknown'}`}
                      >
                        {order.status || 'Unknown'}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              );
            }).filter(Boolean)}
          </div>
        </Card>
      )}
    </div>
  );
};

export default OverviewTab;
