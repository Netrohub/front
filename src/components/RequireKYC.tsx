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

  // If KYC is not verified, show the KYC requirement screen
  if (!kycStatus.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl mb-2">
              {t('Verification Required')}
            </CardTitle>
            <p className="text-foreground/70">
              {t('Verify your account to access all features')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* KYC Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Progress</span>
                <span className="text-sm text-foreground/70">
                  {kycStatus.completedSteps} of {kycStatus.totalSteps} steps completed
                </span>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(kycStatus.completedSteps / kycStatus.totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Status Message */}
            <div className="p-4 rounded-lg border border-orange-500/20 bg-orange-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-500 mb-1">
                    {t('Your Access is Restricted')}
                  </h4>
                  <p className="text-sm text-orange-500/80">
                    {t('Please Complete Your Verification')}
                  </p>
                </div>
              </div>
            </div>

            {/* Required Steps */}
            <div className="space-y-3">
              <h4 className="font-semibold">Required Steps</h4>
              <div className="space-y-2">
                {[
                  { key: 'email', label: 'Email Verification', completed: isEmailVerified },
                  { key: 'phone', label: 'Phone Verification', completed: isPhoneVerified },
                  { key: 'identity', label: 'Identity Verification', completed: isIdentityVerified },
                ].map((step) => (
                  <div key={step.key} className="flex items-center gap-3 p-2 rounded-lg border border-border/50">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-foreground/30" />
                    )}
                    <span className={`text-sm ${step.completed ? 'text-green-500' : 'text-foreground/70'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button asChild className="btn-glow flex-1">
                <Link to="/account/kyc">
                  {t('Complete Your Verification')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/account/dashboard">
                  {t('Back To Account')}
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <h4 className="font-semibold text-primary mb-2">{t('Verification Benefits')}</h4>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• {t('benefit1')}</li>
                <li>• {t('benefit2')}</li>
                <li>• {t('benefit3')}</li>
                <li>• {t('benefit4')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If KYC is verified, render the children
  return <>{children}</>;
};

export default RequireKYC;
