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

  const handleStartVerification = () => {
    setIsLoading(true);
    
    try {
      // Redirect to Persona's hosted verification page
      // This is the most reliable method
      const personaUrl = `https://withpersona.com/verify?template-id=${PERSONA_TEMPLATE_ID}&environment=sandbox`;
      
      // Open in new window
      const personaWindow = window.open(
        personaUrl,
        'PersonaVerification',
        'width=600,height=800,resizable=yes,scrollbars=yes'
      );

      if (!personaWindow) {
        // If popup is blocked, try redirecting in same window
        console.log('Popup blocked, redirecting in same window...');
        window.location.href = personaUrl;
        setIsLoading(false);
        return;
      }

      console.log('✅ Persona verification window opened');

      // For now, just show success after opening
      // In production, you would implement webhook handling on the backend
      // to detect when verification is complete
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      // Note: The actual verification completion will be handled via webhook
      // which we already implemented in the backend
      
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
