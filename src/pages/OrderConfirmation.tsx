import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ConditionalStarfield } from "@/components/ConditionalStarfield";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Package, CreditCard, Mail, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const OrderConfirmation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // ✅ FIXED: Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderId = searchParams.get('order_id');
        
        // First try to get from URL parameter
        if (orderId) {
          const order = await apiClient.request<any>(`/orders/${orderId}`);
          setOrderDetails({
            id: order.id,
            order_number: order.order_number,
            status: order.status,
            total: order.total_amount,
            items: order.items || [],
            paymentMethod: order.payment_method || 'Credit Card',
            orderDate: order.created_at,
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });
        } else {
          // Fallback to localStorage for just-completed orders
          const orderData = localStorage.getItem('last_order');
          if (orderData) {
            setOrderDetails(JSON.parse(orderData));
          } else {
            // No order found, redirect to orders page
            toast({
              title: "No order found",
              description: "Redirecting to your orders...",
              variant: "destructive",
            });
            setTimeout(() => navigate('/dashboard?tab=orders'), 2000);
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch order details:', error);
        toast({
          title: "Error loading order",
          description: error.message || "Failed to load order details",
          variant: "destructive",
        });
        // Try localStorage as fallback
        const orderData = localStorage.getItem('last_order');
        if (orderData) {
          setOrderDetails(JSON.parse(orderData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate, toast]);

  if (loading || !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
        <ConditionalStarfield />
        <Navbar />
        <main className="flex-1 relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Loading order details...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative pb-20 md:pb-0">
      <ConditionalStarfield />
      <Navbar />
      
      <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-foreground/60 text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Order ID</span>
                    <span className="font-semibold text-foreground">#{orderDetails.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {orderDetails.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Total Amount</span>
                    <span className="font-bold text-foreground">${orderDetails.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Payment Method</span>
                    <span className="text-foreground">{orderDetails.paymentMethod}</span>
                  </div>
                </div>
              </Card>

              {/* Order Items */}
              <Card className="glass-card p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/20 last:border-b-0">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  What's Next?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Order Processing</p>
                      <p className="text-sm text-foreground/60">We're preparing your digital products for delivery.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email Delivery</p>
                      <p className="text-sm text-foreground/60">You'll receive your account details via email within 24 hours.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Account Access</p>
                      <p className="text-sm text-foreground/60">Use the provided credentials to access your new accounts.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Support */}
              <Card className="glass-card p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Need Help?</h3>
                <p className="text-foreground/70 mb-4">
                  If you have any questions about your order, our support team is here to help.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full glass-card border-primary/30"
                    onClick={() => navigate('/disputes/create')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full glass-card border-primary/30"
                    onClick={() => navigate('/account/orders')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="glass-card border-primary/30"
              variant="outline"
            >
              Continue Shopping
            </Button>
            <Button 
              onClick={() => navigate('/account/orders')}
              className="bg-primary hover:bg-primary/90"
            >
              View Order Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
