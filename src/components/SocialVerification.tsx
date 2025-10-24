import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  CheckCircle2, 
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialAccount {
  platform: "instagram" | "twitter" | "youtube" | "tiktok";
  username: string;
  status: "not_connected" | "pending" | "verified" | "failed";
  followers?: number;
  verifiedDate?: string;
}

const platformConfig = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "from-pink-500 to-purple-600",
    placeholder: "@username",
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "from-blue-400 to-cyan-600",
    placeholder: "@username",
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "from-red-500 to-red-700",
    placeholder: "Channel URL or @handle",
  },
  tiktok: {
    name: "TikTok",
    icon: ({ className }: { className?: string }) => (
      <div className={className}>🎵</div>
    ),
    color: "from-gray-800 to-black",
    placeholder: "@username",
  },
};

const SocialVerification = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      platform: "instagram",
      username: "",
      status: "not_connected",
    },
    {
      platform: "twitter",
      username: "",
      status: "not_connected",
    },
    {
      platform: "youtube",
      username: "",
      status: "not_connected",
    },
  ]);

  const { toast } = useToast();

  const handleConnect = async (platform: SocialAccount["platform"]) => {
    const account = accounts.find((a) => a.platform === platform);
    
    if (!account?.username) {
      toast({
        title: "Username Required",
        description: "Please enter your username or handle.",
        variant: "destructive",
      });
      return;
    }

    // Set to pending
    setAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform ? { ...a, status: "pending" } : a
      )
    );

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate success (80% chance)
    const success = Math.random() > 0.2;

    setAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform
          ? {
              ...a,
              status: success ? "verified" : "failed",
              followers: success ? Math.floor(Math.random() * 100000) : undefined,
              verifiedDate: success ? new Date().toLocaleDateString() : undefined,
            }
          : a
      )
    );

    toast({
      title: success ? "Verification Successful!" : "Verification Failed",
      description: success
        ? `Your ${platformConfig[platform].name} account has been verified.`
        : "Unable to verify account. Please check your username and try again.",
      variant: success ? "default" : "destructive",
    });
  };

  const getStatusBadge = (status: SocialAccount["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Verifying...
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-foreground/10 text-foreground/60">
            Not Connected
          </Badge>
        );
    }
  };

  const verifiedCount = accounts.filter((a) => a.status === "verified").length;
  const totalAccounts = accounts.length;
  const verificationProgress = (verifiedCount / totalAccounts) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">Social Verification</h3>
            <p className="text-sm text-foreground/60">
              Connect and verify your social media accounts
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {verifiedCount}/{totalAccounts}
            </p>
            <p className="text-xs text-foreground/60">Verified</p>
          </div>
        </div>
        <Progress value={verificationProgress} className="h-2" />
      </Card>

      {/* Info Card */}
      <Card className="glass-card p-4 border border-primary/20 bg-primary/5">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">Why verify?</h4>
            <p className="text-sm text-foreground/70">
              Verified accounts get priority listings, higher trust scores, and access to
              premium features. Your credentials are never stored.
            </p>
          </div>
        </div>
      </Card>

      {/* Social Accounts */}
      <div className="space-y-4">
        {accounts.map((account) => {
          const config = platformConfig[account.platform];
          const Icon = config.icon;

          return (
            <Card key={account.platform} className="glass-card p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{config.name}</h4>
                      {account.status === "verified" && account.followers && (
                        <p className="text-sm text-foreground/60">
                          {account.followers.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(account.status)}
                </div>

                {/* Input & Actions */}
                {(account.status === "not_connected" || account.status === "failed") && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`${account.platform}-username`} className="text-sm font-medium">
                        Username or Handle
                      </Label>
                      <Input
                        id={`${account.platform}-username`}
                        placeholder={config.placeholder}
                        value={account.username}
                        onChange={(e) =>
                          setAccounts((prev) =>
                            prev.map((a) =>
                              a.platform === account.platform
                                ? { ...a, username: e.target.value }
                                : a
                            )
                          )
                        }
                        className="glass-card border-primary/30 mt-1"
                      />
                    </div>
                    <Button
                      onClick={() => handleConnect(account.platform)}
                      className="w-full btn-glow"
                      disabled={!account.username}
                    >
                      Connect & Verify
                    </Button>
                  </div>
                )}

                {account.status === "pending" && (
                  <div className="text-center py-4">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-3 animate-pulse">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/60">
                      Verifying your account... This may take a few moments.
                    </p>
                  </div>
                )}

                {account.status === "verified" && (
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg border border-primary/20 bg-primary/5">
                    <div>
                      <p className="font-semibold text-foreground">{account.username}</p>
                      <p className="text-xs text-foreground/60">
                        Verified on {account.verifiedDate}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="glass-card border-primary/30"
                      onClick={() =>
                        setAccounts((prev) =>
                          prev.map((a) =>
                            a.platform === account.platform
                              ? { ...a, status: "not_connected", username: "" }
                              : a
                          )
                        )
                      }
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SocialVerification;
