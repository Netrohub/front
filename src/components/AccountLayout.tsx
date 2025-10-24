import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  Wallet, 
  Bell, 
  CreditCard,
  ShieldCheck,
  Settings,
  Menu
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const baseMenuItems = [
  { path: "/account", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/account/profile", icon: User, label: "Profile" },
  { path: "/account/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/account/wallet", icon: Wallet, label: "Wallet" },
  { path: "/account/notifications", icon: Bell, label: "Notifications" },
  { path: "/account/billing", icon: CreditCard, label: "Billing" },
];

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if KYC is completed
  const isKYCCompleted = user?.emailVerified && user?.phoneVerified && user?.kycStatus === 'verified';
  
  // Build menu items conditionally
  const menuItems = [...baseMenuItems];
  
  // Only show KYC verification if not completed
  if (!isKYCCompleted) {
    menuItems.push({ path: "/account/kyc", icon: ShieldCheck, label: "KYC Verification" });
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-4 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <Card className="glass-card p-4 sticky top-4">
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

            {/* Mobile Sidebar */}
            <aside className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full glass-card border-primary/30">
                    <Menu className="h-4 w-4 mr-2" />
                    Account Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="glass-card border-border/50 w-80">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Account</h2>
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
                  </div>
                </SheetContent>
              </Sheet>
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

export default AccountLayout;
