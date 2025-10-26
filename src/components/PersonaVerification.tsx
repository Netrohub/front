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
      console.log('🚀 Starting Persona verification...');
      console.log('🔍 API Client:', apiClient);
      console.log('🔍 API Client baseURL:', (apiClient as any).baseURL);
      
      const url = '/kyc/create-persona-inquiry';
      console.log('🔗 Calling URL:', url);
      
      // Call backend to create Persona inquiry
      console.log('📞 About to call apiClient.request with:', { url, method: 'POST' });
      const response = await apiClient.request<{ inquiryId: string; verificationUrl: string }>(
        url,
        {
          method: 'POST',
        }
      );
      
      console.log('✅ Got response from apiClient.request');
      console.log('📦 Full backend response:', response);

      // Extract verification URL from backend response
      const result = response.data || response;
      const { inquiryId, verificationUrl } = result;

      console.log('✅ Extracted inquiryId:', inquiryId);
      console.log('✅ Extracted verificationUrl:', verificationUrl);

      if (!verificationUrl) {
        throw new Error('No verification URL returned from backend');
      }

      // Log the URL for debugging
      console.log('🔗 Opening Persona verification URL:', verificationUrl);
      
      // Open Persona verification in same tab (blank issue fix)
      window.location.href = verificationUrl;
      setIsLoading(false);
      
      // DON'T call onComplete here - only call it after webhook confirms verification is done
      // The webhook will be triggered by Persona when the verification is actually completed
      
    } catch (error) {
      console.error('Error starting Persona verification:', error);
      setIsLoading(false);
      onError?.(error as Error);
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
