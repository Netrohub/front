import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { tapPayment } from "@/lib/tapPayment";
import { useCart } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { 
  CreditCard, 
  Wallet, 
  Lock,
  CheckCircle2,
  AlertCircle,
  ShoppingCart
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // ✅ FIXED: Use real cart data from API
  const { data: cart, isLoading: isLoadingCart, error: cartError } = useCart();
  
  // Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  
  // ✅ FIXED: Calculate totals from real cart data
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const serviceFee = cart?.service_fee || 0;
  const total = cart?.total || 0;

  // Get test cards if in sandbox
  const testCards = tapPayment.isSandboxMode() ? tapPayment.getTestCards() : [];

  // ✅ Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      navigate('/products');
    }
  }, [isLoadingCart, cartItems, navigate, toast]);

  const handleCompletePurchase = async () => {
    // Validation
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        title: "Card details incomplete",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "You must agree to the Terms of Service and Refund Policy.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      toast({
        title: "Processing payment...",
        description: "Please wait while we process your payment securely.",
      });

      // ✅ FIXED: Create order through API with real cart items
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: 'CREDIT_CARD',
        shipping_address: {}, // Can be extended with real address data
      };

      // Create order in backend
      const order = await apiClient.createOrder(orderData);

      // Process payment through Tap
      const paymentResult = await tapPayment.processCardPayment(
        {
          number: cardNumber.replace(/\s/g, ''),
          name: cardName,
          expiry: expiryDate,
          cvv: cvv,
        },
        total,
        'USD'
      );

      console.log('✅ Payment successful:', paymentResult);
      console.log('✅ Order created:', order);

      toast({
        title: "Payment successful! 🎉",
        description: `Your order has been placed. Order #${order.order_number}`,
      });

      // Store order details for confirmation page
      const orderDetails = {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total: order.total_amount,
        items: order.items,
        paymentMethod: 'Credit Card',
        orderDate: order.created_at,
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      localStorage.setItem('last_order', JSON.stringify(orderDetails));

      // Clear cart after successful order
      // Note: Backend should handle this, but we can also invalidate the query
      
      // Redirect to order confirmation page
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
        <ConditionalStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Checkout
            </h1>
            <p className="text-foreground/60 text-sm sm:text-base">Complete your purchase securely</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="glass-card border-border/50 bg-muted/50"
                      value={email}
                      readOnly
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>
                <RadioGroup defaultValue="card" className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg glass-card border border-border/50 cursor-pointer hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Credit / Debit Card</p>
                        <p className="text-sm text-foreground/60">Pay with your card</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg glass-card border border-border/50 cursor-pointer hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Wallet Balance</p>
                        <p className="text-sm text-foreground/60">Use your wallet: $1,249.50</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Sandbox Test Card Info */}
                {tapPayment.isSandboxMode() && testCards.length > 0 && (
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-500">Sandbox Mode - Test Cards</p>
                        <p className="text-sm text-blue-500/80 mt-1">Use these test cards for testing:</p>
                      </div>
                    </div>
                    {testCards.map((card, idx) => (
                      <div key={idx} className="text-xs text-blue-500/70 mt-2 font-mono">
                        <strong>{card.type}:</strong> {card.number} | Exp: {card.expiry} | CVV: {card.cvv}
                      </div>
                    ))}
                  </div>
                )}

                {/* Card Details */}
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      className="glass-card border-border/50"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="cardNumber"
                      placeholder="4111 1111 1111 1111"
                      className="glass-card border-border/50"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date (MM/YY) <span className="text-destructive">*</span></Label>
                      <Input
                        id="expiry"
                        placeholder="01/25"
                        className="glass-card border-border/50"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value;
                          // Only allow numbers and forward slash
                          value = value.replace(/[^0-9/]/g, '');
                          // Auto-format MM/YY
                          if (value.length >= 2 && !value.includes('/')) {
                            value = value.substring(0, 2) + '/' + value.substring(2);
                          }
                          // Limit to MM/YY format
                          if (value.length <= 5) {
                            setExpiryDate(value);
                          }
                        }}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV <span className="text-destructive">*</span></Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="glass-card border-border/50"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Terms */}
              <Card className="glass-card p-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    className="mt-1"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-foreground/70 leading-relaxed cursor-pointer"
                  >
                    <span className="text-destructive">* </span>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-primary hover:text-primary/80 underline">
                      Terms of Service
                    </a>
                    ,{" "}
                    <a href="/refund-policy" target="_blank" className="text-primary hover:text-primary/80 underline">
                      Refund Policy
                    </a>
                    , and understand that all sales are final once the product is delivered.
                  </label>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card p-6 sticky top-4">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border/30">
                  {isLoadingCart ? (
                    <div className="text-sm text-foreground/60">Loading cart...</div>
                  ) : cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <ShoppingCart className="h-12 w-12 text-foreground/20 mb-2" />
                      <p className="text-sm text-foreground/60">Your cart is empty</p>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground/70 line-clamp-1">{item.product?.name || 'Product'}</p>
                          <p className="text-xs text-foreground/50">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-foreground whitespace-nowrap ml-2">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border/30">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Service Fee (3%)</span>
                    <span className="font-semibold">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Complete Purchase */}
                <Button 
                  className="w-full btn-glow mb-4" 
                  size="lg"
                  onClick={handleCompletePurchase}
                  disabled={isProcessing || !agreeToTerms}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Complete Purchase'}
                </Button>
                
                {!agreeToTerms && (
                  <p className="text-xs text-destructive text-center mb-4">
                    Please agree to Terms of Service to continue
                  </p>
                )}

                {/* Trust Badges */}
                <div className="space-y-2 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Secure encrypted payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Instant delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>7-day money back guarantee</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
