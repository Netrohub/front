import React, { useEffect, useRef, useState } from 'react';
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
  const [isSDKReady, setIsSDKReady] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);
  const PERSONA_TEMPLATE_ID = 'vtmpl_gnPSyThsGJMjMqU3rpS1DoXQ69rr';
  const PERSONA_ENVIRONMENT = 'sandbox'; // or 'production'

  useEffect(() => {
    // Check if script already exists
    if (document.getElementById('persona-script')) {
      console.log('✅ Persona SDK already loaded');
      setIsSDKReady(true);
      return;
    }

    // Load Persona script - official CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.withpersona.com/dist/persona-v2.js';
    script.async = true;
    script.id = 'persona-script';
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log('✅ Persona SDK loaded successfully');
      setIsSDKReady(true);
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Persona SDK:', error);
      onError?.(new Error('Failed to load Persona SDK'));
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingScript = document.getElementById('persona-script');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [onError]);

  const handleStartVerification = () => {
    setIsLoading(true);
    
    try {
      // Initialize Persona
      if (typeof window !== 'undefined' && (window as any).Persona) {
        const Persona = (window as any).Persona;
        
        Persona.open({
          templateId: PERSONA_TEMPLATE_ID,
          environment: PERSONA_ENVIRONMENT,
          onReady: () => {
            console.log('📱 Persona verification modal ready');
            setIsLoading(false);
          },
          onStart: () => {
            console.log('📱 Persona verification started');
          },
          onComplete: ({ inquiryId }: { inquiryId: string }) => {
            console.log('✅ Persona verification completed:', inquiryId);
            setIsLoading(false);
            onComplete?.(inquiryId);
          },
          onCancel: () => {
            console.log('❌ Persona verification cancelled');
            setIsLoading(false);
          },
          onError: (error: any) => {
            console.error('❌ Persona verification error:', error);
            setIsLoading(false);
            onError?.(new Error(error?.message || 'Verification failed'));
          },
        });
      } else {
        console.error('Persona SDK not available');
        setIsLoading(false);
        onError?.(new Error('Persona SDK not loaded'));
      }
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
          disabled={!isSDKReady || isLoading}
          className="w-full"
          size="lg"
        >
          {(!isSDKReady || isLoading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSDKReady ? 'Starting Verification...' : 'Loading Verification...'}
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Identity Verification
            </>
          )}
        </Button>

        {!isSDKReady && (
          <p className="text-sm text-muted-foreground">
            Loading verification system...
          </p>
        )}
        
        {isLoading && isSDKReady && (
          <p className="text-sm text-muted-foreground">
            Opening verification window...
          </p>
        )}
      </div>
    </Card>
  );
};

export default PersonaVerification;
