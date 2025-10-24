import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Loading spinner for buttons
 */
export const ButtonLoader = ({ className }: { className?: string }) => (
  <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
);

/**
 * Loading spinner for pages
 */
export const PageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="glass-card p-8 flex flex-col items-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-foreground/70 text-lg">{message}</p>
    </div>
  </div>
);

/**
 * Loading skeleton for product cards
 */
export const ProductCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="aspect-square bg-muted/30" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted/50 rounded w-3/4" />
      <div className="h-6 bg-muted/50 rounded w-1/2" />
      <div className="h-10 bg-muted/50 rounded" />
    </div>
  </div>
);

/**
 * Loading overlay for actions
 */
export const LoadingOverlay = ({ message = "Processing..." }: { message?: string }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="glass-card p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-200">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-foreground text-lg font-medium">{message}</p>
    </div>
  </div>
);

/**
 * Skeleton for table rows
 */
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-muted/50 rounded" />
      </td>
    ))}
  </tr>
);

/**
 * Loading dots animation
 */
export const LoadingDots = () => (
  <span className="inline-flex space-x-1">
    <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <span className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </span>
);

/**
 * Progress bar
 */
export const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
    <div 
      className="h-full gradient-primary transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);
