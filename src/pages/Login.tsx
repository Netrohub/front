import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import TurnstileWidget, { TurnstileWidgetRef } from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, Smartphone, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { analytics } from "@/lib/analytics";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Form validation schema for email/username login
const emailUsernameSchema = z.object({
  identifier: z.string().min(3, "Please enter your email or username"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

// Form validation schema for phone login (2FA)
const phoneSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),
  code: z.string().min(6, "Please enter the 6-digit verification code"),
  remember: z.boolean().optional(),
});

type EmailUsernameFormData = z.infer<typeof emailUsernameSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneStep, setPhoneStep] = useState<'phone' | 'code'>('phone');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const isTurnstileEnabled = import.meta.env.VITE_ENABLE_TURNSTILE === 'true';

  const from = location.state?.from?.pathname || "/";

  // Email/Username form
  const emailForm = useForm<EmailUsernameFormData>({
    resolver: zodResolver(emailUsernameSchema),
    defaultValues: {
      remember: false,
    },
  });

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      remember: false,
    },
  });

  const currentForm = loginMode === 'email' ? emailForm : phoneForm;
  const rememberMe = currentForm.watch('remember');

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken("");
  };

  const onSubmitEmail = async (data: EmailUsernameFormData) => {
    console.log('🔐 Email/Username login form submitted', { identifier: data.identifier });
    
    // Check Turnstile validation if enabled (skip in mock mode)
    const isMockMode = import.meta.env.VITE_MOCK_API === 'true';
    if (isTurnstileEnabled && !turnstileToken && !isMockMode) {
      console.warn('⚠️ Turnstile validation required but token missing');
      toast.error('⚠️ Please complete the security verification');
      return;
    }

    try {
      console.log('📡 Calling login API...');
      
      // Show loading toast
      const loadingToast = toast.loading('🔐 Signing in...');
      
      // Login with email/username
      await login(data.identifier, data.password, data.remember);
      
      console.log('✅ Login successful! User is now authenticated.');
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success with animation
      toast.success('✅ Welcome back!', {
        description: `Logged in as ${data.identifier}`,
        duration: 2000,
      });
      
      // Track successful login
      const loginType = data.identifier.includes('@') ? 'email' : 'username';
      analytics.login(loginType);
      
      // Small delay for user to see success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      toast.error('❌ Login failed', {
        description: error?.message || 'Please check your credentials and try again.',
        duration: 4000,
      });
      
      // Reset Turnstile on error
      if (isTurnstileEnabled) {
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
    }
  };

  const sendPhoneCode = async (phone: string) => {
    try {
      setIsSendingCode(true);
      console.log('📱 Sending verification code to:', phone);
      
      // Show loading toast
      const loadingToast = toast.loading('📱 Sending verification code...');
      
      // TODO: Implement actual SMS sending API call
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success
      toast.success('✅ Verification code sent!', {
        description: `Check your phone for the 6-digit code`,
        duration: 3000,
      });
      
      // Move to code verification step
      setPhoneStep('code');
      
    } catch (error: any) {
      console.error('❌ Failed to send code:', error);
      toast.error('❌ Failed to send code', {
        description: error?.message || 'Please try again.',
        duration: 4000,
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyPhoneCode = async (data: PhoneFormData) => {
    console.log('🔐 Phone code verification', { phone: data.phone, code: data.code });
    
    try {
      console.log('📡 Verifying phone code...');
      
      // Show loading toast
      const loadingToast = toast.loading('🔐 Verifying code...');
      
      // TODO: Implement actual phone code verification
      // For now, we'll simulate it with a mock code
      if (data.code !== '123456') {
        throw new Error('Invalid verification code');
      }
      
      // Simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success with animation
      toast.success('✅ Welcome back!', {
        description: `Logged in with ${data.phone}`,
        duration: 2000,
      });
      
      // Track successful login
      analytics.login('phone');
      
      // Close modal and navigate
      setPhoneModalOpen(false);
      setPhoneStep('phone');
      phoneForm.reset();
      
      // Small delay for user to see success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Code verification failed:', error);
      toast.error('❌ Verification failed', {
        description: error?.message || 'Please check your code and try again.',
        duration: 4000,
      });
    }
  };

  const openPhoneModal = () => {
    setPhoneModalOpen(true);
    setPhoneStep('phone');
    phoneForm.reset();
  };

  const closePhoneModal = () => {
    setPhoneModalOpen(false);
    setPhoneStep('phone');
    phoneForm.reset();
  };

  const switchToEmailLogin = () => {
    setLoginMode('email');
    setTurnstileToken(""); // Reset turnstile when switching modes
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="glass-card p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-xl gradient-primary mb-4">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {t('welcomeBack')}
                </h1>
                <p className="text-foreground/60">
                  {t('signInToAccount')}
                </p>
                {/* Login Mode Indicator */}
                <div className="mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Email/Username Login</span>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form 
                onSubmit={(e) => {
                  console.log('📋 Form onSubmit triggered');
                  emailForm.handleSubmit(onSubmitEmail)(e);
                }} 
                className="space-y-5"
              >
                {/* Email/Username Input */}
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-foreground">
                    {t('emailOrUsername') || 'Email or Username'} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="your@email.com or username"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...emailForm.register("identifier")}
                    />
                  </div>
                  {emailForm.formState.errors.identifier && (
                    <p className="text-sm text-destructive">{emailForm.formState.errors.identifier.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    {t('password')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...currentForm.register("password")}
                    />
                  </div>
                  {currentForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{currentForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => currentForm.setValue('remember', checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-foreground/70 cursor-pointer"
                    >
                      {t('rememberMe')}
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>

                {/* Cloudflare Turnstile CAPTCHA */}
                <TurnstileWidget
                  ref={turnstileRef}
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileError}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full btn-glow" 
                  size="lg"
                  disabled={isLoading}
                  onClick={() => console.log('🖱️ Sign in button clicked')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      {t('signIn')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-foreground/60">{t('orContinueWith')}</span>
                </div>
              </div>

              {/* Alternative Login */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full glass-card border-border/50 hover:border-primary/50"
                  size="lg"
                  onClick={openPhoneModal}
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  {t('phoneNumber')}
                </Button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-foreground/60 mt-6">
                {t('dontHaveAccount')}{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('createAccount')}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Phone Login Modal */}
      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              {t('phoneNumber')} Login
            </DialogTitle>
            <DialogDescription>
              {phoneStep === 'phone' 
                ? 'Enter your phone number to receive a verification code'
                : 'Enter the 6-digit code sent to your phone'
              }
            </DialogDescription>
          </DialogHeader>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (phoneStep === 'phone') {
                const phone = phoneForm.getValues('phone');
                if (phone) {
                  sendPhoneCode(phone);
                }
              } else {
                phoneForm.handleSubmit(verifyPhoneCode)(e);
              }
            }}
            className="space-y-4"
          >
            {phoneStep === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="modal-phone" className="text-foreground">
                    {t('phoneNumber')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="modal-phone"
                      type="tel"
                      placeholder="+1234567890"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...phoneForm.register("phone")}
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">{phoneForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="modal-remember"
                    checked={phoneForm.watch('remember')}
                    onCheckedChange={(checked) => phoneForm.setValue('remember', checked as boolean)}
                  />
                  <label
                    htmlFor="modal-remember"
                    className="text-sm text-foreground/70 cursor-pointer"
                  >
                    {t('rememberMe')}
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={closePhoneModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-glow"
                    disabled={isSendingCode}
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Code'
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="modal-code" className="text-foreground">
                    Verification Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="modal-code"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest glass-card border-border/50 focus:border-primary/50"
                    {...phoneForm.register("code")}
                  />
                  <p className="text-xs text-foreground/60 text-center">
                    Enter the 6-digit code sent to {phoneForm.getValues('phone')}
                  </p>
                  {phoneForm.formState.errors.code && (
                    <p className="text-sm text-destructive">{phoneForm.formState.errors.code.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPhoneStep('phone')}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Login'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
