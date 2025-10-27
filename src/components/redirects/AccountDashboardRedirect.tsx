import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AccountDashboardRedirect = () => {
  useEffect(() => {
    // Log the redirect for debugging
    console.log('🔄 Redirecting /account/dashboard → /dashboard?tab=buyer');
  }, []);

  return <Navigate to="/dashboard?tab=buyer" replace />;
};

export default AccountDashboardRedirect;
