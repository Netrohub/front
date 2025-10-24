import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Plus,
  Trash2,
  Download,
  DollarSign
} from "lucide-react";

const paymentMethods = [
  {
    id: 1,
    type: "visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "mastercard",
    last4: "5555",
    expiry: "08/26",
    isDefault: false,
  },
];

const earnings = [
  {
    id: "PAY-001",
    description: "Sales Payment - Week 3",
    amount: 1249.50,
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: "PAY-002",
    description: "Sales Payment - Week 2",
    amount: 987.30,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: "PAY-003",
    description: "Sales Payment - Week 1",
    amount: 1456.80,
    date: "2024-01-06",
    status: "completed",
  },
];

const SellerBilling = () => {
  const { toast } = useToast();

  const handleAddCard = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method form will open here.",
    });
  };

  const handleSetDefault = (methodId: number) => {
    toast({
      title: "Default Payment Method",
      description: "Payment method set as default successfully.",
    });
  };

  const handleDeleteCard = (methodId: number) => {
    toast({
      title: "Delete Payment Method",
      description: "Payment method deleted successfully.",
    });
  };

  const handleDownloadStatement = (paymentId: string) => {
    toast({
      title: "Download Statement",
      description: `Downloading statement ${paymentId}...`,
    });
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Billing & Earnings
          </h1>
          <p className="text-foreground/60">Manage your payment methods and view earnings</p>
        </div>

        {/* Earnings Overview */}
        <Card className="glass-card p-6 border border-primary/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="badge-glow border-0 mb-3">Total Earnings</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">Available Balance</h2>
              <p className="text-foreground/60">Ready for withdrawal</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                $3,693.60
              </p>
              <p className="text-sm text-foreground/60">Last 30 days</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="btn-glow">
              <DollarSign className="h-4 w-4 mr-2" />
              Withdraw Funds
            </Button>
            <Button variant="outline" className="glass-card border-border/50">
              View Full History
            </Button>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
            <Button size="sm" className="btn-glow" onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground capitalize">
                        {method.type} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/60">Expires {method.expiry}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-card border-border/50"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCard(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Earnings History */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Earnings History</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link to="/seller/billing">
                View All
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {earnings.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30"
              >
                <div>
                  <p className="font-semibold text-foreground mb-1">{payment.description}</p>
                  <p className="text-sm text-foreground/60">
                    Payment #{payment.id} • {payment.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {payment.status}
                  </Badge>
                  <p className="text-lg font-bold text-foreground">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="glass-card border-border/50"
                    onClick={() => handleDownloadStatement(payment.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerBilling;
