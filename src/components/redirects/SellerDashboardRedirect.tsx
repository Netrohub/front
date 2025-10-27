import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const SellerDashboardRedirect = () => {
  useEffect(() => {
    // Log the redirect for debugging
    console.log('🔄 Redirecting /seller/dashboard → /dashboard?tab=seller');
  }, []);

  return <Navigate to="/dashboard?tab=seller" replace />;
};

export default SellerDashboardRedirect;
