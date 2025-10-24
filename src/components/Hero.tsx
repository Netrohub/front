import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 gradient-nebula opacity-80" />
      
      {/* Glow effects - mobile first */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full glass-card border border-primary/30 mb-2 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('welcomeMessage')}
            </span>
          </div>
          
          <div className="space-y-4 sm:space-y-6 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight px-2">
              {t('heroTitle')}{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed px-4">
              {t('heroDescription')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 px-4 w-full max-w-md sm:max-w-none">
            <Button asChild size="lg" className="gap-2 btn-glow text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 md:py-6 w-full sm:w-auto min-h-[44px] touch-target">
              <Link to="/products">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {t('exploreProducts')}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-card border-primary/30 hover:border-primary/50 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 md:py-6 w-full sm:w-auto min-h-[44px] touch-target">
              <Link to="/seller/onboarding">
                {t('becomeASeller')}
              </Link>
            </Button>
          </div>
          
          {/* Feature badges - mobile first */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8 px-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70 min-h-[44px]">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <span>{t('securePayments')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70 min-h-[44px]">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              </div>
              <span>{t('instantAccess')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70 min-h-[44px]">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
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
