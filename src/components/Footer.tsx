import { Link } from "react-router-dom";
import { Shield, Zap, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

// Discord SVG icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <footer className="border-t border-border/50 glass-card mt-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nexo
              </span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              The premier digital gaming marketplace. Buy and sell with confidence.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://discord.gg/Jk3zxyDb" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass-card hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Join our Discord"
              >
                <DiscordIcon className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-foreground/50 mt-2">
              Join our Discord community for support
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">{t('marketplace')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('games')}
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('leaderboard')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">{t('myAccount')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/account" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('dashboard')}
                </Link>
              </li>
              <li>
                {user?.subscription?.plan === 'Elite' ? (
                  <Link to="/seller/dashboard" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t('sellOnNexo')}
                  </Link>
                ) : (
                  <span className="text-sm text-foreground/30 cursor-not-allowed flex items-center gap-2 group" title="Elite plan required">
                    <span className="w-1 h-1 rounded-full bg-foreground/30" />
                    {t('sellOnNexo')} (Elite Only)
                  </span>
                )}
              </li>
              <li>
                <Link to="/account/orders" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('orders')}
                </Link>
              </li>
              <li>
                <Link to="/account/wallet" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('wallet')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">{t('legalAndSupport')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('refundPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/disputes" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {t('disputeCenter')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 py-8 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Shield className="h-5 w-5 text-primary" />
            <span>{t('securePayments')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Zap className="h-5 w-5 text-accent" />
            <span>{t('instantAccess')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Award className="h-5 w-5 text-primary" />
            <span>{t('verifiedSellers')}</span>
          </div>
        </div>
        
        <div className="border-t border-border/30 pt-8 text-center">
          <p className="text-sm text-foreground/50">
            © 2024 Nexo Marketplace. {t('allRightsReserved')}. {t('builtForGamers')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
