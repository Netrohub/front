import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { safeRender } from "@/lib/display";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar,
  Download,
  MessageCircle,
  Star,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

// TODO: Replace with actual API call

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        navigate('/account/orders');
        return;
      }

      try {
        setLoading(true);
        // TODO: Implement actual API call
        // const response = await fetch(`/api/orders/${id}`);
        // const data = await response.json();
        // setOrder(data);
        setOrder(null); // No data for now
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/60">Loading order details...</p>
          </div>
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    navigate('/account/orders');
    return null;
  }

  // Order data is now fetched from API

  const getStatusIcon = () => {
    switch (order.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      completed: "default",
      pending: "secondary",
      processing: "default",
      cancelled: "destructive"
    } as const;

    return (
      <Badge variant={variants[order.status as keyof typeof variants] || "secondary"} className="ml-2">
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </Badge>
    );
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-2 -ml-4">
              <Link to="/account/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Order {order.id}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-foreground/60 mt-1">
              Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-card border-border/50">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
            <Button variant="outline" className="glass-card border-border/50">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>

        {/* Order Status Timeline */}
        {order.status === "completed" && (
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Delivered</h3>
                  <p className="text-sm text-foreground/60">Order completed successfully</p>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <Button asChild className="btn-glow">
                  <Link to={`/products/${order.items[0].id}`}>
                    <Star className="h-4 w-4 mr-2" />
                    Leave Review
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Order Items */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-foreground/60">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold gradient-text">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Product Information for Completed Orders */}
          {order.status === "completed" && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-lg font-bold text-foreground mb-4">Product Information</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-3">{item.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1">Email</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            value=""
                            readOnly
                            className="flex-1 px-3 py-2 rounded-lg glass-card border-border/50 bg-muted/50 text-sm"
                          />
                          <Button size="sm" variant="outline" className="glass-card border-border/50">
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/70 mb-1">Password</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="password" 
                            value={`SecurePass${item.id}123!`}
                            readOnly
                            className="flex-1 px-3 py-2 rounded-lg glass-card border-border/50 bg-muted/50 text-sm"
                          />
                          <Button size="sm" variant="outline" className="glass-card border-border/50">
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Please change the password immediately after accessing the account. 
                        Keep this information secure and do not share it with others.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-6 pt-6 border-t border-border/50 space-y-2">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-foreground pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="gradient-text">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Shipping Address</h3>
            </div>
            <div className="space-y-1 text-foreground/70">
              <p className="font-medium text-foreground">{safeRender(order.shipping?.name || order.shipping?.name || 'N/A')}</p>
              <p>{safeRender(order.shipping?.address || 'N/A')}</p>
              <p>{safeRender(order.shipping?.city || 'N/A')}, {safeRender(order.shipping?.zip || '')}</p>
              <p>{safeRender(order.shipping?.country || 'N/A')}</p>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Payment Method</h3>
            </div>
            <div className="space-y-1 text-foreground/70">
              <p className="font-medium text-foreground">{safeRender(order.payment?.method || 'N/A')}</p>
              <p>Ending in {safeRender(order.payment?.last4 || 'N/A')}</p>
            </div>
          </Card>

          {/* Tracking */}
          {order.tracking && (
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Tracking Number</h3>
              </div>
              <div className="space-y-3">
                <p className="font-mono text-foreground">{order.tracking}</p>
                <Button variant="outline" className="w-full glass-card border-border/50">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              </div>
            </Card>
          )}

          {/* Seller Info */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">Seller</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-foreground">{safeRender(order.seller?.name || 'Unknown Seller')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-foreground/70">
                    {typeof order.seller?.rating === 'number' ? order.seller.rating : '0'} ({typeof order.seller?.reviews === 'number' ? order.seller.reviews.toLocaleString() : '0'} reviews)
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full glass-card border-border/50">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AccountLayout>
  );
};

export default OrderDetail;

