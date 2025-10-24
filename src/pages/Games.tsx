import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import ProductCard from "@/components/ProductCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Search, 
  Filter,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const gamePlatforms = [
  { 
    name: "Steam", 
    icon: "🎮",
    count: 1250,
    color: "from-blue-500 to-blue-700"
  },
  { 
    name: "PlayStation", 
    icon: "🎯",
    count: 890,
    color: "from-blue-600 to-indigo-600"
  },
  { 
    name: "Xbox", 
    icon: "🎪",
    count: 756,
    color: "from-green-500 to-emerald-600"
  },
  { 
    name: "Epic Games", 
    icon: "⚡",
    count: 634,
    color: "from-gray-600 to-gray-800"
  },
  { 
    name: "Phone", 
    icon: "📱",
    count: 982,
    color: "from-purple-500 to-pink-600"
  },
];

const featuredAccounts = [
  {
    id: "g1",
    name: "Steam Account - 500+ Games Library",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    category: "Steam",
    rating: 4.9,
    reviews: 234,
    featured: true,
  },
  {
    id: "g2",
    name: "PlayStation Plus Premium - 2 Years",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    category: "PlayStation",
    rating: 4.8,
    reviews: 189,
    featured: true,
  },
  {
    id: "g3",
    name: "Xbox Game Pass Ultimate Account",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    category: "Xbox",
    rating: 4.9,
    reviews: 156,
    featured: true,
  },
  {
    id: "g4",
    name: "Epic Games - Fortnite Rare Skins",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    category: "Epic Games",
    rating: 4.7,
    reviews: 342,
    featured: false,
  },
  {
    id: "g5",
    name: "Nintendo Switch Online Family Plan",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    category: "Nintendo",
    rating: 4.6,
    reviews: 278,
    featured: false,
  },
  {
    id: "g6",
    name: "Battle.net - Overwatch 2 Legendary",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
    category: "Battle.net",
    rating: 4.8,
    reviews: 167,
    featured: false,
  },
];

const Games = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredAccounts = useMemo(() => {
    let filtered = [...featuredAccounts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Platform filter
    if (selectedPlatform) {
      filtered = filtered.filter(account => account.category === selectedPlatform);
    }

    return filtered;
  }, [searchQuery, selectedPlatform]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 gradient-nebula opacity-60" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-4">
                <Gamepad2 className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t('gamingMarketplace')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('gameAccounts')}
              </h1>
              <p className="text-lg text-foreground/60">
                {t('gameAccountsDesc')}
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
                  <Input
                    type="search"
                    placeholder={t('searchGames')}
                    className="w-full pl-12 pr-4 h-14 glass-card border-primary/30 focus:border-primary/50 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 btn-glow">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('filters')}
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 pt-6">
                <div className="text-center">
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    5,000+
                  </p>
                  <p className="text-sm text-foreground/60">{t('activeListings')}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    98%
                  </p>
                  <p className="text-sm text-foreground/60">{t('successRate')}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    24/7
                  </p>
                  <p className="text-sm text-foreground/60">{t('support247')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Categories */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center space-y-3">
              <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t('browseByPlatform')}
              </h2>
              <p className="text-foreground/60 text-lg">{t('choosePlatform')}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {gamePlatforms.map((platform) => (
                <Card
                  key={platform.name}
                  className={`glass-card cursor-pointer p-6 text-center group hover:scale-105 transition-all duration-300 ${
                    selectedPlatform === platform.name ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedPlatform(selectedPlatform === platform.name ? null : platform.name)}
                >
                  <div className="mb-4 flex justify-center">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${platform.color} group-hover:scale-110 transition-all duration-300 shadow-lg text-3xl`}>
                      {platform.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 font-bold text-foreground group-hover:text-primary transition-colors">
                    {platform.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {platform.count}
                    </Badge>
                    <span className="text-xs text-foreground/50">{t('accounts')}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Accounts */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-cosmic opacity-30" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {t('featuredAccounts')}
                </h2>
                <p className="text-foreground/60 text-lg">{t('premiumVerified')}</p>
              </div>
              <Button variant="outline" className="glass-card border-primary/30 hover:border-primary/50 gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('viewAll')}
              </Button>
            </div>

            {selectedPlatform && (
              <div className="mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {selectedPlatform}
                  <button 
                    className="ml-2 hover:text-primary/70"
                    onClick={() => setSelectedPlatform(null)}
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}

            {filteredAccounts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAccounts.map((account) => (
                  <ProductCard key={account.id} {...account} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">{t('noProductsFound')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-xl glass-card border border-primary/30 mb-2">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">{t('verifiedAccounts')}</h3>
                <p className="text-sm text-foreground/60">
                  {t('verifiedAccountsDesc')}
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-xl glass-card border border-accent/30 mb-2">
                  <Gamepad2 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-bold text-xl text-foreground">{t('instantAccess')}</h3>
                <p className="text-sm text-foreground/60">
                  {t('instantAccessDesc')}
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 rounded-xl glass-card border border-primary/30 mb-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl text-foreground">{t('moneyBack')}</h3>
                <p className="text-sm text-foreground/60">
                  {t('moneyBackDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Games;
