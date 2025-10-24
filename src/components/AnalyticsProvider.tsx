import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
}

/**
 * Analytics Provider - Automatically tracks page views
 */
const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsProvider;
