import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const gamingPlatforms = [
  "Steam",
  "PlayStation (PS4/PS5)",
  "Xbox",
  "Epic Games",
  "Nintendo Switch",
  "Battle.net",
  "Origin/EA",
  "Ubisoft Connect",
  "Mobile Gaming",
];

const popularGames = [
  "PUBG Mobile",
  "Call of Duty",
  "Fortnite",
  "Apex Legends",
  "Valorant",
  "League of Legends",
  "Dota 2",
  "CS:GO",
  "GTA V",
  "Red Dead Redemption 2",
  "Minecraft",
  "Roblox",
  "FIFA",
  "NBA 2K",
];

const ListGamingAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToNonRefund, setAgreedToNonRefund] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms || !agreedToNonRefund) {
      toast({
        title: t('termsRequired'),
        description: t('agreeToTerms'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('accountListedSuccess'),
      description: t('accountSubmittedReview'),
    });
    
    navigate("/seller/products");
  };

  return (
    <SellerLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30">
            <Gamepad2 className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('gamingAccounts')}
            </span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('listGamingAccount')}
          </h1>
          <p className="text-foreground/60">{t('sellerOnboardingDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('accountInformation')}</h2>
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  {t('title')} *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Steam Account with 500+ Games"
                  className="glass-card border-border/50 focus:border-primary/50"
                  required
                />
              </div>

              {/* Game */}
              <div className="space-y-2">
                <Label htmlFor="game" className="text-foreground">
                  {t('game')} *
                </Label>
                <Select required>
                  <SelectTrigger className="glass-card border-border/50 bg-background">
                    <SelectValue placeholder={t('selectGame')} />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card border-border z-50">
                    {popularGames.map((game) => (
                      <SelectItem key={game} value={game.toLowerCase().replace(/\s+/g, "-")}>
                        {game}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-foreground">
                  {t('platform')} *
                </Label>
                <Select required>
                  <SelectTrigger className="glass-card border-border/50 bg-background">
                    <SelectValue placeholder={t('selectPlatform')} />
                  </SelectTrigger>
                  <SelectContent className="glass-card bg-card border-border z-50">
                    {gamingPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform.toLowerCase().replace(/\s+/g, "-")}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  {t('accountDescription')} *
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('provideDescription')}
                  className="glass-card border-border/50 focus:border-primary/50 min-h-[120px]"
                  required
                />
                <p className="text-xs text-foreground/50">
                  {t('configInstructionsHelp')}
                </p>
              </div>
            </div>
          </Card>

          {/* Delivery Information */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Delivery Information</h2>
            <p className="text-sm text-foreground/60 mb-6">
              We are committed to providing a secure platform for buying and selling accounts. You must complete these steps to complete your account addition.
            </p>
            <div className="space-y-5">
              {/* Account Email/Username */}
              <div className="space-y-2">
                <Label htmlFor="accountEmail" className="text-foreground">
                  Account Email/Username *
                </Label>
                <Input
                  id="accountEmail"
                  type="text"
                  placeholder="Enter account email or username"
                  className="glass-card border-border/50 focus:border-primary/50"
                  required
                />
              </div>

              {/* Account Password */}
              <div className="space-y-2">
                <Label htmlFor="accountPassword" className="text-foreground">
                  Account Password *
                </Label>
                <Input
                  id="accountPassword"
                  type="password"
                  placeholder="Enter account password"
                  autoComplete="off"
                  className="glass-card border-border/50 focus:border-primary/50"
                  required
                />
                <p className="text-xs text-destructive">
                  Please make sure you enter a strong password. Enter a password that contains at least one number, lowercase, uppercase, and special character.
                </p>
              </div>

              {/* Additional Data */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo" className="text-foreground">
                  Additional Information
                </Label>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full glass-card border-primary/30 hover:border-primary/50"
                >
                  Add Additional Information
                </Button>
              </div>

              {/* Buyer Instructions */}
              <div className="space-y-2">
                <Label htmlFor="buyerInstructions" className="text-foreground">
                  Instructions for Buyer
                </Label>
                <Textarea
                  id="buyerInstructions"
                  placeholder="Enter instructions (or accounting or banking details)"
                  className="glass-card border-border/50 focus:border-primary/50 min-h-[100px]"
                />
                <p className="text-xs text-foreground/50">
                  These instructions will appear to the buyer before purchase and upon purchase completion
                </p>
              </div>
            </div>
          </Card>

          {/* Pricing & Images */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Pricing & Images</h2>
            <div className="space-y-5">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Price (USD) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter your expected price"
                    className="pl-8 glass-card border-border/50 focus:border-primary/50"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  Please do not include external links in the description or description field, as this may result in account suspension and possible exposure of your account to theft
                </p>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <Label className="text-foreground">Account Images</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden glass-card border border-border/50 group">
                        <img src={image} alt={`Account ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 p-1 rounded-full bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 6 && (
                      <button
                        type="button"
                        className="aspect-square rounded-lg glass-card border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-foreground/60 hover:text-primary"
                      >
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Upload</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-foreground/50">
                    Upload screenshots or images of the account (max 6 images)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('termsAndConditions')}</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms1" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms1"
                  className="text-sm text-foreground/70 leading-relaxed cursor-pointer"
                >
                  {t('term1')}
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms2"
                  checked={agreedToNonRefund}
                  onCheckedChange={(checked) => setAgreedToNonRefund(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms2"
                  className="text-sm text-foreground/70 leading-relaxed cursor-pointer"
                >
                  {t('term2')}
                </label>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Card className="glass-card p-6">
            <Button 
              type="submit" 
              className="w-full btn-glow h-12 text-base"
              disabled={!agreedToTerms || !agreedToNonRefund}
            >
              {t('submitAccount')}
            </Button>
          </Card>
        </form>
      </div>
    </SellerLayout>
  );
};

export default ListGamingAccount;
