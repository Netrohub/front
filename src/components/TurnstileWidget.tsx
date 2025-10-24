import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, forwardRef, useImperativeHandle } from 'react';

interface TurnstileWidgetProps {
  onSuccess?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export interface TurnstileWidgetRef {
  reset: () => void;
  getResponse: () => string | undefined;
}

const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onSuccess, onError, onExpire }, ref) => {
    const turnstileRef = useRef<TurnstileInstance>(null);
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    const isEnabled = import.meta.env.VITE_ENABLE_TURNSTILE === 'true';
    const theme = (import.meta.env.VITE_TURNSTILE_THEME || 'dark') as 'light' | 'dark' | 'auto';
    const size = (import.meta.env.VITE_TURNSTILE_SIZE || 'normal') as 'normal' | 'compact';

    useImperativeHandle(ref, () => ({
      reset: () => {
        turnstileRef.current?.reset();
      },
      getResponse: () => {
        return turnstileRef.current?.getResponse();
      },
    }));

    // If Turnstile is disabled, don't render anything
    if (!isEnabled || !siteKey || siteKey === '1x00000000000000000000AA') {
      return null;
    }

    return (
      <div className="flex justify-center">
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme,
            size,
            action: 'submit',
            appearance: 'always',
          }}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
