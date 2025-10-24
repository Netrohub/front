import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountLayout from '@/components/AccountLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  Shield, 
  CheckCircle, 
  Mail,
  Phone,
  User,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Search
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
];

const KYC = () => {
  const { t } = useLanguage();
  const { user, updateKYCStatus, completeKYC } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({
    email: user?.emailVerified || false,
    phone: user?.phoneVerified || false,
    identity: user?.kycStatus === 'verified',
  });

  // Update verification status when user data changes
  useEffect(() => {
    setVerificationStatus({
      email: user?.emailVerified || false,
      phone: user?.phoneVerified || false,
      identity: user?.kycStatus === 'verified',
    });
  }, [user]);

  // Auto-navigate to next incomplete step
  useEffect(() => {
    if (user) {
      const nextStep = getNextIncompleteStep();
      if (nextStep !== currentStep) {
        setCurrentStep(nextStep);
      }
    }
  }, [user, currentStep]);

  const steps = [
    {
      id: 1,
      title: t('Email Verification'),
      description: t('Verify your email address with a confirmation link'),
      icon: Mail,
      status: verificationStatus.email,
    },
    {
      id: 2,
      title: t('Phone Verification'),
      description: t('Verify your phone number with a verification code'),
      icon: Phone,
      status: verificationStatus.phone,
    },
    {
      id: 3,
      title: t('Identity Verification'),
      description: t('Verify your identity with Persona'),
      icon: User,
      status: verificationStatus.identity,
    },
  ];

  const getProgressPercentage = () => {
    return (currentStep / steps.length) * 100;
  };

  const isKYCCompleted = () => {
    return verificationStatus.email && verificationStatus.phone && verificationStatus.identity;
  };

  const getNextIncompleteStep = () => {
    if (!verificationStatus.email) return 1;
    if (!verificationStatus.phone) return 2;
    if (!verificationStatus.identity) return 3;
    return 3; // All completed
  };

  const canNavigateToStep = (step: number) => {
    if (step === 1) return true; // Always allow step 1
    if (step === 2) return verificationStatus.email; // Need email verified
    if (step === 3) return verificationStatus.email && verificationStatus.phone; // Need both email and phone
    return false;
  };

  const handleEmailVerification = async () => {
    try {
      toast.loading('Sending verification email...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update KYC status in database
      await updateKYCStatus('email', true);
      
      setVerificationStatus(prev => ({ ...prev, email: true }));
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Email Verification Failed');
    }
  };

  const handlePhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      toast.loading('Sending verification code...');
      
      // Simulate API call with full phone number
      const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber}`;
      console.log('Sending SMS to:', fullPhoneNumber);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update KYC status in database
      await updateKYCStatus('phone', true);
      
      setVerificationStatus(prev => ({ ...prev, phone: true }));
      toast.success('Phone verification code sent!');
    } catch (error) {
      toast.error('Phone Verification Failed');
    }
  };

  const handleIdentityVerification = async () => {
    try {
      toast.loading('Submitting verification...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update KYC status in database
      await updateKYCStatus('identity', true);
      
      setVerificationStatus(prev => ({ ...prev, identity: true }));
      toast.success('Verification submitted successfully!');
      
      // If all steps are complete, mark KYC as completed
      if (verificationStatus.email && verificationStatus.phone) {
        await completeKYC();
        toast.success('🎉 KYC verification completed! You can now access all seller features.');
      }
    } catch (error) {
      toast.error('Verification Failed');
    }
  };

  const renderCompletionScreen = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            KYC Verification Complete!
          </h2>
          <p className="text-foreground/60 mb-8">
            Congratulations! You have successfully completed all verification steps. You can now access all seller features on NXOLand.
          </p>
        </div>

        <Card className="glass-card p-6 border-green-500/30 bg-green-500/5">
          <div className="space-y-4">
            <h3 className="font-semibold text-green-400 mb-4">All Verification Steps Completed</h3>
            
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-sm text-foreground/60">{step.description}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          {user?.subscription?.plan === 'Elite' ? (
            <Button asChild className="flex-1 btn-glow">
              <Link to="/seller/dashboard">
                Go to Seller Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button 
              className="flex-1 btn-glow opacity-50 cursor-not-allowed" 
              disabled
              title="Elite plan required for seller dashboard"
            >
              Go to Seller Dashboard (Elite Only)
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
          <Button asChild variant="outline" className="flex-1">
            <Link to="/account/dashboard">
              Back to Account
            </Link>
          </Button>
        </div>

        <Card className="glass-card p-6 border-primary/30">
          <h3 className="font-semibold text-primary mb-4">What's Next?</h3>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li>• Start listing your products and services</li>
            <li>• Access advanced seller analytics</li>
            <li>• Manage your orders and customers</li>
            <li>• Set up your payment methods</li>
            <li>• Build your seller reputation</li>
          </ul>
        </Card>
      </div>
    );
  };

  const renderStepContent = () => {
    const currentStepData = steps.find(step => step.id === currentStep);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            {currentStepData?.icon && <currentStepData.icon className="h-10 w-10 text-primary" />}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {currentStepData?.title}
          </h2>
          <p className="text-foreground/60 mb-8">
            {currentStepData?.description}
          </p>
        </div>

        <Card className="glass-card p-6">
          <div className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                {verificationStatus.email ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Email Already Verified</span>
                    </div>
                    <p className="text-sm text-foreground/60 mb-4">
                      Your email has been successfully verified
                    </p>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="font-medium text-primary">{user?.email}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-foreground/60 mb-4">
                        We'll send a verification link to your email address
                      </p>
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Button onClick={handleEmailVerification} className="w-full btn-glow">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Verification Email
                    </Button>
                  </>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {verificationStatus.phone ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Phone Already Verified</span>
                    </div>
                    <p className="text-sm text-foreground/60 mb-4">
                      Your phone number has been successfully verified
                    </p>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="font-medium text-primary">{user?.phone || 'Phone number verified'}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-foreground/60 mb-4">
                        We'll send a verification code to your phone number
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={countryOpen}
                              className="w-[140px] justify-between"
                            >
                              <span className="flex items-center gap-2">
                                <span>{selectedCountry.flag}</span>
                                <span>{selectedCountry.dialCode}</span>
                              </span>
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {countries.map((country) => (
                                    <CommandItem
                                      key={country.code}
                                      value={`${country.name} ${country.dialCode} ${country.code}`}
                                      onSelect={() => {
                                        setSelectedCountry(country);
                                        setCountryOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.name}</span>
                                        <span className="text-muted-foreground">{country.dialCode}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      
                      <Button 
                        onClick={handlePhoneVerification} 
                        className="w-full btn-glow"
                        disabled={!phoneNumber || phoneNumber.length < 7}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Send Verification Code
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-foreground/60 mb-4">
                    Verify your identity with government ID and selfie
                  </p>
                </div>
                
                {!verificationStatus.identity ? (
                  <Button onClick={handleIdentityVerification} className="w-full btn-glow">
                    <Shield className="h-4 w-4 mr-2" />
                    Start Identity Verification
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>Identity Verified</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* KYC Completion Message */}
        {isKYCCompleted() && (
          <Card className="glass-card p-6 border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-green-500">KYC Verification Complete!</h3>
                <p className="text-sm text-foreground/60">
                  Your identity has been successfully verified. You can now access all platform features.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="flex-1">
                <Link to="/account/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/products">
                  Browse Products
                </Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Navigation */}
        {!isKYCCompleted() && (
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep < 3 && (
              <Button 
                onClick={() => {
                  const nextStep = getNextIncompleteStep();
                  if (canNavigateToStep(nextStep)) {
                    setCurrentStep(nextStep);
                  }
                }}
                className="flex-1 btn-glow"
                disabled={!canNavigateToStep(currentStep + 1)}
              >
                {currentStep === 1 && !verificationStatus.email ? 'Complete Email First' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Benefits */}
        <Card className="glass-card p-6 border-primary/30">
          <h3 className="font-semibold text-primary mb-4">Why do we need this?</h3>
          <ul className="space-y-2 text-sm text-foreground/60">
            <li>• Protect buyers and sellers from fraud</li>
            <li>• Comply with legal and regulatory requirements</li>
            <li>• Ensure secure transactions on the platform</li>
            <li>• Build trust in the NXOLand community</li>
          </ul>
        </Card>
      </div>
    );
  };

  // Show completion screen if KYC is fully completed
  if (isKYCCompleted()) {
    return (
      <AccountLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              KYC Verification Complete
            </h1>
            <p className="text-foreground/60">
              All verification steps have been successfully completed
            </p>
          </div>

          {/* Completion Screen */}
          <Card className="glass-card p-8">
            {renderCompletionScreen()}
          </Card>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-foreground mb-2">
            Identity Verification
          </h1>
          <p className="text-foreground/60">
            Complete all verification steps to start selling on NXOLand
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-foreground/60">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <Card 
              key={step.id} 
              className={`glass-card p-4 ${
                currentStep === step.id ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status ? 'bg-green-500/20 text-green-400' : 
                  currentStep === step.id ? 'bg-primary/20 text-primary' : 
                  'bg-foreground/10 text-foreground/40'
                }`}>
                  {step.status ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-foreground/60">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Current Step Content */}
        <Card className="glass-card p-8">
          {renderStepContent()}
        </Card>
      </div>
    </AccountLayout>
  );
};

export default KYC;