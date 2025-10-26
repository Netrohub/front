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

  const handleStartVerification = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting Persona verification...');

      // Get template ID and environment ID from environment variables
      const templateId = import.meta.env.VITE_PERSONA_TEMPLATE_ID || 'itmpl_aHKymLqP5kWjmgQyZ5jrSUgDHDpF';
      const environmentId = import.meta.env.VITE_PERSONA_ENVIRONMENT_ID || 'env_G6yssyR43GAhoTicT3digMzo8gUL';

      console.log('📋 Template ID:', templateId);
      console.log('🌍 Environment ID:', environmentId);

      // For Dynamic Flow Templates, use the hosted verification page
      const verificationUrl = `https://withpersona.com/verify?template-id=${templateId}&environment=sandbox`;
      
      console.log('🔗 Opening Persona verification URL:', verificationUrl);
      
      // Open Persona verification in new window
      const personaWindow = window.open(verificationUrl, '_blank', 'width=600,height=800');
      
      if (!personaWindow) {
        console.log('Popup blocked, redirecting in same tab...');
        window.location.href = verificationUrl;
        return;
      }

      console.log('✅ Persona verification window opened');
      
      // Note: Completion will be handled via webhook on the backend
      // The webhook will update the user's KYC status
      
    } catch (error) {
      console.error('❌ Error starting Persona verification:', error);
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
              Opening...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Identity Verification
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Click the button above to start verification. A new window will open.
        </p>
      </div>
    </Card>
  );
};

export default PersonaVerification;
