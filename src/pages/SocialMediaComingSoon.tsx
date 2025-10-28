import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import { 
  Clock, 
  ArrowLeft, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  MessageCircle,
  Camera,
  Music,
  Linkedin,
  Send
} from "lucide-react";

const SocialMediaComingSoon = () => {
  const { t, language } = useLanguage();

  const socialPlatforms = [
    { name: "Instagram", icon: Instagram },
    { name: "Twitter", icon: Twitter },
    { name: "Facebook", icon: Facebook },
    { name: "YouTube", icon: Youtube },
    { name: "TikTok", icon: Music },
    { name: "Snapchat", icon: Camera },
    { name: "LinkedIn", icon: Linkedin },
    { name: "Discord", icon: MessageCircle },
    { name: "Telegram", icon: Send },
  ];

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
        <ConditionalStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="glass-card p-12 max-w-2xl mx-auto">
            {/* Coming Soon Badge */}
            <div className="mb-6 flex justify-center">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-6 py-2 text-lg">
                <Clock className="h-5 w-5 mr-2" />
                {language === 'ar' ? 'قريبًا' : 'Coming Soon'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              {language === 'ar' ? 'حسابات وسائل التواصل الاجتماعي' : 'Social Media Accounts'}
            </h1>

            {/* Description */}
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              {language === 'ar' 
                ? 'نحن نعمل على إضافة ميزة حسابات وسائل التواصل الاجتماعي. ابق معنا للحصول على تحديثات!'
                : 'We are working on bringing you social media accounts. Stay tuned for updates!'
              }
            </p>

            {/* Social Platform Icons */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div
                      key={platform.name}
                      className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 opacity-50"
                    >
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-foreground/50">
                {language === 'ar' 
                  ? 'Instagram • Twitter • Facebook • YouTube • TikTok • والمزيد...'
                  : 'Instagram • Twitter • Facebook • YouTube • TikTok • And more...'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link to="/products">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                  {language === 'ar' ? 'تصفح الحسابات المتاحة' : 'Browse Available Accounts'}
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto glass-card border-primary/30">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-border/30">
              <p className="text-sm text-foreground/60">
                {language === 'ar' 
                  ? 'في الوقت الحالي، يمكنك تصفح حسابات الألعاب والمنتجات الرقمية الأخرى المتاحة على منصتنا.'
                  : 'In the meantime, you can browse our available gaming accounts and other digital products.'
                }
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SocialMediaComingSoon;
