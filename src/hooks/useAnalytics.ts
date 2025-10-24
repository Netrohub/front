import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, analytics } from '@/lib/analytics';

/**
 * Hook to automatically track page views
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};

/**
 * Hook to access analytics functions
 */
export const useAnalytics = () => {
  return analytics;
};

export default useAnalytics;
