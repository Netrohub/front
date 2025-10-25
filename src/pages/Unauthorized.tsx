import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Unauthorized = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const state = location.state as { from?: string; requiredRoles?: string[]; userRoles?: string[] } | null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="glass-card p-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              {/* Icon */}
              <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
                <Shield className="h-12 w-12 text-destructive" />
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-foreground">
                  Access Denied
                </h1>
                <p className="text-foreground/60">
                  You don't have permission to access this page. Please contact support if you believe this is an error.
                </p>
                {state?.from && (
                  <p className="text-sm text-foreground/50 mt-2">
                    Attempted to access: <code className="bg-foreground/10 px-2 py-1 rounded text-xs">{state.from}</code>
                  </p>
                )}
                {state?.requiredRoles && (
                  <p className="text-sm text-foreground/50">
                    Required roles: <span className="font-medium">{state.requiredRoles.join(', ')}</span>
                  </p>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/account">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    My Account
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
