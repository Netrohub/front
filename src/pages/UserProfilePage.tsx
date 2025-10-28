import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient, queryKeys } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  TrendingUp,
  Award,
  MessageCircle,
  Share2,
  User,
  ThumbsUp,
  Package,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Product } from "@/lib/api";

interface UserProfile {
  id: number;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  verified: boolean;
  rating?: number;
  totalReviews?: number;
  memberSince?: string;
  roles?: string[];
  stats?: {
    totalProducts?: number;
    totalSales?: number;
    rating?: number;
  };
}

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  // Fetch user profile by username (case-insensitive)
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: queryKeys.userByUsername(username!),
    queryFn: () => apiClient.getUserByUsername(username!),
    enabled: !!username,
  });

  // Check if this is the current user's profile
  useEffect(() => {
    if (profile && currentUser) {
      setIsOwner(profile.id === currentUser.id);
    }
  }, [profile, currentUser]);

  // Show loading skeleton
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
          <ConditionalStarfield />
          <Navbar />
          
          <main className="flex-1 relative z-10 py-8">
            <div className="container mx-auto px-4">
              {/* Header Skeleton */}
              <div className="space-y-6">
                <Card className="glass-card p-6 h-48">
                  <Skeleton className="h-full w-full" />
                </Card>
                
                {/* Content Skeleton */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="glass-card p-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-8 w-3/4" />
                  </Card>
                  <Card className="glass-card p-6 md:col-span-2">
                    <Skeleton className="h-full w-full" />
                  </Card>
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  // Show 404 if user not found
  if (isError || !profile) {
    return (
      <>
        <Helmet>
          <title>User Not Found - NXOLand</title>
        </Helmet>
        <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
          <ConditionalStarfield />
          <Navbar />
          
          <main className="flex-1 relative z-10 py-8">
            <div className="container mx-auto px-4">
              <Card className="glass-card p-12 text-center">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
                <p className="text-foreground/60 mb-6">
                  The user @{username} doesn't exist or has been removed.
                </p>
                <Button asChild>
                  <a href="/">Go to Home</a>
                </Button>
              </Card>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  // Check if user is seller first
  const isSeller = profile.roles?.includes('seller');
  
  // Fetch user's products if they're a seller
  const { data: userProducts } = useQuery({
    queryKey: ['user-products', username],
    queryFn: () => apiClient.getProductsByUser(username!),
    enabled: !!isSeller && !!username,
  });

  const userData: UserProfile = {
    id: profile.id,
    username: profile.username || username!,
    name: profile.name || profile.username,
    avatar: profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    bio: profile.bio,
    location: profile.location,
    verified: profile.roles?.includes('verified') || false,
    rating: 4.8,
    totalReviews: 0,
    memberSince: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    stats: {
      totalProducts: userProducts?.length || 0,
      totalSales: 0,
      rating: 4.8,
    },
    roles: profile.roles,
  };

  // SEO metadata
  const canonicalUrl = `https://nxoland.com/@${username}`;
  const ogImage = userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <>
      <Helmet>
        <title>{userData.name} (@{userData.username}) - NXOLand</title>
        <meta name="description" content={userData.bio || `View ${userData.name}'s profile on NXOLand`} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${userData.name} (@${userData.username})`} />
        <meta property="og:description" content={userData.bio || `View ${userData.name}'s profile on NXOLand`} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={`${userData.name} (@${userData.username})`} />
        <meta name="twitter:description" content={userData.bio || `View ${userData.name}'s profile on NXOLand`} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
        <ConditionalStarfield />
        <Navbar />
        
        <main className="flex-1 relative z-10 py-8">
          <div className="container mx-auto px-4">
            {/* Header */}
            <Card className="glass-card p-6 mb-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-2xl">{userData.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-black text-foreground">
                      {userData.name}
                    </h1>
                    {userData.verified && (
                      <Badge className="bg-blue-500 text-white border-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {isSeller && (
                      <Badge className="bg-primary text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        Seller
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-foreground/60 mb-4">
                    @{userData.username}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {userData.memberSince}</span>
                    </div>
                    {userData.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{userData.rating} ({userData.totalReviews} reviews)</span>
                      </div>
                    )}
                  </div>

                  {userData.bio && (
                    <div className="mt-4 p-3 bg-muted/20 rounded-lg border border-border/30">
                      <p className="text-foreground/80 text-sm">{userData.bio}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {isOwner && (
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Stats */}
            {isSeller && (
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <Card className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Package className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userProducts?.length || 0}</p>
                      <p className="text-xs text-foreground/60">Products</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userData.stats?.totalSales || 0}</p>
                      <p className="text-xs text-foreground/60">Sales</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userData.stats?.rating || 0}</p>
                      <p className="text-xs text-foreground/60">Rating</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <ThumbsUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{userData.totalReviews || 0}</p>
                      <p className="text-xs text-foreground/60">Reviews</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Tabs Content */}
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="glass-card">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                {isSeller && <TabsTrigger value="sales">Sales</TabsTrigger>}
              </TabsList>

              <TabsContent value="products">
                {isSeller && userProducts && userProducts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="default"
                        showStatus={isOwner}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card p-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
                    <p className="text-foreground/60">
                      {isOwner ? 'Start by listing your first product!' : 'This user hasn\'t listed any products yet.'}
                    </p>
                    {isOwner && (
                      <Button asChild className="mt-4">
                        <a href="/seller/products/create">List Your First Product</a>
                      </Button>
                    )}
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="glass-card p-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-foreground/60">No reviews have been posted yet.</p>
                </Card>
              </TabsContent>

              {isSeller && (
                <TabsContent value="sales">
                  <Card className="glass-card p-12 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Sales Data</h3>
                    <p className="text-foreground/60">Sales information will appear here.</p>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default UserProfilePage;
