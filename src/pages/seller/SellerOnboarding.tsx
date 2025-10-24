import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Gamepad2, 
  ArrowRight,
  Users,
  Trophy,
  Shield,
  Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SellerOnboarding = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 gradient-nebula opacity-80" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
                <Shield className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t('trustedBy')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                {t('startSellingOn')}{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Nexo
                </span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-8">
                {t('sellerOnboardingDesc')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <span>{t('quickSetup')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <Shield className="h-4 w-4 text-accent" />
                  </div>
                  <span>{t('securePayments')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <span>{t('lowFees')}</span>
                </div>
              </div>
            </div>

            {/* Product Type Selection */}
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                {t('chooseWhatToSell')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Social Media Accounts */}
                <Card className="glass-card p-8 border border-border/30 hover:border-primary/50 transition-all group">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500/30 group-hover:scale-110 transition-transform">
                      <Instagram className="h-16 w-16 text-pink-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {t('socialMediaAccounts')}
                      </h3>
                      <p className="text-foreground/60">
                        {t('sellSocialDesc')}
                      </p>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Instagram, TikTok, YouTube, Twitter</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{t('verifiedAccounts')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{t('quickSetup')}</span>
                      </div>
                    </div>

                    <Button asChild className="btn-glow w-full" size="lg">
                      <Link to="/seller/list/social">
                        {t('listSocialAccount')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>

                {/* Gaming Accounts */}
                <Card className="glass-card p-8 border border-border/30 hover:border-primary/50 transition-all group">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="h-16 w-16 text-blue-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {t('gamingAccounts')}
                      </h3>
                      <p className="text-foreground/60">
                        {t('sellGamingDesc')}
                      </p>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Gamepad2 className="h-4 w-4 text-primary" />
                        <span>Steam, PlayStation, Xbox, Epic</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span>{t('instantAccess')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-foreground/70">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>{t('securePayments')}</span>
                      </div>
                    </div>

                    <Button asChild className="btn-glow w-full" size="lg">
                      <Link to="/seller/list/gaming">
                        {t('listGamingAccount')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-4xl mx-auto mt-16">
              <Card className="glass-card p-8 border border-primary/30">
                <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                  {t('whySellOnNexo')}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{t('fastPayouts')}</h4>
                    <p className="text-sm text-foreground/60">
                      {t('fastPayoutsDesc')}
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{t('buyerProtection')}</h4>
                    <p className="text-sm text-foreground/60">
                      {t('buyerProtectionDesc')}
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 border border-primary/20 mb-2">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{t('largeAudience')}</h4>
                    <p className="text-sm text-foreground/60">
                      {t('largeAudienceDesc')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerOnboarding;
