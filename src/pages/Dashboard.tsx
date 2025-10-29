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
import { TabsContent } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Get current tab from URL params, default to 'overview'
  const currentTab = searchParams.get('tab') || 'overview';
  
  // Check if user has seller role (has any active or pending listings)
  const hasSellingsRole = user?.roles?.includes('seller') || false;
  
  // Check if user has active products - this would come from API but for now using role
  const hasActiveListings = hasSellingsRole;
  
  // Dynamic page titles based on current tab
  const tabTitles: Record<string, string> = {
    overview: 'Dashboard Overview',
    buyer: 'Buyer Dashboard',
    seller: 'Seller Dashboard',
    profile: 'Profile Settings',
    orders: 'Order History',
    wallet: 'Wallet',
    notifications: 'Notifications',
    billing: 'Billing & Payments',
    kyc: 'KYC Verification'
  };
  
  const currentTabTitle = tabTitles[currentTab] || 'Dashboard';

  return (
    <>
      <Helmet>
        <title>{currentTabTitle} - NXOLand</title>
        <meta name="description" content={`Manage your NXOLand account - ${currentTabTitle}. View orders, manage wallet, update profile, and more.`} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://nxoland.com/dashboard?tab=${currentTab}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${currentTabTitle} - NXOLand`} />
        <meta property="og:description" content={`Manage your NXOLand account - ${currentTabTitle}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nxoland.com/dashboard?tab=${currentTab}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${currentTabTitle} - NXOLand`} />
        <meta name="twitter:description" content={`Manage your NXOLand account - ${currentTabTitle}`} />
      </Helmet>
      
      <DashboardLayout>
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
    </DashboardLayout>
    </>
  );
};

export default Dashboard;
