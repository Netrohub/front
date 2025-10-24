import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, RouterProvider, createBrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import AnalyticsProvider from "./components/AnalyticsProvider";
import RequireAuth from "./components/RequireAuth";
import RequireKYC from "./components/RequireKYC";
import { Loader2 } from "lucide-react";

// Eagerly loaded pages (critical for initial render)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Games = lazy(() => import("./pages/Games"));
const Members = lazy(() => import("./pages/Members"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const CategoryLanding = lazy(() => import("./pages/CategoryLanding"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Account pages (lazy loaded)
const Dashboard = lazy(() => import("./pages/account/Dashboard"));
const Profile = lazy(() => import("./pages/account/Profile"));
const Wallet = lazy(() => import("./pages/account/Wallet"));
const Orders = lazy(() => import("./pages/account/Orders"));
const OrderDetail = lazy(() => import("./pages/account/OrderDetail"));
const Notifications = lazy(() => import("./pages/account/Notifications"));
const Billing = lazy(() => import("./pages/account/Billing"));
const AccountWishlist = lazy(() => import("./pages/account/Wishlist"));
const KYC = lazy(() => import("./pages/account/KYC"));

// Seller pages (lazy loaded)
const SellerDashboard = lazy(() => import("./pages/seller/Dashboard"));
const SellerAnalytics = lazy(() => import("./pages/seller/Analytics"));
const SellerProducts = lazy(() => import("./pages/seller/Products"));
const CreateProduct = lazy(() => import("./pages/seller/CreateProduct"));
const SellerOrders = lazy(() => import("./pages/seller/Orders"));
const SellerProfilePage = lazy(() => import("./pages/seller/Profile"));
const SellerBilling = lazy(() => import("./pages/seller/Billing"));
const SellerNotifications = lazy(() => import("./pages/seller/Notifications"));
const SellerOnboarding = lazy(() => import("./pages/seller/SellerOnboarding"));
const ListGamingAccount = lazy(() => import("./pages/seller/ListGamingAccount"));
const ListSocialAccount = lazy(() => import("./pages/seller/ListSocialAccount"));

// Dispute pages (lazy loaded)
const DisputeList = lazy(() => import("./pages/disputes/DisputeList"));
const CreateDispute = lazy(() => import("./pages/disputes/CreateDispute"));
const DisputeDetail = lazy(() => import("./pages/disputes/DisputeDetail"));

// Admin pages (lazy loaded) - removed AdminDisputesOld as it's now handled in admin panel

// Admin panel components (lazy loaded)
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const AdminDashboard = lazy(() => import("./features/dashboard/DashboardPage"));
const AdminUsers = lazy(() => import("./features/users/list"));
const AdminUsersCreate = lazy(() => import("./features/users/create"));
const AdminVendors = lazy(() => import("./features/vendors/list"));
const AdminListings = lazy(() => import("./features/listings/list"));
const AdminOrders = lazy(() => import("./features/orders/list"));
const AdminDisputesNew = lazy(() => import("./features/disputes/list"));
const AdminPayouts = lazy(() => import("./features/payouts/list"));
const AdminCategories = lazy(() => import("./features/categories/list"));
const AdminCoupons = lazy(() => import("./features/coupons/list"));
const AdminTickets = lazy(() => import("./features/tickets/list"));
const AdminAuditLogs = lazy(() => import("./features/audit-logs/list"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="glass-card p-8 flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-foreground/70">Loading...</p>
    </div>
  </div>
);

// Configure React Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Coming Soon Component
const ComingSoon = () => {
  useEffect(() => {
    // Redirect to the coming soon page
    window.location.href = '/coming-soon.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-foreground/70">Redirecting to coming soon page...</p>
      </div>
    </div>
  );
};

const App = () => {
  // Check if coming soon mode is enabled
  const isComingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === 'true';

  // If coming soon mode is enabled, show the coming soon component
  if (isComingSoonMode) {
    return <ComingSoon />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AnalyticsProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/games" element={<Games />} />
          <Route path="/members" element={<Members />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:category" element={<CategoryLanding />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/seller/:seller" element={<SellerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/account" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/account/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/account/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/account/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
          <Route path="/account/wishlist" element={<RequireAuth><AccountWishlist /></RequireAuth>} />
          <Route path="/account/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/account/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
          <Route path="/account/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/account/billing" element={<RequireAuth><Billing /></RequireAuth>} />
          <Route path="/account/kyc" element={<RequireAuth><KYC /></RequireAuth>} />
          <Route path="/account/kyc/:step" element={<RequireAuth><KYC /></RequireAuth>} />
          <Route path="/seller/dashboard" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><SellerDashboard /></RequireKYC></RequireAuth>} />
          <Route path="/seller/analytics" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><SellerAnalytics /></RequireKYC></RequireAuth>} />
          <Route path="/seller/onboarding" element={<RequireAuth><SellerOnboarding /></RequireAuth>} />
          <Route path="/seller/profile" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><SellerProfilePage /></RequireKYC></RequireAuth>} />
          <Route path="/seller/products" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><SellerProducts /></RequireKYC></RequireAuth>} />
          <Route path="/seller/products/create" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><CreateProduct /></RequireKYC></RequireAuth>} />
          <Route path="/seller/list/social" element={<RequireAuth requiredRoles={['seller', 'admin']}><RequireKYC><ListSocialAccount /></RequireKYC></RequireAuth>} />
          <Route path="/seller/list/gaming" element={<RequireAuth requiredRoles={['seller', 'admin']}><ListGamingAccount /></RequireAuth>} />
          <Route path="/seller/orders" element={<RequireAuth requiredRoles={['seller', 'admin']}><SellerOrders /></RequireAuth>} />
          <Route path="/seller/billing" element={<RequireAuth requiredRoles={['seller', 'admin']}><SellerBilling /></RequireAuth>} />
          <Route path="/seller/notifications" element={<RequireAuth requiredRoles={['seller', 'admin']}><SellerNotifications /></RequireAuth>} />
          <Route path="/disputes" element={<RequireAuth><DisputeList /></RequireAuth>} />
          <Route path="/disputes/create" element={<RequireAuth><CreateDispute /></RequireAuth>} />
          <Route path="/disputes/:id" element={<RequireAuth><DisputeDetail /></RequireAuth>} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<RequireAuth requiredRoles={['admin']}><AdminPanel /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<AdminUsersCreate />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="disputes" element={<AdminDisputesNew />} />
            <Route path="payouts" element={<AdminPayouts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnalyticsProvider>
        </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
  );
};

export default App;
