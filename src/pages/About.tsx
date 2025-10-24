import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Award, Users, TrendingUp, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = (t: (key: string) => string) => [
  { label: t('activeUsers'), value: "50K+", icon: Users },
  { label: t('productsSold'), value: "1M+", icon: TrendingUp },
  { label: t('countries'), value: "120+", icon: Globe },
  { label: t('successRate'), value: "99.8%", icon: Award },
];

const values = (t: (key: string) => string) => [
  {
    icon: Shield,
    title: t('securityFirst'),
    description: t('securityFirstDesc'),
  },
  {
    icon: Zap,
    title: t('lightningFast'),
    description: t('lightningFastDesc'),
  },
  {
    icon: Award,
    title: t('qualityAssured'),
    description: t('qualityAssuredDesc'),
  },
  {
    icon: Users,
    title: t('communityDriven'),
    description: t('communityDrivenDesc'),
  },
];

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-60" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <Badge className="badge-glow border-0 mb-4">
                {t('aboutUs')}
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('empoweringDigitalCommerce')}
              </h1>
              <p className="text-xl text-foreground/60 leading-relaxed">
                {t('aboutDescription')}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats(t).map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="glass-card p-6 text-center">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-sm text-foreground/60">{stat.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  {t('ourStory')}
                </h2>
                <p className="text-foreground/60 text-lg">
                  {t('buildingFuture')}
                </p>
              </div>

              <Card className="glass-card p-8 md:p-12 space-y-6 text-foreground/70 leading-relaxed">
                <p className="text-lg">
                  {t('storyParagraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('storyParagraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('storyParagraph3')}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                {t('ourValues')}
              </h2>
              <p className="text-foreground/60 text-lg">
                {t('principlesGuide')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {values(t).map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className="glass-card p-8 group hover:scale-[1.02] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                        <p className="text-foreground/60 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('ourMission')}
              </h2>
              <p className="text-xl text-foreground/70 leading-relaxed">
                {t('missionStatement')}
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
