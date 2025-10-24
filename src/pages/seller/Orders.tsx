import SellerLayout from "@/components/SellerLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Package,
  CheckCircle2,
  Clock,
  MessageSquare,
  Eye
} from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    product: "Steam Account - 200+ Games",
    buyer: "User#1234",
    amount: 449.99,
    status: "pending_delivery",
    date: "2024-01-20",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
  },
  {
    id: "ORD-002",
    product: "Instagram Account - 50K",
    buyer: "User#5678",
    amount: 299.99,
    status: "completed",
    date: "2024-01-19",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
  },
  {
    id: "ORD-003",
    product: "PlayStation Plus Premium",
    buyer: "User#9012",
    amount: 349.99,
    status: "completed",
    date: "2024-01-18",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
  },
  {
    id: "ORD-004",
    product: "Epic Games Account",
    buyer: "User#3456",
    amount: 799.99,
    status: "pending_delivery",
    date: "2024-01-17",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending_delivery":
      return (
        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending Delivery
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

const SellerOrders = () => {
  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Orders
            </h1>
            <p className="text-foreground/60">Manage your customer orders</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glass-card p-6">
            <p className="text-sm text-foreground/60 mb-1">Pending</p>
            <p className="text-3xl font-black text-yellow-500">2</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-foreground/60 mb-1">Completed</p>
            <p className="text-3xl font-black text-primary">156</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-foreground/60 mb-1">This Month</p>
            <p className="text-3xl font-black text-foreground">24</p>
          </Card>
          <Card className="glass-card p-6">
            <p className="text-sm text-foreground/60 mb-1">Revenue</p>
            <p className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              $12.4K
            </p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="glass-card p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
              <Input
                placeholder="Search orders..."
                className="pl-10 glass-card border-border/50"
              />
            </div>
            <Button variant="outline" className="glass-card border-border/50">
              All Orders
            </Button>
            <Button variant="outline" className="glass-card border-border/50">
              Pending
            </Button>
            <Button variant="outline" className="glass-card border-border/50">
              Completed
            </Button>
          </div>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="glass-card p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={order.image}
                    alt={order.product}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">
                          {order.product}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-foreground/60 mb-1">
                        Order #{order.id} • Buyer: {order.buyer}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Order Date: {order.date}
                      </p>
                    </div>
                    <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                      ${order.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {order.status === "pending_delivery" && (
                      <Button size="sm" className="btn-glow">
                        <Package className="h-4 w-4 mr-2" />
                        Deliver Order
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="glass-card border-border/50">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="glass-card border-border/50">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Buyer
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerOrders;
