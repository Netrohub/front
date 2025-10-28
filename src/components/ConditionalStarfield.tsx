import { lazy, Suspense } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load Starfield component for better code splitting
const Starfield = lazy(() => import('./Starfield'));

/**
 * Conditional Starfield Component
 * 
 * Optimizes performance by:
 * - Disabling Starfield animation on mobile devices (saves CPU/battery)
 * - Using lazy loading for code splitting
 * - Providing simple gradient fallback on mobile
 * 
 * Performance Impact:
 * - Mobile: Simple gradient background (lightweight)
 * - Desktop: Full animated starfield (visual enhancement)
 */
export const ConditionalStarfield = () => {
  const isMobile = useIsMobile();
  
  // On mobile: Show simple gradient background (better performance)
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
    );
  }

  // On desktop: Show full animated Starfield
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 bg-background z-0" />
      }
    >
      <Starfield />
    </Suspense>
  );
};

export default ConditionalStarfield;

