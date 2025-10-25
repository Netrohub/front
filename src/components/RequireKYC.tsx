import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface RequireKYCProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const RequireKYC: React.FC<RequireKYCProps> = ({ 
  children, 
  fallbackPath = '/account/kyc' 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Check KYC status based on user data
  const isEmailVerified = user?.emailVerified || false;
  const isPhoneVerified = user?.phoneVerified || false;
  const isIdentityVerified = user?.kycStatus === 'verified';
  
  const kycStatus = {
    isVerified: isEmailVerified && isPhoneVerified && isIdentityVerified,
    status: isEmailVerified && isPhoneVerified && isIdentityVerified ? 'approved' : 'incomplete',
    completedSteps: [isEmailVerified, isPhoneVerified, isIdentityVerified].filter(Boolean).length,
    totalSteps: 3,
  };

  // If KYC is not verified, redirect to KYC page
  if (!kycStatus.isVerified) {
    return <Navigate to="/account/kyc" replace />;
  }

  // If KYC is verified, render the children
  return <>{children}</>;
};

export default RequireKYC;
