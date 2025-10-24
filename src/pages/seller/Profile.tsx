import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Upload,
  Save,
  Store
} from "lucide-react";

const SellerProfile = () => {
  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Seller Profile
          </h1>
          <p className="text-foreground/60">Manage your seller account information</p>
        </div>

        {/* Profile Picture */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary/30">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=seller" />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="glass-card border-border/50">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-sm text-foreground/60">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </Card>

        {/* Store Information */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Store Information</h2>
          <form className="space-y-5">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-foreground">
                Store Name
              </Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input
                  id="storeName"
                  defaultValue="Digital Assets Store"
                  className="pl-10 glass-card border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Store Description */}
            <div className="space-y-2">
              <Label htmlFor="storeDesc" className="text-foreground">
                Store Description
              </Label>
              <Textarea
                id="storeDesc"
                placeholder="Tell buyers about your store..."
                className="glass-card border-border/50 focus:border-primary/50 min-h-[100px]"
                defaultValue="Premium digital gaming accounts and social media profiles. Verified and secure."
              />
              <p className="text-xs text-foreground/50">
                Brief description for your store (max 500 characters)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                  <Input
                    id="firstName"
                    defaultValue="John"
                    className="pl-10 glass-card border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                  <Input
                    id="lastName"
                    defaultValue="Seller"
                    className="pl-10 glass-card border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input
                  id="email"
                  type="email"
                  defaultValue="seller@example.com"
                  className="pl-10 glass-card border-border/50 focus:border-primary/50"
                />
              </div>
              <p className="text-xs text-foreground/50">
                Email is verified ✓
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+1 (555) 987-6543"
                  className="pl-10 glass-card border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input
                  id="location"
                  defaultValue="Los Angeles, USA"
                  className="pl-10 glass-card border-border/50 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="btn-glow">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="outline" className="glass-card border-border/50">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerProfile;
