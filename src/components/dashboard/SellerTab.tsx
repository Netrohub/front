import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { sellerApiClient, sellerQueryKeys } from "@/lib/sellerApi";
import StatCard from "./shared/StatCard";
import SectionHeader from "./shared/SectionHeader";
import EmptyState from "./shared/EmptyState";
import ErrorState from "./shared/ErrorState";
import { SellerTabSkeleton } from "./shared/DashboardSkeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  formatDate, 
  formatCurrency, 
  getOrderStatusColor,
  getProductStatusColor,
  safeGet,
  DASHBOARD_LIMITS 
} from "@/lib/dashboardUtils";
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
  
  // Fetch seller dashboard data with error handling
  const { 
    data: dashboard, 
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard 
  } = useQuery({
    queryKey: sellerQueryKeys.dashboard(),
    queryFn: () => sellerApiClient.getDashboard(),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch seller products with error handling and pagination
  const { 
    data: products, 
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts 
  } = useQuery({
    queryKey: sellerQueryKeys.products(),
    queryFn: () => sellerApiClient.getProducts({ limit: DASHBOARD_LIMITS.PRODUCTS_PER_PAGE }),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch seller orders with error handling and pagination
  const { 
    data: orders, 
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders 
  } = useQuery({
    queryKey: sellerQueryKeys.orders(),
    queryFn: () => sellerApiClient.getOrders({ limit: DASHBOARD_LIMITS.ORDERS_PER_PAGE }),
    enabled: !!user,
    retry: 2,
    retryDelay: 1000,
  });

  // Check if still loading
  const isLoading = dashboardLoading || productsLoading || ordersLoading;
  
  // Check if any errors occurred
  const hasError = dashboardError || productsError || ordersError;

  // Show loading skeleton
  if (isLoading) {
    return <SellerTabSkeleton />;
  }
  
  // Show error state if any API failed
  if (hasError) {
    const errorMessage = dashboardError ? "Failed to load dashboard" : 
                        productsError ? "Failed to load products" : 
                        "Failed to load orders";
    
    return (
      <ErrorState 
        message={errorMessage}
        description="Please check your internet connection and try again."
        retry={() => {
          if (dashboardError) refetchDashboard();
          if (productsError) refetchProducts();
          if (ordersError) refetchOrders();
        }}
      />
    );
  }

  // Calculate seller stats with safe data access
  const totalRevenue = safeGet(dashboard?.stats?.totalRevenue, 0);
  const totalOrders = safeGet(dashboard?.stats?.totalOrders, 0);
  const activeListings = safeGet(dashboard?.stats?.activeListings, 0);
  const pendingPayouts = safeGet(dashboard?.stats?.pendingPayouts, 0);
  
  const sellerStats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
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
      value: formatCurrency(pendingPayouts),
      change: pendingPayouts > 0 ? "Ready to withdraw" : "No pending payouts",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
  ];

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
                {products.slice(0, DASHBOARD_LIMITS.ORDERS_PREVIEW).map((product) => {
                  if (!product) return null;
                  return (
                    <Link 
                      key={product.id || Math.random()} 
                      to={`/products/${product.id}`}
                      aria-label={`View product ${product.title}`}
                    >
                      <Card className="p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.title || 'Untitled'}</p>
                              <p className="text-xs text-foreground/60">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={getProductStatusColor(product?.status || 'inactive')}
                              aria-label={`Product status: ${product?.status || 'unknown'}`}
                            >
                              {product.status || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                }).filter(Boolean)}
                {products.length > DASHBOARD_LIMITS.ORDERS_PREVIEW && (
                  <Link 
                    to="/dashboard?tab=seller"
                    className="block text-center text-sm text-primary hover:text-primary/80 py-2"
                    aria-label={`View all ${products.length} products`}
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
                {orders.slice(0, DASHBOARD_LIMITS.ORDERS_PREVIEW).map((order) => {
                  if (!order) return null;
                  const StatusIcon = getOrderStatusIcon(order?.status || 'pending');
                  return (
                    <Link 
                      key={order.id || Math.random()} 
                      to={`/account/orders/${order.id}`}
                      aria-label={`View order ${order.id}`}
                    >
                      <Card className="p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <StatusIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Order #{order.id || 'N/A'}</p>
                              <p className="text-xs text-foreground/60">
                                {order?.buyer?.name || 'Unknown buyer'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={getOrderStatusColor(order?.status || 'pending')}
                              aria-label={`Order status: ${order?.status || 'unknown'}`}
                            >
                              {order.status || 'Unknown'}
                            </Badge>
                            <span className="font-semibold text-sm">{formatCurrency(order.total)}</span>
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
          <Link to="/sell" aria-label="Add a new product">
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
          
          <Link to="/dashboard?tab=orders" aria-label="Manage your orders">
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
          
          <Link to="/dashboard?tab=billing" aria-label="View payouts and earnings">
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
