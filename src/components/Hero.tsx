import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 gradient-nebula opacity-80" />
      
      {/* Glow effects - mobile first */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[100px] lg:blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-accent/20 rounded-full blur-[80px] md:blur-[100px] lg:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full glass-card border border-primary/30 mb-4">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary animate-pulse" />
            <span className="text-sm md:text-base font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('welcomeMessage')}
            </span>
          </div>
          
          <div className="space-y-4 md:space-y-6 max-w-5xl w-full">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black tracking-tight leading-tight px-2 break-words">
              <span className="block">
                {t('heroTitle')}
              </span>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse block">
                Marketplace
              </span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed px-4 break-words">
              {t('heroDescription')}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-center gap-4 md:gap-6 pt-4 w-full max-w-lg md:max-w-none">
            <Button asChild size="lg" className="gap-2 btn-glow text-sm md:text-base px-6 md:px-8 py-3 md:py-4 w-full md:w-auto h-12 md:h-12">
              <Link to="/products">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {t('exploreProducts')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-card border-primary/30 hover:border-primary/50 text-sm md:text-base px-6 md:px-8 py-3 md:py-4 w-full md:w-auto h-12 md:h-12">
              <Link to="/seller/onboarding">
                {t('becomeASeller')}
              </Link>
            </Button>
          </div>
          
          {/* Feature badges - mobile first */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 pt-6 md:pt-8 w-full">
            <div className="flex items-center gap-2 text-sm md:text-base text-foreground/70 h-12 px-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <span className="whitespace-nowrap">{t('securePayments')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base text-foreground/70 h-12 px-4">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              </div>
              <span className="whitespace-nowrap">{t('instantAccess')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base text-foreground/70 h-12 px-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <span className="whitespace-nowrap">{t('support247')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
