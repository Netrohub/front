import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Calendar } from "lucide-react";
// import { useMembers } from "@/hooks/useApi";

const Members = () => {
  // Members feature is coming soon
  const members = [];
  const loading = false;
  const error = null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Community Members</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Meet the amazing members of our marketplace community
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Members Feature Coming Soon</h3>
              <p className="text-muted-foreground">
                We're working on building a community feature where you can discover and connect with other marketplace members.
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>✨ Discover verified sellers and buyers</p>
              <p>🤝 Connect with like-minded community members</p>
              <p>📊 View member profiles and activity</p>
              <p>🏆 Community leaderboards and achievements</p>
            </div>
          </div>
        </div>

        {!loading && (!members || members.length === 0) && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Members feature coming soon</h3>
            <p className="text-muted-foreground">This feature is currently under development.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Members;

