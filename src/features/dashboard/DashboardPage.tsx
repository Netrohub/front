import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAdminList } from '@/hooks/useAdminList';
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

function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Fetch data from API
  const { data: ordersData } = useAdminList({
    endpoint: '/orders',
    initialSearchTerm: '',
  });

  const { data: usersData } = useAdminList({
    endpoint: '/users',
    initialSearchTerm: '',
  });

  const { data: disputesData } = useAdminList({
    endpoint: '/disputes',
    initialSearchTerm: '',
  });

  const { data: productsData } = useAdminList({
    endpoint: '/products',
    initialSearchTerm: '',
  });

  const totalRevenue = ordersData?.length ? ordersData.length * 100 : 0;
  const totalOrders = ordersData?.length || 0;
  const totalUsers = usersData?.length || 0;
  const openDisputes = disputesData?.length || 0;
  const totalProducts = productsData?.length || 0;

  // Mock trend data (replace with real data)
  const revenueTrend = [12, 19, 15, 25, 30, 28, 35, 40, 38, 42, 45, 50];
  const ordersTrend = [5, 8, 6, 10, 12, 11, 15, 18, 16, 20, 22, 25];
  const usersTrend = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
  const disputesTrend = [2, 1, 3, 2, 1, 2, 3, 2, 1, 2, 1, 1];

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

  const stats = [
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '+0.3%',
      progress: 65,
    },
    {
      label: 'Average Order Value',
      value: '$142.50',
      change: '+$12.40',
      progress: 78,
    },
    {
      label: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      progress: 96,
    },
  ];

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
          <Button variant="outline" size="sm">
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
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">234</p>
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
                <p className="text-2xl font-bold">47</p>
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
                <p className="text-2xl font-bold">$6,789</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {totalOrders === 0 && totalUsers === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent activity to display</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">Order #{totalOrders || 1001}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">2 mins ago</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
