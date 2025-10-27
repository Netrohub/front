import { Link } from "react-router-dom";
import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Linkedin
} from "lucide-react";

const ListSocialAccountComingSoon = () => {
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
  ];

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card p-12 text-center">
          {/* Coming Soon Badge */}
          <div className="mb-6 flex justify-center">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-6 py-2 text-lg">
              <Clock className="h-5 w-5 mr-2" />
              {language === 'ar' ? 'قريبًا' : 'Coming Soon'}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            {language === 'ar' ? 'إدراج حسابات وسائل التواصل الاجتماعي' : 'List Social Media Accounts'}
          </h1>

          {/* Description */}
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
            {language === 'ar' 
              ? 'نحن نعمل على إضافة ميزة بيع حسابات وسائل التواصل الاجتماعي للبائعين. ابق معنا للحصول على تحديثات!'
              : 'We are working on bringing social media account selling features to our platform. Stay tuned for updates!'
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
            <Link to="/seller/list/gaming">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white border-0 hover:opacity-90">
                {language === 'ar' ? 'إدراج حسابات الألعاب' : 'List Gaming Accounts'}
              </Button>
            </Link>
            
            <Link to="/seller/dashboard">
              <Button variant="outline" className="w-full sm:w-auto glass-card border-primary/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'العودة إلى لوحة البائع' : 'Back to Seller Dashboard'}
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-border/30">
            <p className="text-sm text-foreground/60">
              {language === 'ar' 
                ? 'في الوقت الحالي، يمكنك إدراج حسابات الألعاب والمنتجات الرقمية الأخرى على منصتنا.'
                : 'In the meantime, you can list gaming accounts and other digital products on our platform.'
              }
            </p>
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default ListSocialAccountComingSoon;
