import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api';
import { 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Package,
  CreditCard,
  FileText,
  Loader2,
} from 'lucide-react';

// Simple trend line component
const TrendLine = ({ data }: { data: number[] }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const normalizedData = data.map((val) => ((val - minValue) / range) * 100);

  return (
    <div className="flex items-end justify-between h-16 gap-1">
      {normalizedData.map((height, index) => (
        <div
          key={index}
          className="bg-primary rounded-t w-full"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
};

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  trend?: number[];
}) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      {changeType !== 'neutral' && (
        <Badge variant={changeType === 'positive' ? 'default' : 'destructive'} className="text-xs">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {change}
        </Badge>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      {trend && trend.length > 0 && (
        <div className="mt-4">
          <TrendLine data={trend} />
        </div>
      )}
    </div>
  </Card>
);

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number | string | null;
  recentOrders: Array<{
    id: number;
    order_number: string;
    total_amount: number;
    created_at: string;
    buyer: {
      name: string;
      email: string;
    };
  }>;
}

function DashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Fetch dashboard stats from API
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard-stats', timeRange],
    queryFn: async () => {
      const response = await apiClient.request<DashboardStats>('/admin/dashboard/stats');
      // Handle wrapped response
      if ('data' in response && response.data) {
        return response.data as DashboardStats;
      }
      return response as DashboardStats;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Fetch disputes count for open disputes
  const { data: disputesData } = useQuery({
    queryKey: ['admin-open-disputes'],
    queryFn: async () => {
      try {
        const response = await apiClient.request<any>('/admin/disputes?status=open&limit=1');
        return response.data || [];
      } catch {
        return [];
      }
    },
  });

  const totalRevenue = stats?.totalRevenue 
    ? (typeof stats.totalRevenue === 'string' 
        ? parseFloat(stats.totalRevenue) 
        : Number(stats.totalRevenue) || 0)
    : 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalUsers = stats?.activeUsers || 0;
  const totalProducts = stats?.totalProducts || 0;
  const openDisputes = disputesData?.length || 0;

  // Calculate today's stats from recent orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = stats?.recentOrders?.filter(order => {
    const orderDate = new Date(order.created_at);
    return orderDate >= today;
  }).length || 0;
  
  const revenueToday = stats?.recentOrders
    ?.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= today;
    })
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

  // Mock trend data (can be enhanced with real historical data later)
  const revenueTrend = [12, 19, 15, 25, 30, 28, 35, 40, 38, 42, 45, totalOrders || 50];
  const ordersTrend = [5, 8, 6, 10, 12, 11, 15, 18, 16, 20, 22, totalOrders || 25];
  const usersTrend = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, totalUsers || 75];
  const disputesTrend = [2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 1, openDisputes || 1];

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      trend: revenueTrend,
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      trend: ordersTrend,
    },
    {
      title: 'Active Users',
      value: totalUsers.toString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      trend: usersTrend,
    },
    {
      title: 'Open Disputes',
      value: openDisputes.toString(),
      change: '-5.1%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      trend: disputesTrend,
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: '+0%',
      changeType: 'neutral' as const,
      icon: Package,
      trend: [],
    },
  ];

  // Calculate additional stats
  const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : '0.00';
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';

  const stats = [
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+0.3%', // TODO: Calculate from historical data
      progress: Math.min(Number(conversionRate), 100),
    },
    {
      label: 'Average Order Value',
      value: `$${Number(avgOrderValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+$12.40', // TODO: Calculate from historical data
      progress: Math.min((Number(avgOrderValue) / 500) * 100, 100), // Assuming $500 is max AOV
    },
    {
      label: 'Active Users',
      value: `${stats?.activeUsers || 0}`,
      change: `+${(stats?.totalUsers || 0) - (stats?.activeUsers || 0)}`, // Inactive count
      progress: stats?.totalUsers ? ((stats.activeUsers / stats.totalUsers) * 100) : 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <p className="text-destructive">Failed to load dashboard data</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              disabled // TODO: Implement time range filtering in backend
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <Badge variant="secondary" className="text-xs">
                {stat.change}
              </Badge>
            </div>
            <p className="text-3xl font-bold mb-4">{stat.value}</p>
            <Progress value={stat.progress} className="h-2" />
          </Card>
        ))}
      </div>

      {/* Activity Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Activity Overview</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            View Report
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders Today</p>
                <p className="text-2xl font-bold">{ordersToday}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold">${revenueToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity to display</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => {
                const orderDate = new Date(order.created_at);
                const timeAgo = getTimeAgo(orderDate);
                
                return (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="text-sm font-medium">New order received</p>
                        <p className="text-xs text-muted-foreground">
                          Order #{order.order_number || order.id} • {order.buyer?.name || order.buyer?.username || 'Unknown Buyer'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${Number(order.total_amount || 0).toFixed(2)}</p>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default DashboardPage;
