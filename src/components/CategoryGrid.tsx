import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Facebook, Youtube, Twitch, MessageCircle, Music, Camera, Linkedin, Pin, MessageSquare, Send, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

// Custom Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const platforms = [
  { name: "Instagram", icon: Instagram, count: 245, link: "/products/category/instagram", isSocialMedia: true },
  { name: "Twitter", icon: Twitter, count: 189, link: "/products/category/twitter", isSocialMedia: true },
  { name: "Facebook", icon: Facebook, count: 127, link: "/products/category/facebook", isSocialMedia: true },
  { name: "YouTube", icon: Youtube, count: 156, link: "/products/category/youtube", isSocialMedia: true },
  { name: "Twitch", icon: Twitch, count: 98, link: "/products/category/twitch", isSocialMedia: true },
  { name: "Discord", icon: DiscordIcon, count: 213, link: "/products/category/discord", isSocialMedia: true },
  { name: "TikTok", icon: Music, count: 167, link: "/products/category/tiktok", isSocialMedia: true },
  { name: "Snapchat", icon: Camera, count: 134, link: "/products/category/snapchat", isSocialMedia: true },
  { name: "LinkedIn", icon: Linkedin, count: 89, link: "/products/category/linkedin", isSocialMedia: true },
  { name: "Pinterest", icon: Pin, count: 76, link: "/products/category/pinterest", isSocialMedia: true },
  { name: "Reddit", icon: MessageSquare, count: 112, link: "/products/category/reddit", isSocialMedia: true },
  { name: "Telegram", icon: Send, count: 45, link: "/products/category/telegram", isSocialMedia: true },
];

const CategoryGrid = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center space-y-3 px-4">
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('browseByPlatform')}
          </h2>
          <p className="text-foreground/60 text-base sm:text-lg">{t('choosePlatform')}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isComingSoon = platform.isSocialMedia;
            return (
              <Link key={platform.name} to={platform.link}>
                <Card className={`glass-card cursor-pointer p-4 sm:p-6 text-center group transition-all duration-300 relative ${
                  isComingSoon 
                    ? 'opacity-70 hover:opacity-80' 
                    : 'hover:scale-105'
                }`}>
                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 text-xs px-2 py-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {t('comingSoon') || 'Coming Soon'}
                      </Badge>
                    </div>
                  )}
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <div className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isComingSoon
                        ? 'bg-gradient-to-br from-foreground/10 to-foreground/20 border-foreground/20'
                        : 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 group-hover:border-primary/50 group-hover:scale-110'
                    }`}>
                      <Icon className={`h-5 w-5 sm:h-7 sm:w-7 transition-colors ${
                        isComingSoon 
                          ? 'text-foreground/50' 
                          : 'text-primary group-hover:text-accent'
                      }`} />
                    </div>
                  </div>
                  <h3 className={`mb-1 sm:mb-2 font-bold text-sm sm:text-base transition-colors ${
                    isComingSoon 
                      ? 'text-foreground/70' 
                      : 'text-foreground group-hover:text-primary'
                  }`}>{platform.name}</h3>
                  <p className={`text-xs sm:text-sm font-medium ${
                    isComingSoon 
                      ? 'text-muted-foreground/50' 
                      : 'text-muted-foreground'
                  }`}>
                    {isComingSoon ? t('comingSoon') || 'Coming Soon' : `${platform.count} accounts`}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
