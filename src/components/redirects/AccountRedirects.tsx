import { Navigate, useLocation } from "react-router-dom";

/**
 * Redirects old /account/* routes to new unified /dashboard?tab=* format
 * This maintains backward compatibility with old account page links
 */

export const AccountProfileRedirect = () => {
  return <Navigate to="/dashboard?tab=profile" replace />;
};

export const AccountOrdersRedirect = () => {
  return <Navigate to="/dashboard?tab=orders" replace />;
};

export const AccountWalletRedirect = () => {
  return <Navigate to="/dashboard?tab=wallet" replace />;
};

export const AccountNotificationsRedirect = () => {
  return <Navigate to="/dashboard?tab=notifications" replace />;
};

export const AccountBillingRedirect = () => {
  return <Navigate to="/dashboard?tab=billing" replace />;
};

export const AccountKYCRedirect = () => {
  return <Navigate to="/dashboard?tab=kyc" replace />;
};

// General /account redirect (without specific page)
export const AccountDashboardGenericRedirect = () => {
  const location = useLocation();
  
  // If at /account root, redirect to dashboard overview
  if (location.pathname === "/account" || location.pathname === "/account/") {
    return <Navigate to="/dashboard?tab=overview" replace />;
  }
  
  // Otherwise, redirect to dashboard overview as fallback
  return <Navigate to="/dashboard?tab=overview" replace />;
};

