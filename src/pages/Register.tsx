import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import TurnstileWidget, { TurnstileWidgetRef } from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { analytics } from "@/lib/analytics";
import { toast } from "sonner";

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  passwordConfirmation: z.string(),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const turnstileRef = useRef<TurnstileWidgetRef>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const isTurnstileEnabled = import.meta.env.VITE_ENABLE_TURNSTILE === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch('agreeToTerms');

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken("");
  };

  const onSubmit = async (data: RegisterFormData) => {
    console.log('📝 Register form submitted', { name: data.name, email: data.email });
    
    // Check Turnstile validation if enabled (skip in mock mode)
    const isMockMode = import.meta.env.VITE_MOCK_API === 'true';
    if (isTurnstileEnabled && !turnstileToken && !isMockMode) {
      console.warn('⚠️ Turnstile validation required but token missing');
      toast.error('⚠️ Please complete the security verification');
      return;
    }

    try {
      console.log('📡 Calling register API...');
      
      // Show loading toast
      const loadingToast = toast.loading('✨ Creating your account...');
      
      await registerUser(
        data.name,
        data.email,
        data.password,
        data.passwordConfirmation,
        data.phone
      );
      
      console.log('✅ Registration successful!');
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success with confetti effect
      toast.success('🎉 Account created successfully!', {
        description: `Welcome to NXOLand, ${data.name}!`,
        duration: 3000,
      });
      
      // Track successful registration
      analytics.signUp('email');
      
      // Delay for user to see success
      setTimeout(() => {
        navigate("/");
      }, 800);
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      toast.error('❌ Registration failed', {
        description: error?.message || 'Please try again.',
        duration: 4000,
      });
      
      // Reset Turnstile on error
      if (isTurnstileEnabled) {
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
    }
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
                  <User className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {t('createAccount')}
                </h1>
                <p className="text-foreground/60">
                  {t('joinNexoMarketplace')}
                </p>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    {t('username')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('chooseUsername')}
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {t('emailAddress')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
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
                      placeholder={t('createStrongPassword')}
                      autoComplete="new-password"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...register("password")}
                    />
                  </div>
                  <p className="text-xs text-foreground/50">
                    {t('passwordRequirements')}
                  </p>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmation" className="text-foreground">
                    {t('confirmPassword')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                    <Input
                      id="passwordConfirmation"
                      type="password"
                      placeholder={t('confirmYourPassword')}
                      autoComplete="new-password"
                      className="pl-10 glass-card border-border/50 focus:border-primary/50"
                      {...register("passwordConfirmation")}
                    />
                  </div>
                  {errors.passwordConfirmation && (
                    <p className="text-sm text-destructive">{errors.passwordConfirmation.message}</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToTerms" 
                    className="mt-1"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-foreground/70 cursor-pointer leading-relaxed"
                  >
                    <span className="text-destructive">* </span>
                    {t('iAgreeToThe')}{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      {t('termsOfService')}
                    </Link>{" "}
                    {t('and')}{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      {t('privacyPolicy')}
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                )}

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
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      {t('createAccount')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <p className="text-center text-sm text-foreground/60 mt-6">
                {t('alreadyHaveAccount')}{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t('signIn')}
                </Link>
              </p>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
