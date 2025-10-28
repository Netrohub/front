import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { sellerApiClient, sellerQueryKeys } from "@/lib/sellerApi";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import { SellerTabSkeleton } from "./shared/DashboardSkeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Store, 
  DollarSign, 
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus
} from "lucide-react";

const SellerTab = () => {
  const { user } = useAuth();
  
  // Fetch seller dashboard data
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: sellerQueryKeys.dashboard(),
    queryFn: () => sellerApiClient.getDashboard(),
    enabled: !!user,
  });

  // Fetch seller products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: sellerQueryKeys.products(),
    queryFn: () => sellerApiClient.getProducts(),
    enabled: !!user,
  });

  // Fetch seller orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: sellerQueryKeys.orders(),
    queryFn: () => sellerApiClient.getOrders(),
    enabled: !!user,
  });

  // Check if still loading
  const isLoading = dashboardLoading || productsLoading || ordersLoading;

  // Show loading skeleton
  if (isLoading) {
    return <SellerTabSkeleton />;
  }

  // Calculate seller stats
  const totalRevenue = dashboard?.stats?.totalRevenue || 0;
  const totalOrders = dashboard?.stats?.totalOrders || 0;
  const activeListings = dashboard?.stats?.activeListings || 0;
  const pendingPayouts = dashboard?.stats?.pendingPayouts || 0;
  
  const sellerStats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "All time earnings",
      icon: DollarSign,
      color: "from-primary to-accent",
    },
    {
      label: "Active Listings",
      value: activeListings.toString(),
      change: activeListings > 0 ? `${activeListings} products` : "No listings",
      icon: Package,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: totalOrders > 0 ? `${totalOrders} sales` : "No sales yet",
      icon: ShoppingBag,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Pending Payouts",
      value: `$${pendingPayouts.toFixed(2)}`,
      change: pendingPayouts > 0 ? "Ready to withdraw" : "No pending payouts",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'pending':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'sold':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getOrderStatusColor = (status: string) => {
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

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'processing':
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return ShoppingBag;
    }
  };

  return (
    <div className="space-y-6">
      {/* Seller Stats */}
      <div>
        <SectionHeader 
          title="Seller Dashboard"
          description="Your selling performance and business metrics"
          icon={Store}
        />
        
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sellerStats.map((stat) => (
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

      {/* Products and Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Products */}
        <Card className="glass-card p-6">
          <SectionHeader 
            title="Your Products"
            description="Manage your listings"
              action={{
                label: "Add Product",
                href: "/sell",
                variant: "default"
              }}
          />
          
          <div className="mt-4">
            {productsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <Card key={product.id} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.title}</p>
                          <p className="text-xs text-foreground/60">${product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                {products.length > 5 && (
                  <Link 
                    to="/dashboard?tab=seller"
                    className="block text-center text-sm text-primary hover:text-primary/80 py-2"
                  >
                    View All Products ({products.length})
                  </Link>
                )}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No Products Listed"
                description="Start selling by creating your first product listing."
                action={{
                  label: "Create Product",
                  href: "/sell"
                }}
                showBackground={false}
              />
            )}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="glass-card p-6">
          <SectionHeader 
            title="Recent Orders"
            description="Your latest sales"
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
                  const StatusIcon = getOrderStatusIcon(order.status);
                  return (
                    <Card key={order.id} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <StatusIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Order #{order.id}</p>
                            <p className="text-xs text-foreground/60">
                              {order.buyer.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="font-semibold text-sm">${order.total.toFixed(2)}</span>
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
                description="Orders from customers will appear here once you start selling."
                showBackground={false}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card p-6">
        <SectionHeader 
          title="Quick Actions"
          description="Manage your seller account"
        />
        
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <Link to="/sell">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Plus className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Add Product</h4>
                  <p className="text-xs text-foreground/60">List a new item for sale</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/dashboard?tab=orders">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ShoppingBag className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Manage Orders</h4>
                  <p className="text-xs text-foreground/60">Process customer orders</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/dashboard?tab=billing">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Payouts</h4>
                  <p className="text-xs text-foreground/60">View earnings & payments</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SellerTab;
