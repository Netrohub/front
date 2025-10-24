import { useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  CreditCard, 
  Plus,
  Trash2,
  CheckCircle2
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

const billingHistory = [
  {
    id: "INV-001",
    description: "Pro Plan - Monthly",
    amount: 29.00,
    date: "2024-01-20",
    status: "paid",
  },
  {
    id: "INV-002",
    description: "Pro Plan - Monthly",
    amount: 29.00,
    date: "2023-12-20",
    status: "paid",
  },
  {
    id: "INV-003",
    description: "Pro Plan - Monthly",
    amount: 29.00,
    date: "2023-11-20",
    status: "paid",
  },
];

const Billing = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState(paymentMethods);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  
  // Add card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleCancelSubscription = () => {
    toast({
      title: "Cancel Subscription",
      description: "Please contact support to cancel your subscription.",
      variant: "destructive",
    });
  };

  const handleAddCard = async () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "All fields required",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Adding card...",
        description: "Please wait.",
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const newCard = {
        id: Date.now(),
        type: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
        last4: cardNumber.slice(-4),
        expiry: expiryDate,
        isDefault: cards.length === 0,
      };

      setCards([...cards, newCard]);
      
      toast({
        title: "Card added! 💳",
        description: "Payment method has been saved successfully.",
      });

      setAddCardOpen(false);
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = (methodId: number) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === methodId
    })));
    
    toast({
      title: "Default updated! ✅",
      description: "Payment method set as default successfully.",
    });
  };

  const handleDeleteCardClick = (methodId: number) => {
    setCardToDelete(methodId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      setCards(cards.filter(card => card.id !== cardToDelete));
      
      toast({
        title: "Card deleted",
        description: "Payment method has been removed.",
      });
      
      setDeleteDialogOpen(false);
      setCardToDelete(null);
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Downloading invoice...",
      description: `Downloading ${invoiceId}`,
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download complete!",
        description: "Invoice downloaded successfully.",
      });
    }, 1000);
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Billing & Subscription
          </h1>
          <p className="text-foreground/60">Manage your subscription and payment methods</p>
        </div>

        {/* Current Plan */}
        <Card className="glass-card p-6 border border-primary/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="badge-glow border-0 mb-3">Current Plan</Badge>
              <h2 className="text-2xl font-bold text-foreground mb-2">Pro Plan</h2>
              <p className="text-foreground/60">Unlimited listings, 3% transaction fee</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                $29
              </p>
              <p className="text-sm text-foreground/60">per month</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30 mb-4">
            <div>
              <p className="font-semibold text-foreground mb-1">Next billing date</p>
              <p className="text-sm text-foreground/60">February 20, 2024</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button asChild variant="outline" className="glass-card border-border/50">
              <Link to="/pricing">
                Change Plan
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="text-destructive hover:text-destructive"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Payment Methods</h2>
            <Button size="sm" className="btn-glow" onClick={() => setAddCardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>

          <div className="space-y-3">
            {cards.map((method) => (
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
                    onClick={() => handleDeleteCardClick(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Billing History */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Billing History</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link to="/account/billing">
                View All
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {billingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30"
              >
                <div>
                  <p className="font-semibold text-foreground mb-1">{invoice.description}</p>
                  <p className="text-sm text-foreground/60">
                    Invoice #{invoice.id} • {invoice.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {invoice.status}
                  </Badge>
                  <p className="text-lg font-bold text-foreground">
                    ${invoice.amount.toFixed(2)}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="glass-card border-border/50"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Card Dialog */}
        <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new credit or debit card to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newCardName">Cardholder Name</Label>
                <Input
                  id="newCardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCardNumber">Card Number</Label>
                <Input
                  id="newCardNumber"
                  placeholder="4111 1111 1111 1111"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="glass-card border-border/50"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newExpiry">Expiry (MM/YY)</Label>
                  <Input
                    id="newExpiry"
                    placeholder="12/25"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="glass-card border-border/50"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCvv">CVV</Label>
                  <Input
                    id="newCvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="glass-card border-border/50"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddCardOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-glow" onClick={handleAddCard}>
                Add Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Card Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="glass-card border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this payment method from your account.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AccountLayout>
  );
};

export default Billing;
