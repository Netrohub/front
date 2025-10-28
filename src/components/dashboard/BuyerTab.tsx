import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib/api";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import { BuyerTabSkeleton } from "./shared/DashboardSkeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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
  
  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: queryKeys.user.orders,
    queryFn: () => apiClient.getOrders(),
    enabled: !!user,
  });

  // Fetch wallet data
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: queryKeys.user.wallet,
    queryFn: () => apiClient.getWallet(),
    enabled: !!user,
  });

  // Fetch wishlist
  const { data: wishlist, isLoading: wishlistLoading } = useQuery({
    queryKey: queryKeys.user.wishlist,
    queryFn: () => apiClient.getWishlist(),
    enabled: !!user,
  });

  // Check if still loading
  const isLoading = ordersLoading || walletLoading || wishlistLoading;

  // Show loading skeleton
  if (isLoading) {
    return <BuyerTabSkeleton />;
  }

  // Calculate buyer stats
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const pendingOrders = orders?.filter(order => ['pending', 'processing'].includes(order.status)).length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
  const wishlistCount = wishlist?.length || 0;
  
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
      value: `$${wallet?.balance?.toFixed(2) || '0.00'}`,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'pending':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

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
              {orders.slice(0, 5).map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <Card key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <StatusIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Order #{order.order_number}</p>
                          <p className="text-xs text-foreground/60">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="font-semibold text-sm">${order.total.toFixed(2)}</span>
                        <ArrowRight className="h-4 w-4 text-foreground/40" />
                      </div>
                    </div>
                  </Card>
                );
              })}
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
                  <p className="font-semibold">${wallet?.balance?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-foreground/60">Available Balance</p>
                </div>
              </div>
              <Link 
                to="/dashboard?tab=wallet"
                className="text-primary hover:text-primary/80 text-sm font-medium"
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
