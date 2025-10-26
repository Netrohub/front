import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, CheckCircle2, Verified } from "lucide-react";
import { useMembers } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Members = () => {
  const { data: members, isLoading: loading, error } = useMembers();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBannerImage = (member: any) => {
    // Generate different abstract patterns for each member based on their ID
    const seed = member.id || Math.random();
    return `https://images.unsplash.com/photo-${1500000000000 + (seed % 1000000000)}?w=800&q=80`;
  };

  const handleCardClick = (member: any) => {
    // Use username from member data
    const username = member.username || `user${member.id}`;
    navigate(`/seller/${username}`);
  };

  const filteredMembers = members?.filter((member) => {
    // Prioritize username search, then fall back to name and email
    const matchesSearch = searchTerm === '' || 
                         (member.username && member.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesVerified = !verifiedOnly || member.roles?.includes('seller');
    
    return matchesSearch && matchesVerified;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-center mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Community Members
          </h1>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-border/50"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="verified-only"
                checked={verifiedOnly}
                onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
              />
              <label htmlFor="verified-only" className="text-sm font-medium cursor-pointer">
                Verified Sellers Only
              </label>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-2 border-primary/20">
                <Skeleton className="h-32 w-full" />
                <CardContent className="p-6">
                  <div className="flex flex-col items-center -mt-12 mb-4">
                    <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
                  </div>
                  <Skeleton className="h-5 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">Failed to load members</p>
            <p className="text-muted-foreground mt-2">Please try again later</p>
          </div>
        ) : filteredMembers && filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card 
                key={member.id} 
                onClick={() => handleCardClick(member)}
                className="overflow-hidden border-2 border-primary/20 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer group"
              >
                {/* Banner Image */}
                <div 
                  className="h-32 w-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(member.id * 137.5) % 360}, 70%, 60%), hsl(${((member.id * 137.5) + 60) % 360}, 70%, 50%))`
                  }}
                >
                  {/* Optional banner content */}
                </div>

                <CardContent className="p-6">
                  {/* Avatar overlapping banner */}
                  <div className="flex justify-center -mt-12 mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20">
                      <AvatarImage src={member.avatar || ""} alt={member.username || member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {getInitials(member.username || member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {member.roles?.includes('seller') && (
                      <div className="absolute -mt-8 ml-16">
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <Verified className="h-3 w-3 mr-1" />
                          Seller
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="text-center mb-2">
                    <h3 className="font-bold text-lg text-primary group-hover:text-primary/80 transition-colors">
                      @{member.username || `user${member.id}`}
                    </h3>
                    {member.name && member.name !== member.username && (
                      <p className="text-sm text-muted-foreground">{member.name}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-muted-foreground text-center mb-4 min-h-[3rem] line-clamp-3">
                    {member.bio || member.description || `Welcome to my store! I'm ${member.name || 'a member'} of this amazing community.`}
                  </div>

                  {/* Activity/Stats */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {member.roles?.includes('seller') && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                        Active Seller
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {member.created_at ? new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Member'}
                    </span>
                  </div>

                  {/* Clickable indicator */}
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full group-hover:via-primary transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Stats */}
        {!loading && members && members.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Members;

