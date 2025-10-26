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
  const mountedRef = useRef(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const PERSONA_TEMPLATE_ID = 'vtmpl_gnPSyThsGJMjMqU3rpS1DoXQ69rr';

  useEffect(() => {
    // Load Persona embedded flow using iframe approach
    const iframe = document.createElement('iframe');
    iframe.src = `https://withpersona.com/verify/inquiry/${PERSONA_TEMPLATE_ID}?environment=sandbox`;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.id = 'persona-iframe';
    
    iframe.onload = () => {
      if (!mountedRef.current) return;
      console.log('✅ Persona iframe loaded');
      setIsSDKReady(true);
    };
    
    iframe.onerror = (error) => {
      if (!mountedRef.current) return;
      console.error('❌ Failed to load Persona iframe:', error);
      // Fallback: try direct link
      setIsSDKReady(true); // Allow button to work as fallback
    };

    return () => {
      mountedRef.current = false;
      const existing = document.getElementById('persona-iframe');
      if (existing) existing.remove();
    };
  }, []);

  const handleStartVerification = () => {
    setIsLoading(true);
    
    try {
      // Open Persona verification in a new window/tab
      const width = 600;
      const height = 800;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      const personaWindow = window.open(
        `https://withpersona.com/verify/inquiry/${PERSONA_TEMPLATE_ID}?environment=sandbox`,
        'PersonaVerification',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!personaWindow) {
        throw new Error('Failed to open Persona verification window. Please allow popups.');
      }

      // Listen for messages from Persona
      const handleMessage = (event: MessageEvent) => {
        // Only accept messages from Persona
        if (!event.origin.includes('withpersona.com')) return;

        console.log('📨 Message from Persona:', event.data);

        if (event.data.type === 'persona.verification.completed') {
          const inquiryId = event.data.inquiryId;
          console.log('✅ Persona verification completed:', inquiryId);
          setIsLoading(false);
          window.removeEventListener('message', handleMessage);
          personaWindow.close();
          onComplete?.(inquiryId);
        } else if (event.data.type === 'persona.verification.canceled') {
          console.log('❌ Persona verification cancelled');
          setIsLoading(false);
          window.removeEventListener('message', handleMessage);
          personaWindow.close();
        } else if (event.data.type === 'persona.verification.failed') {
          console.error('❌ Persona verification failed:', event.data.error);
          setIsLoading(false);
          window.removeEventListener('message', handleMessage);
          personaWindow.close();
          onError?.(new Error(event.data.error?.message || 'Verification failed'));
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if window was closed manually
      const checkClosed = setInterval(() => {
        if (personaWindow.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          if (isLoading) {
            setIsLoading(false);
          }
        }
      }, 1000);

      // Cleanup after 30 minutes max
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        if (!personaWindow.closed) {
          personaWindow.close();
        }
        setIsLoading(false);
      }, 30 * 60 * 1000);

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
      </div>
    </Card>
  );
};

export default PersonaVerification;
