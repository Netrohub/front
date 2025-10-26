import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <Card className={cn('p-12', className)}>
      <div className="flex flex-col items-center justify-center text-center">
        {Icon && (
          <div className="mb-4 rounded-full bg-muted p-3">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </Card>
  );
};

export default EmptyState;
