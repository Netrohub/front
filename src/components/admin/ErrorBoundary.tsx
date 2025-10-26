import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-8">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">Oops! Something went wrong</h1>
                <p className="mb-4 text-sm text-muted-foreground">
                  We're sorry for the inconvenience. An unexpected error occurred.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mb-4 rounded-lg bg-muted p-4 text-left">
                    <p className="mb-2 font-mono text-sm font-semibold text-destructive">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="overflow-auto text-xs text-muted-foreground">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={() => (window.location.href = '/admin/dashboard')} variant="default">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
