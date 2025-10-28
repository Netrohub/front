import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileIconButtonProps extends ButtonProps {
  children: React.ReactNode;
  'aria-label': string; // Make aria-label required for accessibility
}

/**
 * Mobile-optimized icon button component
 * Ensures touch targets are at least 44x44px on mobile devices
 * Always requires an aria-label for accessibility
 */
export const MobileIconButton = React.forwardRef<HTMLButtonElement, MobileIconButtonProps>(
  ({ children, className, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        aria-label={ariaLabel}
        className={cn(
          // Mobile: 44x44px minimum for touch targets (WCAG guidelines)
          'h-10 w-10 min-h-[44px] min-w-[44px]',
          // Desktop: 32x32px (standard icon button size)
          'md:h-8 md:w-8 md:min-h-0 md:min-w-0',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

MobileIconButton.displayName = 'MobileIconButton';

export default MobileIconButton;

