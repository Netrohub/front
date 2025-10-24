import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Settings,
  Target,
  Users,
  Zap,
  Shield,
  Brain,
  Globe,
  Lock,
  AlertTriangle
} from "lucide-react";

// Advanced analytics data for Elite users
const advancedStats = [
  {
    label: "Revenue Growth",
    value: "+34.2%",
    change: "vs last month",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Conversion Rate",
    value: "12.8%",
    change: "+2.1%",
    icon: Target,
    color: "from-blue-500 to-blue-700",
  },
  {
    label: "Customer Lifetime Value",
    value: "$2,847",
    change: "+18%",
    icon: Users,
    color: "from-purple-500 to-purple-700",
  },
  {
    label: "Market Share",
    value: "8.3%",
    change: "+1.2%",
    icon: Globe,
    color: "from-orange-500 to-orange-700",
  },
];

const aiInsights = [
  {
    title: "Peak Sales Time",
    insight: "Your products sell 40% better between 2-4 PM EST",
    confidence: 94,
    action: "Schedule promotions during peak hours",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    title: "Price Optimization",
    insight: "Increasing Steam Account prices by 15% could boost revenue by $2,400/month",
    confidence: 87,
    action: "Consider A/B testing price increases",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    title: "Market Opportunity",
    insight: "Gaming accounts category has 23% untapped potential in your region",
    confidence: 91,
    action: "Expand gaming product line",
    icon: TrendingUp,
    color: "text-purple-500",
  },
];

const competitorAnalysis = [
  {
    metric: "Price Competitiveness",
    score: 8.2,
    trend: "up",
    description: "Your prices are 15% below market average",
  },
  {
    metric: "Product Quality Score",
    score: 9.1,
    trend: "up",
    description: "Excellent customer satisfaction ratings",
  },
  {
    metric: "Market Position",
    score: 7.8,
    trend: "up",
    description: "Top 15% of sellers in your category",
  },
];

const advancedSettings = [
  {
    title: "AI-Powered Pricing",
    description: "Automatically adjust prices based on market conditions",
    enabled: true,
    icon: Brain,
  },
  {
    title: "Smart Inventory Management",
    description: "Predict demand and optimize stock levels",
    enabled: true,
    icon: Package,
  },
  {
    title: "Advanced Analytics",
    description: "Deep insights into customer behavior and trends",
    enabled: true,
    icon: BarChart3,
  },
  {
    title: "Competitor Monitoring",
    description: "Track competitor prices and strategies",
    enabled: false,
    icon: Eye,
  },
  {
    title: "Automated Marketing",
    description: "AI-driven promotional campaigns",
    enabled: false,
    icon: Zap,
  },
];

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has Elite plan
  const isElitePlan = user?.subscription?.plan === 'Elite';
  
  // If not Elite, redirect to upgrade page
  if (!isElitePlan) {
    return (
      <SellerLayout>
        <div className="space-y-6">
          <Card className="glass-card p-8 text-center border border-orange-500/30">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Crown className="h-12 w-12 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                  Elite Access Required
                </h1>
                <p className="text-foreground/60 mb-6">
                  This advanced seller dashboard is only available to Elite plan subscribers.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild className="btn-glow">
                    <Link to="/pricing">
                      Upgrade to Elite
                      <Crown className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/account/dashboard">
                      View Basic Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Elite Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Elite Seller Dashboard
              </h1>
            </div>
            <p className="text-foreground/60">Advanced analytics and AI-powered insights for elite sellers</p>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Crown className="h-3 w-3 mr-1" />
            Elite Plan
          </Badge>
        </div>

        {/* Advanced Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {advancedStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="glass-card p-6 relative overflow-hidden group hover:scale-105 transition-all">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-black text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-bold text-foreground">AI Insights</h2>
              </div>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                Powered by AI
              </Badge>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className="p-4 rounded-lg glass-card border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-primary/10 ${insight.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{insight.title}</h3>
                        <p className="text-sm text-foreground/60 mb-2">{insight.insight}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-primary font-medium">{insight.action}</p>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Competitor Analysis */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold text-foreground">Market Analysis</h2>
              </div>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Real-time
              </Badge>
            </div>

            <div className="space-y-4">
              {competitorAnalysis.map((analysis, index) => (
                <div key={index} className="p-4 rounded-lg glass-card border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{analysis.metric}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{analysis.score}/10</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60">{analysis.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Advanced Settings */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Advanced Settings</h2>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Elite Features
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedSettings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <div key={index} className="p-4 rounded-lg glass-card border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${setting.enabled ? 'bg-primary/10' : 'bg-foreground/10'}`}>
                      <Icon className={`h-4 w-4 ${setting.enabled ? 'text-primary' : 'text-foreground/40'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{setting.title}</h3>
                        {setting.enabled ? (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/60">{setting.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Elite Benefits */}
        <Card className="glass-card p-6 border border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">Elite Plan Benefits</h3>
              <p className="text-foreground/60 mb-4">
                You're enjoying premium features including AI insights, advanced analytics, and priority support.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span>AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span>Advanced Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
