import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell,
  ShoppingBag,
  DollarSign,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "You have a new order for 'Steam Account - 200+ Games'",
    time: "5 minutes ago",
    read: false,
    icon: ShoppingBag,
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    message: "You received $449.99 for order #ORD-001",
    time: "2 hours ago",
    read: false,
    icon: DollarSign,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    type: "review",
    title: "New Review",
    message: "You received a 5-star review from customer",
    time: "1 day ago",
    read: true,
    icon: MessageSquare,
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: 4,
    type: "alert",
    title: "Product Alert",
    message: "Your product 'Instagram Account - 50K' is running low on stock",
    time: "2 days ago",
    read: true,
    icon: AlertCircle,
    color: "from-red-500 to-red-700",
  },
  {
    id: 5,
    type: "success",
    title: "Order Completed",
    message: "Order #ORD-003 has been successfully delivered",
    time: "3 days ago",
    read: true,
    icon: CheckCircle2,
    color: "from-primary to-accent",
  },
];

const notificationSettings = [
  {
    id: "new_orders",
    title: "New Orders",
    description: "Get notified when you receive new orders",
    enabled: true,
  },
  {
    id: "payments",
    title: "Payment Notifications",
    description: "Receive notifications about payments and payouts",
    enabled: true,
  },
  {
    id: "reviews",
    title: "Reviews & Ratings",
    description: "Get notified when customers leave reviews",
    enabled: true,
  },
  {
    id: "messages",
    title: "Messages",
    description: "Receive notifications for new messages from buyers",
    enabled: true,
  },
  {
    id: "product_alerts",
    title: "Product Alerts",
    description: "Get alerts about low stock and product issues",
    enabled: false,
  },
  {
    id: "marketing",
    title: "Marketing & Promotions",
    description: "Receive tips and promotional opportunities",
    enabled: false,
  },
];

const SellerNotifications = () => {
  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Notifications
          </h1>
          <p className="text-foreground/60">Stay updated with your store activity</p>
        </div>

        {/* Notification Settings */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30"
              >
                <div className="flex-1">
                  <Label htmlFor={setting.id} className="text-base font-semibold text-foreground cursor-pointer">
                    {setting.title}
                  </Label>
                  <p className="text-sm text-foreground/60 mt-1">
                    {setting.description}
                  </p>
                </div>
                <Switch id={setting.id} defaultChecked={setting.enabled} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Notifications</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {notifications.filter(n => !n.read).length} New
            </Badge>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg glass-card border transition-all hover:border-border/50 ${
                    notification.read 
                      ? "border-border/30 opacity-70" 
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${notification.color} shrink-0`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-foreground/50">
                      <Clock className="h-3 w-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerNotifications;
