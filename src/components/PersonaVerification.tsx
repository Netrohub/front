import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

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
  const PERSONA_API_KEY = 'sk_test_c7fca5cf-4d36-4466-a8a0-cc4657055617'; // Sandbox key

  const handleStartVerification = async () => {
    setIsLoading(true);
    
    try {
      // Create an inquiry using Persona API
      const response = await fetch('https://api.withpersona.com/api/v1/inquiries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERSONA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            type: 'inquiry',
            attributes: {
              template_id: PERSONA_TEMPLATE_ID,
              reference_id: `user_${Date.now()}`, // Unique reference
            }
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create Persona inquiry');
      }

      const result = await response.json();
      const inquiryId = result.data.id;
      const inquiryUrl = result.data.attributes.url;

      console.log('✅ Persona inquiry created:', inquiryId);

      // Redirect to Persona verification
      if (inquiryUrl) {
        const personaWindow = window.open(
          inquiryUrl,
          'PersonaVerification',
          'width=600,height=800,resizable=yes,scrollbars=yes'
        );

        if (!personaWindow) {
          // If popup is blocked, redirect in same window
          console.log('Popup blocked, redirecting in same window...');
          window.location.href = inquiryUrl;
        }
      } else {
        throw new Error('No verification URL returned from Persona');
      }

      setIsLoading(false);
      
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
