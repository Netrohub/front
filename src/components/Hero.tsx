import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 gradient-nebula opacity-80" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-4">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('welcomeMessage')}
            </span>
          </div>
          
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
              {t('heroTitle')}{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed px-4">
              {t('heroDescription')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 px-4">
            <Button asChild size="lg" className="gap-2 btn-glow text-base px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link to="/products">
                <ShoppingBag className="h-5 w-5" />
                {t('exploreProducts')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-card border-primary/30 hover:border-primary/50 text-base px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
              <Link to="/seller/onboarding">
                {t('becomeASeller')}
              </Link>
            </Button>
          </div>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-8 px-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span>{t('securePayments')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Zap className="h-4 w-4 text-accent" />
              </div>
              <span>{t('instantAccess')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span>{t('support247')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
