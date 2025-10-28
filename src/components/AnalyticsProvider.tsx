import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initGTM, trackPageView } from '@/lib/gtm';

interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Analytics Provider - Initializes GTM and tracks page views
 * 
 * Features:
 * - Initializes Google Tag Manager on mount
 * - Tracks page views on route changes
 * - Includes device type with every event
 * - Disabled in development mode
 */
const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const location = useLocation();

  // Initialize GTM once on mount
  useEffect(() => {
    initGTM();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsProvider;
