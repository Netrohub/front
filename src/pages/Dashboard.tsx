import DashboardLayout from "@/components/DashboardLayout";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BuyerTab from "@/components/dashboard/BuyerTab";
import SellerTab from "@/components/dashboard/SellerTab";
// Account page imports (wrapped as tabs)
import ProfilePage from "@/pages/account/Profile";
import OrdersPage from "@/pages/account/Orders";
import WalletPage from "@/pages/account/Wallet";
import NotificationsPage from "@/pages/account/Notifications";
import BillingPage from "@/pages/account/Billing";
import KYCPage from "@/pages/account/KYC";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get current tab from URL params, default to 'overview'
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Check if user has seller role (has any active or pending listings)
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if user has active products - this would come from API but for now using role
  const hasActiveListings = hasSellingsRole;

  return (
    <DashboardLayout>
      <Tabs value={currentTab} className="space-y-6">
        {/* Main Dashboard Tabs */}
        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="buyer" className="mt-0">
          <BuyerTab />
        </TabsContent>

        {/* Seller Tab - Only available if user has active listings */}
        {hasActiveListings && (
          <TabsContent value="seller" className="mt-0">
            <SellerTab />
          </TabsContent>
        )}

        {/* Account Management Tabs */}
        <TabsContent value="profile" className="mt-0">
          <div className="max-w-5xl">
            <ProfilePage />
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <div className="max-w-6xl">
            <OrdersPage />
          </div>
        </TabsContent>

        <TabsContent value="wallet" className="mt-0">
          <div className="max-w-5xl">
            <WalletPage />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <div className="max-w-4xl">
            <NotificationsPage />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-0">
          <div className="max-w-5xl">
            <BillingPage />
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="mt-0">
          <div className="max-w-5xl">
            <KYCPage />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
