import DashboardLayout from "@/components/DashboardLayout";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BuyerTab from "@/components/dashboard/BuyerTab";
import SellerTab from "@/components/dashboard/SellerTab";
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
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <OverviewTab />
        </TabsContent>

        {/* Buyer Tab */}
        <TabsContent value="buyer" className="mt-0">
          <BuyerTab />
        </TabsContent>

        {/* Seller Tab - Only available if user has active listings */}
        {hasActiveListings && (
          <TabsContent value="seller" className="mt-0">
            <SellerTab />
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default Dashboard;
