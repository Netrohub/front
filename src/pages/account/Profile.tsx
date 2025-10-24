import AccountLayout from "@/components/AccountLayout";
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
  Save
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Countries with dial codes
const countries = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
];

const Profile = () => {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string>("https://api.dicebear.com/7.x/avataaars/svg?seed=user");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Security modal states
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [enable2FAOpen, setEnable2FAOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load saved avatar on mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const newAvatar = e.target.result as string;
          setAvatar(newAvatar);
          
          // Save to backend (in mock mode, just localStorage)
          localStorage.setItem('user_avatar', newAvatar);
          
          // Dispatch custom event to notify Navbar about avatar change
          window.dispatchEvent(new Event('avatarUpdated'));
          
          toast({
            title: "Avatar updated!",
            description: "Your profile picture has been saved successfully.",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Security handlers
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Password Changed! ✅",
        description: "Your password has been updated successfully.",
      });
      
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEnable2FA = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "2FA Enabled! ✅",
        description: "Two-factor authentication has been enabled successfully.",
      });
      
      setEnable2FAOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable 2FA. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-foreground/60">Manage your account information</p>
        </div>

        {/* Profile Picture */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-2 border-primary/30">
              <AvatarImage src={avatar} />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="glass-card border-border/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>
              <p className="text-sm text-foreground/60">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>
          <form className="space-y-5">
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
                    defaultValue="Doe"
                    className="pl-10 glass-card border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
                <span className="text-xs text-foreground/50 ml-2">(Cannot be changed)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                <Input
                  id="username"
                  defaultValue="johndoe123"
                  className="pl-10 glass-card border-border/50 bg-muted/30 cursor-not-allowed"
                  readOnly
                  disabled
                />
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
                  defaultValue="john.doe@example.com"
                  className="pl-10 glass-card border-border/50 focus:border-primary/50 bg-muted/50"
                  readOnly
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
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-[140px] justify-between glass-card border-border/50"
                    >
                      <span className="flex items-center gap-2">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.dialCode}</span>
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-0 glass-card border-border/50">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.code}
                              onSelect={() => {
                                setSelectedCountry(country);
                                setCountryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <span className="mr-2">{country.flag}</span>
                              <span>{country.name} ({country.dialCode})</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Phone Input */}
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 glass-card border-border/50 focus:border-primary/50 bg-muted/50"
                    readOnly
                  />
                </div>
              </div>
              <p className="text-xs text-foreground/50">
                Phone is verified ✓
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                className="glass-card border-border/50 focus:border-primary/50 min-h-[100px]"
                defaultValue="Passionate gamer and digital content creator."
              />
              <p className="text-xs text-foreground/50">
                Brief description for your profile (max 500 characters)
              </p>
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
                  defaultValue="New York, USA"
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

        {/* Security Settings */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div>
                <p className="font-semibold text-foreground mb-1">Password</p>
                <p className="text-sm text-foreground/60">Last changed 30 days ago</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-card border-border/50"
                onClick={() => setChangePasswordOpen(true)}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30">
              <div>
                <p className="font-semibold text-foreground mb-1">Two-Factor Authentication</p>
                <p className="text-sm text-foreground/60">Add an extra layer of security</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-card border-border/50"
                onClick={() => setEnable2FAOpen(true)}
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </Card>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />

        {/* Change Password Modal */}
        {changePasswordOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="glass-card p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-foreground mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-foreground">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="glass-card border-border/50"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword" className="text-foreground">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-card border-border/50"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-card border-border/50"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleChangePassword}
                    className="flex-1 btn-glow"
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setChangePasswordOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Enable 2FA Modal */}
        {enable2FAOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="glass-card p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-foreground mb-4">Enable Two-Factor Authentication</h3>
              <div className="space-y-4">
                <p className="text-sm text-foreground/60">
                  Two-factor authentication adds an extra layer of security to your account. 
                  You'll receive SMS codes on your verified phone number.
                </p>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    📱 2FA is only available via SMS to your verified phone number
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleEnable2FA}
                    className="flex-1 btn-glow"
                  >
                    Enable 2FA
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEnable2FAOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Profile;
