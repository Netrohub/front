import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  ShoppingBag,
  Eye,
  Star,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Crown,
  Target,
  Users,
  Globe,
  Brain,
  Zap,
  AlertTriangle
} from "lucide-react";

// Analytics data will be loaded from the API
const analyticsData = {
  revenue: {
    total: 0,
    growth: 0,
    monthly: 0,
    daily: 0
  },
  sales: {
    total: 0,
    growth: 0,
    conversion: 0,
    averageOrder: 0
  },
  customers: {
    total: 0,
    new: 0,
    returning: 0,
    lifetimeValue: 0
  },
  products: {
    total: 0,
    topPerformer: "No products yet",
    views: 0,
    conversion: 0
  }
};

// Time series data will be loaded from the API
const timeSeriesData = [];

// Top products data will be loaded from the API
const topProducts = [];

// Customer segments data will be loaded from the API
const customerSegments = [];

const SellerAnalytics = () => {
  const { user } = useAuth();

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Advanced Analytics
              </h1>
            </div>
            <p className="text-foreground/60">Deep insights into your business performance</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
            <BarChart3 className="h-3 w-3 mr-1" />
            Analytics
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 opacity-10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                  +{analyticsData.revenue.growth}%
                </Badge>
              </div>
              <p className="text-2xl font-black text-foreground mb-1">${analyticsData.revenue.total.toLocaleString()}</p>
              <p className="text-sm text-foreground/60">Total Revenue</p>
            </div>
          </Card>

          <Card className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                  +{analyticsData.sales.growth}%
                </Badge>
              </div>
              <p className="text-2xl font-black text-foreground mb-1">{analyticsData.sales.total}</p>
              <p className="text-sm text-foreground/60">Total Sales</p>
            </div>
          </Card>

          <Card className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 opacity-10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs">
                  {analyticsData.customers.new} new
                </Badge>
              </div>
              <p className="text-2xl font-black text-foreground mb-1">{analyticsData.customers.total}</p>
              <p className="text-sm text-foreground/60">Total Customers</p>
            </div>
          </Card>

          <Card className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 opacity-10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                  {analyticsData.sales.conversion}%
                </Badge>
              </div>
              <p className="text-2xl font-black text-foreground mb-1">{analyticsData.sales.conversion}%</p>
              <p className="text-sm text-foreground/60">Conversion Rate</p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Revenue Trend</h2>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                Last 6 months
              </Badge>
            </div>

            <div className="space-y-4">
              {timeSeriesData.map((data, index) => {
                const maxRevenue = Math.max(...timeSeriesData.map(d => d.revenue));
                const height = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-foreground/60">{data.period}</div>
                    <div className="flex-1 bg-foreground/5 rounded-full h-2 relative">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${height}%` }}
                      />
                    </div>
                    <div className="w-20 text-right text-sm font-semibold text-foreground">
                      ${data.revenue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Top Products */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Top Products</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Link to="/seller/products">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="p-4 rounded-lg glass-card border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-foreground/60 mb-1">Revenue</p>
                      <p className="font-bold text-green-500">${product.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Sales</p>
                      <p className="font-bold text-blue-500">{product.sales}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Growth</p>
                      <p className="font-bold text-purple-500">+{product.growth}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Customer Segments */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Customer Segments</h2>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              AI Analysis
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="p-4 rounded-lg glass-card border border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{segment.segment}</h3>
                  <Badge variant="outline" className="text-xs">
                    {segment.percentage}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Customers</span>
                    <span className="font-semibold text-foreground">{segment.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Revenue</span>
                    <span className="font-semibold text-green-500">${segment.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="glass-card p-6 border border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Brain className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Performance Insights</h3>
              <p className="text-foreground/60 mb-4">
                Your business is performing above average with strong growth indicators.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>Revenue up {analyticsData.revenue.growth}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{analyticsData.customers.new} new customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span>{analyticsData.sales.conversion}% conversion rate</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerAnalytics;
