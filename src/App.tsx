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
import Unauthorized from "./pages/Unauthorized";

// Lazy loaded pages
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Games = lazy(() => import("./pages/Games"));
const Members = lazy(() => import("./pages/Members"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CategoryLanding = lazy(() => import("./pages/CategoryLanding"));
const SocialMediaComingSoon = lazy(() => import("./pages/SocialMediaComingSoon"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Unified Dashboard (lazy loaded)
const UnifiedDashboard = lazy(() => import("./pages/Dashboard"));

// Account pages (lazy loaded) - Only detail/standalone pages remain
const OrderDetail = lazy(() => import("./pages/account/OrderDetail"));
const AccountWishlist = lazy(() => import("./pages/account/Wishlist"));

// Sell page (product listing)
const SellPage = lazy(() => import("./pages/Sell"));

// Redirect components (lazy loaded for code splitting)
const AccountDashboardRedirect = lazy(() => import("./components/redirects/AccountDashboardRedirect"));
// Account page redirects (moved to unified dashboard)
const AccountProfileRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountProfileRedirect })));
const AccountOrdersRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountOrdersRedirect })));
const AccountWalletRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountWalletRedirect })));
const AccountNotificationsRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountNotificationsRedirect })));
const AccountBillingRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountBillingRedirect })));
const AccountKYCRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountKYCRedirect })));
const AccountDashboardGenericRedirect = lazy(() => import("./components/redirects/AccountRedirects").then(m => ({ default: m.AccountDashboardGenericRedirect })));

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
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
      refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
      retry: 1,
      retryDelay: 1000, // 1 second between retries
    },
    mutations: {
      retry: 0, // Don't retry mutations by default
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
          <Route path="/products/category/:category" element={<CategoryLanding />} />
          <Route path="/category/:category" element={<CategoryLanding />} />
          <Route path="/social-media-coming-soon" element={<SocialMediaComingSoon />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/help" element={<HelpCenter />} />
          
          {/* User profile routes */}
          <Route path="/@:username" element={<UserProfilePage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* New unified dashboard route */}
          <Route path="/dashboard" element={<RequireAuth><UnifiedDashboard /></RequireAuth>} />
          
          {/* Legacy redirects for old account routes - now redirecting to unified dashboard */}
          <Route path="/account" element={<RequireAuth><AccountDashboardGenericRedirect /></RequireAuth>} />
          <Route path="/account/dashboard" element={<RequireAuth><AccountDashboardRedirect /></RequireAuth>} />
          <Route path="/account/profile" element={<RequireAuth><AccountProfileRedirect /></RequireAuth>} />
          <Route path="/account/wallet" element={<RequireAuth><AccountWalletRedirect /></RequireAuth>} />
          <Route path="/account/orders" element={<RequireAuth><AccountOrdersRedirect /></RequireAuth>} />
          <Route path="/account/notifications" element={<RequireAuth><AccountNotificationsRedirect /></RequireAuth>} />
          <Route path="/account/billing" element={<RequireAuth><AccountBillingRedirect /></RequireAuth>} />
          <Route path="/account/kyc" element={<RequireAuth><AccountKYCRedirect /></RequireAuth>} />
          <Route path="/account/kyc/:step" element={<RequireAuth><AccountKYCRedirect /></RequireAuth>} />
          {/* Standalone account pages (detail/secondary pages) */}
          <Route path="/account/wishlist" element={<RequireAuth><AccountWishlist /></RequireAuth>} />
          <Route path="/account/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
          
          {/* Sell page - Product listing */}
          <Route path="/sell" element={<RequireAuth><SellPage /></RequireAuth>} />
          <Route path="/disputes" element={<RequireAuth><DisputeList /></RequireAuth>} />
          <Route path="/disputes/create" element={<RequireAuth><CreateDispute /></RequireAuth>} />
          <Route path="/disputes/:id" element={<RequireAuth><DisputeDetail /></RequireAuth>} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<AdminUsersCreate />} />
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
