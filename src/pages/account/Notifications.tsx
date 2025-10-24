import { useState, useEffect } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  ShoppingBag, 
  DollarSign, 
  MessageSquare,
  Star,
  Package,
  CheckCircle2
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "order",
    icon: ShoppingBag,
    title: "New Order Received",
    message: "User#1234 purchased your Steam Account",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    icon: DollarSign,
    title: "Payment Received",
    message: "Payment of $449.99 has been credited to your wallet",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "review",
    icon: Star,
    title: "New Review",
    message: "User#5678 left a 5-star review on your product",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "message",
    icon: MessageSquare,
    title: "New Message",
    message: "Buyer has sent you a message about Instagram Account",
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    type: "product",
    icon: Package,
    title: "Product Approved",
    message: "Your product 'PlayStation Plus Premium' has been approved",
    time: "2 days ago",
    read: true,
  },
];

const getIconColor = (type: string) => {
  switch (type) {
    case "order":
      return "text-blue-500";
    case "payment":
      return "text-primary";
    case "review":
      return "text-yellow-500";
    case "message":
      return "text-accent";
    case "product":
      return "text-green-500";
    default:
      return "text-foreground";
  }
};

const Notifications = () => {
  const { toast } = useToast();
  const [notificationList, setNotificationList] = useState(notifications);
  const unreadCount = notificationList.filter((n) => !n.read).length;
  
  // Notification preferences state
  const [preferences, setPreferences] = useState({
    orderNotifications: true,
    paymentNotifications: true,
    messageNotifications: true,
    reviewNotifications: true,
    marketingEmails: false,
  });

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('user_notification_preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleMarkAllAsRead = () => {
    setNotificationList(notificationList.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications updated.`,
    });
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Save to localStorage
    localStorage.setItem('user_notification_preferences', JSON.stringify(newPreferences));
    
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Notifications
            </h1>
            <p className="text-foreground/60">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="glass-card border-border/50"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        </div>

        {/* Notification Preferences */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="order-notifications" className="text-base font-semibold text-foreground">
                  Order Notifications
                </Label>
                <p className="text-sm text-foreground/60">Get notified when you receive new orders</p>
              </div>
              <Switch 
                id="order-notifications" 
                checked={preferences.orderNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('orderNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="payment-notifications" className="text-base font-semibold text-foreground">
                  Payment Notifications
                </Label>
                <p className="text-sm text-foreground/60">Get notified about payment transactions</p>
              </div>
              <Switch 
                id="payment-notifications" 
                checked={preferences.paymentNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('paymentNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications" className="text-base font-semibold text-foreground">
                  Message Notifications
                </Label>
                <p className="text-sm text-foreground/60">Get notified about new messages</p>
              </div>
              <Switch 
                id="message-notifications" 
                checked={preferences.messageNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('messageNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="review-notifications" className="text-base font-semibold text-foreground">
                  Review Notifications
                </Label>
                <p className="text-sm text-foreground/60">Get notified about new reviews</p>
              </div>
              <Switch 
                id="review-notifications" 
                checked={preferences.reviewNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('reviewNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-notifications" className="text-base font-semibold text-foreground">
                  Marketing Emails
                </Label>
                <p className="text-sm text-foreground/60">Receive promotional offers and updates</p>
              </div>
              <Switch 
                id="marketing-notifications" 
                checked={preferences.marketingEmails}
                onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
              />
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    notification.read
                      ? "glass-card border border-border/30"
                      : "glass-card border border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-muted/50 ${getIconColor(notification.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-foreground/60 whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70">{notification.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Empty State Alternative */}
        {notifications.length === 0 && (
          <Card className="glass-card p-12 text-center">
            <div className="inline-flex p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No notifications yet</h3>
            <p className="text-foreground/60">
              You'll see notifications here when you have activity
            </p>
          </Card>
        )}
      </div>
    </AccountLayout>
  );
};

export default Notifications;
