import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Role-based access removed - all authenticated users can access all routes
  // if (requiredRoles.length > 0 && user) {
  //   const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));
  //   
  //   if (!hasRequiredRole) {
  //     // Redirect to unauthorized page with context
  //     return <Navigate to="/unauthorized" state={{ 
  //       from: location.pathname,
  //       requiredRoles: requiredRoles,
  //       userRoles: user.roles 
  //     }} replace />;
  //   }
  // }

  return <>{children}</>;
};

export default RequireAuth;
