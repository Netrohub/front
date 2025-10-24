import { useState, useRef } from "react";
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
import { Upload, X, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const socialPlatforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Twitter/X",
  "Facebook",
  "Snapchat",
  "Discord",
  "Twitch",
  "LinkedIn",
];

const ListSocialAccount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
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
            <Instagram className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('socialMediaAccounts')}
            </span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('listSocialAccount')}
          </h1>
          <p className="text-foreground/60">{t('sellerOnboardingDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('accountInformation')}</h2>
            <div className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  {t('username')} *
                </Label>
                <Input
                  id="username"
                  placeholder={t('enterUsername')}
                  className="glass-card border-border/50 focus:border-primary/50"
                  required
                />
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
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform.toLowerCase().replace(/\//g, "-")}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Description */}
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
                  {t('socialDescriptionHelp')}
                </p>
              </div>
            </div>
          </Card>


          {/* Pricing Section */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('pricingInformation')}</h2>
            <p className="text-sm text-destructive mb-6">
              {t('pricingWarning')}
            </p>
            <div className="space-y-5">
              {/* Original Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  {t('price')} (USD) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder={t('enterPrice')}
                    className="pl-8 glass-card border-border/50 focus:border-primary/50"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Discount Price (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="discountPrice" className="text-foreground">
                  {t('discountPrice')} ({t('optional')})
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder={t('enterDiscountPrice')}
                    className="pl-8 glass-card border-border/50 focus:border-primary/50"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Discount Description */}
              <div className="space-y-2">
                <Label htmlFor="discountDesc" className="text-foreground">
                  {t('discountDescription')} ({t('ifApplicable')})
                </Label>
                <Textarea
                  id="discountDesc"
                  placeholder={t('enterInstructions')}
                  className="glass-card border-border/50 focus:border-primary/50 min-h-[80px]"
                />
              </div>

              <p className="text-xs text-foreground/50">
                {t('noExternalLinks')}
              </p>
            </div>
          </Card>

          {/* Special Offer Section */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">{t('specialOffer')}</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-foreground/60">
                {t('specialOfferDesc')}
              </p>
              <div className="p-4 glass-card border border-primary/30 rounded-lg">
                <p className="text-xs text-foreground/60">
                  {t('securityCommitment')}
                </p>
              </div>
            </div>
          </Card>

          {/* Images Upload */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('accountScreenshots')}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden glass-card border border-border/50 group">
                    <img src={image} alt={`Account ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {images.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg glass-card border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-foreground/60 hover:text-primary"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">{t('uploadImage')}</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-foreground/50">
                {t('uploadScreenshots')}
              </p>
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </SellerLayout>
  );
};

export default ListSocialAccount;
