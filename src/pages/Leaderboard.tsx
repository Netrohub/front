import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Star, Award, Medal, Crown } from "lucide-react";
import { getCategoryImage } from "@/lib/categoryImages";
import { useLanguage } from "@/contexts/LanguageContext";

const topSellers = [
  {
    id: 1,
    name: "ProGamer_Elite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    sales: 1250,
    rating: 4.9,
    revenue: "$125,430",
    badge: "diamond",
  },
  {
    id: 2,
    name: "GameMaster_X",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    sales: 980,
    rating: 4.8,
    revenue: "$98,200",
    badge: "platinum",
  },
  {
    id: 3,
    name: "LegendaryDeals",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    sales: 856,
    rating: 4.9,
    revenue: "$85,600",
    badge: "gold",
  },
  {
    id: 4,
    name: "AccountKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    sales: 742,
    rating: 4.7,
    revenue: "$74,200",
    badge: "gold",
  },
  {
    id: 5,
    name: "DigitalEmporium",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    sales: 698,
    rating: 4.8,
    revenue: "$69,800",
    badge: "silver",
  },
];

const topProducts = [
  {
    id: 1,
    name: "Steam Account - Level 50+",
    seller: "ProGamer_Elite",
    sales: 342,
    rating: 4.9,
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    category: "Steam",
  },
  {
    id: 2,
    name: "Instagram - 100K Followers",
    seller: "SocialKing",
    sales: 298,
    rating: 4.8,
    price: "$549.99",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    category: "Instagram",
  },
  {
    id: 3,
    name: "PlayStation Account Premium",
    seller: "GameMaster_X",
    sales: 256,
    rating: 4.9,
    price: "$399.99",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    category: "PlayStation",
  },
];

const topBuyers = [
  {
    id: 1,
    name: "CollectorPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer1",
    purchases: 89,
    spent: "$15,680",
    rating: 5.0,
  },
  {
    id: 2,
    name: "GamingEnthusiast",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer2",
    purchases: 76,
    spent: "$12,340",
    rating: 4.9,
  },
  {
    id: 3,
    name: "AccountHunter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=buyer3",
    purchases: 65,
    spent: "$10,890",
    rating: 4.8,
  },
];

const getBadgeIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />;
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
  return <Trophy className="h-5 w-5 text-primary" />;
};

const Leaderboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-60" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-4">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t('topPerformers')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('leaderboard')}
              </h1>
              <p className="text-lg text-foreground/60">
                {t('leaderboardDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Leaderboard Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="sellers" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 glass-card mb-12">
                <TabsTrigger value="sellers" className="data-[state=active]:bg-primary/20">
                  {t('topSellers')}
                </TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-primary/20">
                  {t('topProducts')}
                </TabsTrigger>
                <TabsTrigger value="buyers" className="data-[state=active]:bg-primary/20">
                  {t('topBuyers')}
                </TabsTrigger>
              </TabsList>

              {/* Top Sellers */}
              <TabsContent value="sellers" className="space-y-6">
                {topSellers.map((seller, index) => (
                  <Card key={seller.id} className="glass-card overflow-hidden group hover:scale-[1.01] transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getBadgeIcon(index + 1)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-16 w-16 border-2 border-primary/30">
                          <AvatarImage src={seller.avatar} alt={seller.name} />
                          <AvatarFallback>{seller.name[0]}</AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {seller.name}
                            </h3>
                            <Badge className="badge-glow border-0">
                              {seller.badge}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span>{seller.sales} {t('sales')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span>{seller.rating} {t('rating')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Revenue */}
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-foreground/60 mb-1">{t('totalRevenue')}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {seller.revenue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Top Products */}
              <TabsContent value="products" className="space-y-6">
                {topProducts.map((product, index) => (
                  <Card key={product.id} className="glass-card overflow-hidden group hover:scale-[1.01] transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getBadgeIcon(index + 1)}
                        </div>

                        {/* Image */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border/50">
                          <img 
                            src={getCategoryImage(product.category, product.image)} 
                            alt={product.category}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-foreground/60 mb-2">{t('by')} {product.seller}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span>{product.sales} {t('sold')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-foreground/60 mb-1">{t('price')}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Top Buyers */}
              <TabsContent value="buyers" className="space-y-6">
                {topBuyers.map((buyer, index) => (
                  <Card key={buyer.id} className="glass-card overflow-hidden group hover:scale-[1.01] transition-all">
                    <div className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getBadgeIcon(index + 1)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-16 w-16 border-2 border-primary/30">
                          <AvatarImage src={buyer.avatar} alt={buyer.name} />
                          <AvatarFallback>{buyer.name[0]}</AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-foreground truncate mb-2 group-hover:text-primary transition-colors">
                            {buyer.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span>{buyer.purchases} {t('purchases')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span>{buyer.rating} {t('rating')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Spent */}
                        <div className="text-right hidden md:block">
                          <p className="text-sm text-foreground/60 mb-1">{t('totalSpent')}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {buyer.spent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
