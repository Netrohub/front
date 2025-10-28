import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib/api";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import ErrorState from "./shared/ErrorState";
import { BuyerTabSkeleton } from "./shared/DashboardSkeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  formatDate, 
  formatCurrency, 
  getOrderStatusColor,
  safeGet,
  DASHBOARD_LIMITS 
} from "@/lib/dashboardUtils";
import { 
  ShoppingBag, 
  DollarSign, 
  Star,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

const BuyerTab = () => {
  const { user } = useAuth();
  
  // Fetch user orders with error handling and pagination
  const { 
    data: orders, 
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

  // Fetch wallet data with error handling
  const { 
    data: wallet, 
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

  // Fetch wishlist with error handling
  const { 
    data: wishlist, 
    isLoading: wishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist 
  } = useQuery({
    queryKey: queryKeys.user.wishlist,
    queryFn: () => apiClient.getWishlist(),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  // Check if still loading
  const isLoading = ordersLoading || walletLoading || wishlistLoading;
  
  // Check if any errors occurred
  const hasError = ordersError || walletError || wishlistError;

  // Show loading skeleton
  if (isLoading) {
    return <BuyerTabSkeleton />;
  }
  
  // Show error state if any API failed
  if (hasError) {
    const errorMessage = ordersError ? "Failed to load orders" : 
                        walletError ? "Failed to load wallet" : 
                        "Failed to load wishlist";
    
    return (
      <ErrorState 
        message={errorMessage}
        description="Please check your internet connection and try again."
        retry={() => {
          if (ordersError) refetchOrders();
          if (walletError) refetchWallet();
          if (wishlistError) refetchWishlist();
        }}
      />
    );
  }

  // Calculate buyer stats with safe data access
  const totalOrders = safeGet(orders?.length, 0);
  const completedOrders = orders?.filter(order => order?.status === 'completed').length || 0;
  const pendingOrders = orders?.filter(order => 
    order?.status && ['pending', 'processing'].includes(order.status)
  ).length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + safeGet(order?.total, 0), 0) || 0;
  const wishlistCount = safeGet(wishlist?.length, 0);
  
  const buyerStats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: `${completedOrders} completed`,
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet?.balance),
      change: "Available funds",
      icon: DollarSign,
      color: "from-primary to-accent",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      change: "In progress",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount.toString(),
      change: "Saved items",
      icon: Star,
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'processing':
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="space-y-6">
      {/* Buyer Stats */}
      <div>
        <SectionHeader 
          title="Buyer Dashboard"
          description="Your purchasing activity and account status"
          icon={ShoppingBag}
        />
        
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buyerStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="glass-card p-6">
        <SectionHeader 
          title="Recent Orders"
          description="Your latest purchases and their status"
            action={{
              label: "View All Orders",
              href: "/dashboard?tab=orders",
              variant: "outline"
            }}
        />
        
        <div className="mt-4">
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, DASHBOARD_LIMITS.ORDERS_PREVIEW).map((order) => {
                if (!order) return null;
                const StatusIcon = getStatusIcon(order?.status || 'pending');
                return (
                  <Link 
                    key={order.id || Math.random()} 
                    to={`/account/orders/${order.id}`}
                    aria-label={`View order ${order.order_number || order.id}`}
                  >
                    <Card className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <StatusIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Order #{order.order_number || order.id || 'N/A'}
                            </p>
                            <p className="text-xs text-foreground/60">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            className={getOrderStatusColor(order?.status || 'pending')}
                            aria-label={`Order status: ${order?.status || 'unknown'}`}
                          >
                            {order.status || 'Unknown'}
                          </Badge>
                          <span className="font-semibold text-sm">
                            {formatCurrency(order.total)}
                          </span>
                          <ArrowRight className="h-4 w-4 text-foreground/40" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              }).filter(Boolean)}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="No Orders Yet"
              description="Start shopping to see your orders here. Browse our marketplace for gaming accounts and digital assets."
              action={{
                label: "Browse Products",
                href: "/products"
              }}
            />
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <SectionHeader 
            title="Wallet & Billing"
            description="Manage your funds and payment methods"
              action={{
                label: "Manage Wallet",
                href: "/dashboard?tab=wallet",
                variant: "outline"
              }}
          />
          
          <div className="mt-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-semibold">{formatCurrency(wallet?.balance)}</p>
                  <p className="text-xs text-foreground/60">Available Balance</p>
                </div>
              </div>
              <Link 
                to="/dashboard?tab=wallet"
                className="text-primary hover:text-primary/80 text-sm font-medium"
                aria-label="Add funds to wallet"
              >
                Add Funds →
              </Link>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <SectionHeader 
            title="Wishlist"
            description="Items you're interested in"
              action={{
                label: "View Wishlist",
                href: "/account/wishlist",  
                variant: "outline"
              }}
          />
          
          <div className="mt-4">
            <div className="flex items-center justify-between p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-semibold">{wishlistCount} Items</p>
                  <p className="text-xs text-foreground/60">Saved for later</p>
                </div>
              </div>
              <Link 
                to="/account/wishlist"
                className="text-yellow-600 hover:text-yellow-500 text-sm font-medium"
                aria-label="View all wishlist items"
              >
                View All →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BuyerTab;
