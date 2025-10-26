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
  const PERSONA_TEMPLATE_ID = 'vtmpl_gnPSyThsGJMjMqU3rpS1DoXQ69rr';

  const handleStartVerification = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting Persona verification...');
      
      // Call backend to create Persona inquiry using the request method
      const response = await apiClient.request<{ inquiryId: string; verificationUrl: string }>(
        '/kyc/create-persona-inquiry',
        {
          method: 'POST',
        }
      );
      
      console.log('📦 Full backend response:', response);
      console.log('📦 Response type:', typeof response);
      console.log('📦 Response keys:', Object.keys(response || {}));
      console.log('📦 Response.data:', response.data);

      // The response should be wrapped in { data: { ... } }
      const { inquiryId, verificationUrl } = response.data || response;

      console.log('✅ Extracted inquiryId:', inquiryId);
      console.log('✅ Extracted verificationUrl:', verificationUrl);

      // Redirect to Persona verification
      if (verificationUrl) {
        console.log('🔗 Opening verification URL:', verificationUrl);
        const personaWindow = window.open(
          verificationUrl,
          'PersonaVerification',
          'width=600,height=800,resizable=yes,scrollbars=yes'
        );

        if (!personaWindow) {
          // If popup is blocked, redirect in same window
          console.log('⚠️ Popup blocked, redirecting in same window...');
          window.location.href = verificationUrl;
        }
      } else {
        console.error('❌ No verificationUrl found in response');
        throw new Error('No verification URL returned from Persona');
      }

      setIsLoading(false);
      
    } catch (error: any) {
      console.error('❌ Error starting Persona verification:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        stack: error?.stack,
        response: error?.response,
      });
      setIsLoading(false);
      onError?.(new Error(error?.message || 'Failed to start verification'));
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
              Opening Verification...
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
            A new window will open for verification...
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
