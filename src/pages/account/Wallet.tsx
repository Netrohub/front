import { useState } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

const transactions = [
  {
    id: "TXN001",
    type: "credit",
    amount: 299.99,
    description: "Sold Steam Account",
    status: "completed",
    date: "2024-01-20",
  },
  {
    id: "TXN002",
    type: "debit",
    amount: 149.99,
    description: "Withdrawal to Bank",
    status: "completed",
    date: "2024-01-18",
  },
  {
    id: "TXN003",
    type: "credit",
    amount: 599.99,
    description: "Sold Instagram Account",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "TXN004",
    type: "debit",
    amount: 49.99,
    description: "Service Fee",
    status: "completed",
    date: "2024-01-12",
  },
];

const Wallet = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(1249.50);
  const [pendingBalance] = useState(599.99);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to add.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Adding funds to your wallet.",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const addAmount = parseFloat(amount);
      setBalance(prev => prev + addAmount);
      
      toast({
        title: "Funds added! 💰",
        description: `$${addAmount.toFixed(2)} has been added to your wallet.`,
      });
      
      setAddFundsOpen(false);
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to withdraw this amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Processing your withdrawal request.",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBalance(prev => prev - withdrawAmount);
      
      toast({
        title: "Withdrawal successful! 💸",
        description: `$${withdrawAmount.toFixed(2)} will be transferred to your bank account in 1-3 business days.`,
      });
      
      setWithdrawOpen(false);
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
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
            Wallet
          </h1>
          <p className="text-foreground/60">Manage your balance and transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Available Balance */}
          <Card className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-foreground/60 mb-2">
                <WalletIcon className="h-4 w-4" />
                <span className="text-sm">Available Balance</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                ${balance.toFixed(2)}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="btn-glow"
                  onClick={() => setAddFundsOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="glass-card border-border/50"
                  onClick={() => setWithdrawOpen(true)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>

          {/* Pending Balance */}
          <Card className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-foreground/60 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Pending Balance</span>
              </div>
              <p className="text-4xl font-black text-foreground mb-4">
                ${pendingBalance.toFixed(2)}
              </p>
              <p className="text-sm text-foreground/60">
                Funds will be available in 3-5 business days
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="glass-card border-border/50 justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <ArrowDownLeft className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Deposit</p>
                  <p className="text-xs text-foreground/60">Add funds to wallet</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="glass-card border-border/50 justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Withdraw</p>
                  <p className="text-xs text-foreground/60">Transfer to bank</p>
                </div>
              </div>
            </Button>

            <Button variant="outline" className="glass-card border-border/50 justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Request Payout</p>
                  <p className="text-xs text-foreground/60">Get your earnings</p>
                </div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Transaction History</h2>
            <Button variant="outline" size="sm" className="glass-card border-border/50">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg glass-card border border-border/30 hover:border-border/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "credit"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-accent/10 border border-accent/20"
                    }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{transaction.description}</p>
                    <p className="text-sm text-foreground/60">{transaction.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className={
                      transaction.status === "completed"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }
                  >
                    {transaction.status === "completed" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {transaction.status}
                  </Badge>
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "credit" ? "text-primary" : "text-accent"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Funds Dialog */}
        <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Add Funds to Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount you want to add to your wallet balance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="addAmount">Amount (USD)</Label>
                <Input
                  id="addAmount"
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-card border-border/50"
                  min="1"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddFundsOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-glow" onClick={handleAddFunds}>
                Add Funds
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Dialog */}
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to withdraw to your bank account.
                Available balance: ${balance.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-card border-border/50"
                  min="1"
                  step="0.01"
                  max={balance}
                />
                <p className="text-xs text-foreground/50">
                  Funds will be transferred in 1-3 business days
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
                Cancel
              </Button>
              <Button className="btn-glow" onClick={handleWithdraw}>
                Withdraw
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AccountLayout>
  );
};

export default Wallet;
