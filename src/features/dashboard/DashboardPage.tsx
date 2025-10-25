import React from 'react';
import { useList } from '@refinedev/core';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// TODO: Replace with actual chart library (e.g., Chart.js, Recharts, etc.)
const SimpleChart = ({ data, type = 'line' }: { data: any[], type?: 'line' | 'bar' }) => (
  <div className="h-64 flex items-center justify-center text-foreground/60">
    <p>Chart component - integrate with chart library</p>
  </div>
);

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
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down';
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {changeType === 'positive' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="p-3 rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </Card>
);

function DashboardPage() {
  // Mock data - replace with actual API calls
  const { data: ordersData, isLoading: ordersLoading } = useList({
    resource: 'orders',
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: usersData, isLoading: usersLoading } = useList({
    resource: 'users',
    pagination: { current: 1, pageSize: 1 },
  });

  const { data: disputesData, isLoading: disputesLoading } = useList({
    resource: 'disputes',
    pagination: { current: 1, pageSize: 1 },
  });

  // TODO: Replace with actual KPI data from API
  const kpis = [
    {
      title: 'GMV (7 days)',
      value: ordersData?.total ? `$${ordersData.total.toLocaleString()}` : '$0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'GMV (30 days)',
      value: ordersData?.total ? `$${ordersData.total.toLocaleString()}` : '$0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
    {
      title: 'Orders Today',
      value: ordersData?.total?.toString() || '0',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: 'Open Disputes',
      value: disputesData?.total?.toString() || '0',
      change: '-2.3%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
    },
    {
      title: 'Pending Verifications',
      value: usersData?.total?.toString() || '0',
      change: '+0%',
      changeType: 'positive' as const,
      icon: Users,
    },
  ];

  // TODO: Replace with actual chart data from API
  const gmvData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Empty data for now
  const categoryData = [
    { name: 'Gaming', value: 0, color: '#3B82F6' },
    { name: 'Social Media', value: 0, color: '#10B981' },
    { name: 'Digital Services', value: 0, color: '#F59E0B' },
    { name: 'Software', value: 0, color: '#EF4444' },
    { name: 'Entertainment', value: 0, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GMV Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">GMV Over Time</h3>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <SimpleChart data={gmvData} type="line" />
        </Card>

        {/* Top Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Categories</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${category.value}%`, 
                        backgroundColor: category.color 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {category.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {/* TODO: Replace with actual activity data from API */}
          {[].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'order' ? 'bg-green-500' :
                  activity.type === 'dispute' ? 'bg-red-500' :
                  activity.type === 'verification' ? 'bg-blue-500' :
                  'bg-yellow-500'
                }`} />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
