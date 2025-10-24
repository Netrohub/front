import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export interface KYCStatus {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'incomplete';
  steps: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const KYCStatusComponent: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Mock KYC status - in real app, this would come from API
  const kycStatus: KYCStatus = {
    id: 'kyc-001',
    status: user?.emailVerified && user?.phoneVerified && user?.kycStatus === 'verified' ? 'approved' : 'incomplete',
    steps: {
      email: user?.emailVerified || false,
      phone: user?.phoneVerified || false,
      identity: user?.kycStatus === 'verified' || false,
    },
    submittedAt: undefined,
    reviewedAt: undefined,
  };

  const completedSteps = Object.values(kycStatus.steps).filter(Boolean).length;
  const totalSteps = Object.keys(kycStatus.steps).length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = () => {
    switch (kycStatus.status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus.status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Under Review</Badge>;
      default:
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Incomplete</Badge>;
    }
  };

  const kycSteps = [
    {
      key: 'email',
      title: t('Email Verification'),
      description: t('Verify your email address with a confirmation link'),
      completed: kycStatus.steps.email,
      required: true,
    },
    {
      key: 'phone',
      title: t('Phone Verification'),
      description: t('Verify your phone number with a verification code'),
      completed: kycStatus.steps.phone,
      required: true,
    },
    {
      key: 'identity',
      title: t('Identity Verification'),
      description: t('Verify your identity with Persona'),
      completed: kycStatus.steps.identity,
      required: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KYC Status Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">{t('kyc.verificationStatus')}</CardTitle>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <p className="font-semibold">
                  {kycStatus.status === 'approved' && t('kyc.fullyVerified')}
                  {kycStatus.status === 'rejected' && t('kyc.verificationRejected')}
                  {kycStatus.status === 'pending' && t('kyc.underReview')}
                  {kycStatus.status === 'incomplete' && t('kyc.verificationIncomplete')}
                </p>
                <p className="text-sm text-foreground/70">
                  {completedSteps} of {totalSteps} steps completed
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {kycStatus.status === 'rejected' && kycStatus.rejectionReason && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500 font-medium">Rejection Reason:</p>
                <p className="text-sm text-red-500/80">{kycStatus.rejectionReason}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KYC Steps */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">{t('kyc.verificationSteps')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycSteps.map((step, index) => (
              <div key={step.key} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                <div className="flex-shrink-0 mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-foreground/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground/50">{index + 1}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{step.title}</h4>
                    {step.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground/70 mt-1">{step.description}</p>
                </div>
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                      Completed
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/account/kyc/${step.key}`}>
                        {t('kyc.complete')}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {kycStatus.status === 'incomplete' && (
          <Button asChild className="btn-glow">
            <Link to="/account/kyc/start">
              {t('kyc.startVerification')}
            </Link>
          </Button>
        )}
        
        {kycStatus.status === 'rejected' && (
          <Button asChild variant="outline">
            <Link to="/account/kyc/resubmit">
              {t('kyc.resubmitDocuments')}
            </Link>
          </Button>
        )}

        {kycStatus.status === 'pending' && (
          <Button variant="outline" disabled>
            <Clock className="h-4 w-4 mr-2" />
            {t('kyc.underReview')}
          </Button>
        )}

        {kycStatus.status === 'approved' && (
          <Button variant="outline" asChild>
            <Link to="/seller/dashboard">
              {t('kyc.goToSellerDashboard')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default KYCStatusComponent;
