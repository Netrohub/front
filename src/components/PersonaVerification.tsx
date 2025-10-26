import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface PersonaVerificationProps {
  onComplete?: (inquiryId: string) => void;
  onError?: (error: Error) => void;
}

const PersonaVerification: React.FC<PersonaVerificationProps> = ({ 
  onComplete, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartVerification = async () => {
    setIsLoading(true);
    
    try {
      // Call backend to create Persona inquiry
      const response = await apiClient.post('/api/kyc/create-persona-inquiry');
      
      const { inquiryId, verificationUrl } = response.data;

      console.log('✅ Persona inquiry created:', inquiryId);

      // Redirect to Persona verification
      if (verificationUrl) {
        const personaWindow = window.open(
          verificationUrl,
          'PersonaVerification',
          'width=600,height=800,resizable=yes,scrollbars=yes'
        );

        if (!personaWindow) {
          // If popup is blocked, redirect in same window
          console.log('Popup blocked, redirecting in same window...');
          window.location.href = verificationUrl;
        }
      } else {
        throw new Error('No verification URL returned from Persona');
      }

      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Error starting Persona verification:', error);
      setIsLoading(false);
      onError?.(new Error(error?.response?.data?.message || 'Failed to start verification'));
    }
  };

  return (
    <Card className="p-6 border-2 border-primary/20">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">Identity Verification</h3>
          <p className="text-muted-foreground mb-4">
            Verify your identity with Persona to complete your KYC
          </p>
        </div>

        <Button
          onClick={handleStartVerification}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Verification...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Identity Verification
            </>
          )}
        </Button>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Setting up verification...
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Note: If a popup window doesn't open, please allow popups for this site.
        </p>
      </div>
    </Card>
  );
};

export default PersonaVerification;
