import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  User,
  CreditCard,
  Bell,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";

const menuItems = [
  { path: "/seller/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/seller/profile", icon: User, label: "Profile" },
  { path: "/seller/products", icon: Package, label: "Products" },
  { path: "/seller/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/seller/billing", icon: CreditCard, label: "Billing" },
  { path: "/seller/notifications", icon: Bell, label: "Notifications" },
  { path: "/seller/analytics", icon: BarChart3, label: "Analytics" },
];

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout = ({ children }: SellerLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <Card className="glass-card p-4 sticky top-4">
                <div className="mb-4 pb-4 border-b border-border/30">
                  <p className="text-xs text-foreground/60 mb-1">Seller Dashboard</p>
                  <h3 className="font-bold text-foreground">Manage Your Store</h3>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </Card>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerLayout;
