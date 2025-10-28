import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  message?: string;
  description?: string;
  retry?: () => void;
  showIcon?: boolean;
}

const ErrorState = ({ 
  message = "Something went wrong",
  description = "We encountered an error loading this data. Please try again.",
  retry,
  showIcon = true 
}: ErrorStateProps) => {
  return (
    <Card className="glass-card p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {showIcon && (
          <div className="p-3 rounded-full bg-red-500/10">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <p className="text-sm text-foreground/60 max-w-md">{description}</p>
        </div>
        
        {retry && (
          <Button 
            onClick={retry}
            variant="outline"
            className="gap-2"
            aria-label="Retry loading data"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorState;

