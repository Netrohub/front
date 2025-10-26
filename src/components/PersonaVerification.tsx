import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

// Add Persona types
declare global {
  interface Window {
    Persona: any;
  }
}

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
  const clientRef = useRef<any>(null);

  // Load Persona SDK
  useEffect(() => {
    const loadPersonaSDK = () => {
      // Check if SDK is already loaded
      if (window.Persona) {
        console.log('✅ Persona SDK already loaded');
        setIsSDKReady(true);
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="persona"]')) {
        console.log('⏳ Persona SDK script already exists, waiting...');
        // Wait for script to load
        const checkInterval = setInterval(() => {
          if (window.Persona) {
            console.log('✅ Persona SDK loaded after waiting');
            setIsSDKReady(true);
            clearInterval(checkInterval);
          }
        }, 100);
        return;
      }

      console.log('📥 Loading Persona SDK...');
      const script = document.createElement('script');
      script.src = 'https://cdn.withpersona.com/dist/persona-v5.1.2.js';
      script.integrity = 'sha384-nuMfOsYXMwp5L13VJicJkSs8tObai/UtHEOg3f7tQuFWU5j6LAewJbjbF5ZkfoDo';
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        console.log('✅ Persona SDK loaded successfully');
        setIsSDKReady(true);
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Persona SDK');
        setIsSDKReady(false);
        onError?.(new Error('Failed to load Persona SDK'));
      };

      document.body.appendChild(script);
    };

    loadPersonaSDK();
  }, [onError]);

  const handleStartVerification = async () => {
    if (!isSDKReady || !window.Persona) {
      console.error('❌ Persona SDK not ready');
      onError?.(new Error('Persona SDK not ready'));
      return;
    }

    try {
      console.log('🚀 Starting Persona verification...');
      setIsLoading(true);

      // Get template ID and environment ID from environment variables
      const templateId = import.meta.env.VITE_PERSONA_TEMPLATE_ID || 'itmpl_aHKymLqP5kWjmgQyZ5jrSUgDHDpF';
      const environmentId = import.meta.env.VITE_PERSONA_ENVIRONMENT_ID || 'env_G6yssyR43GAhoTicT3digMzo8gUL';

      console.log('📋 Template ID:', templateId);
      console.log('🌍 Environment ID:', environmentId);

      // Initialize Persona Client
      clientRef.current = new window.Persona.Client({
        templateId,
        environmentId,
        onReady: () => {
          console.log('✅ Persona client ready');
          // Open the embedded flow
          clientRef.current.open();
        },
        onComplete: ({ inquiryId, status, fields }: any) => {
          console.log('✅ Persona verification completed:', { inquiryId, status, fields });
          setIsLoading(false);
          onComplete?.(inquiryId);
        },
        onError: (error: any) => {
          console.error('❌ Persona verification error:', error);
          setIsLoading(false);
          onError?.(new Error(error?.message || 'Persona verification failed'));
        },
        onCancel: () => {
          console.log('⚠️ Persona verification cancelled');
          setIsLoading(false);
        },
      });
      
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
          disabled={isLoading || !isSDKReady}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : !isSDKReady ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Identity Verification
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          {isSDKReady 
            ? 'Click the button above to start verification'
            : 'Loading verification system...'}
        </p>
      </div>
    </Card>
  );
};

export default PersonaVerification;
