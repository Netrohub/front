import { useParams, Link, useNavigate } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Mock orders database - same as Orders.tsx
const ordersDatabase = [
  {
    id: "ORD-001",
    product: "Steam Account - 200+ Games Library",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    seller: "ProGamer_Elite",
    price: 449.99,
    status: "completed",
    date: "2024-01-20",
    deliveryDate: "2024-01-20",
  },
  {
    id: "ORD-002",
    product: "Instagram Account - 50K Followers",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
    seller: "SocialKing",
    price: 299.99,
    status: "pending",
    date: "2024-01-19",
    deliveryDate: null,
  },
  {
    id: "ORD-003",
    product: "PlayStation Plus Premium - 2 Years",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    seller: "GameMaster_X",
    price: 349.99,
    status: "completed",
    date: "2024-01-18",
    deliveryDate: "2024-01-18",
  },
  {
    id: "ORD-004",
    product: "Epic Games - Fortnite Rare Skins",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    seller: "AccountKing",
    price: 799.99,
    status: "cancelled",
    date: "2024-01-15",
    deliveryDate: null,
  },
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the specific order by ID
  const orderData = ordersDatabase.find(o => o.id === id);

  // If order not found, redirect to orders page
  if (!orderData) {
    navigate('/account/orders');
    return null;
  }

  // Build detailed order object from found data
  const order = {
    id: orderData.id,
    status: orderData.status,
    date: orderData.date,
    total: orderData.price,
    items: [
      {
        id: 1,
        name: orderData.product,
        price: orderData.price,
        quantity: 1,
        image: orderData.image,
      }
    ],
    shipping: {
      name: "John Doe",
      address: "123 Main St, Apt 4B",
      city: "New York",
      zip: "10001",
      country: "United States"
    },
    payment: {
      method: "Credit Card",
      last4: "4242"
    },
    tracking: orderData.deliveryDate ? `1Z999AA10${orderData.id.replace('ORD-', '')}` : null,
    seller: {
      name: orderData.seller,
      rating: 4.8,
      reviews: 1234
    }
  };

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
              <Button asChild className="btn-glow">
                <Link to={`/products/${order.items[0].id}`}>
                  <Star className="h-4 w-4 mr-2" />
                  Leave Review
                </Link>
              </Button>
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
                            value={`account${item.id}@example.com`}
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
              <p className="font-medium text-foreground">{order.shipping.name}</p>
              <p>{order.shipping.address}</p>
              <p>{order.shipping.city}, {order.shipping.zip}</p>
              <p>{order.shipping.country}</p>
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
              <p className="font-medium text-foreground">{order.payment.method}</p>
              <p>Ending in {order.payment.last4}</p>
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
                <p className="font-medium text-foreground">{order.seller.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-foreground/70">
                    {order.seller.rating} ({order.seller.reviews.toLocaleString()} reviews)
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

