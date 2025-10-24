import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, DisputeStatus } from "./StatusBadge";
import { MessageSquare, Package, Calendar } from "lucide-react";

export interface Dispute {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  messageCount: number;
  createdAt: string;
}

interface DisputeCardProps {
  dispute: Dispute;
}

export const DisputeCard = ({ dispute }: DisputeCardProps) => {
  return (
    <Card className="glass-card p-6 hover:border-primary/40 transition-all">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={dispute.productImage}
            alt={dispute.productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dispute Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground">{dispute.reason}</h3>
              <p className="text-sm text-foreground/60 line-clamp-2">
                {dispute.description}
              </p>
            </div>
            <StatusBadge status={dispute.status} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Order #{dispute.orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{dispute.messageCount} messages</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{dispute.createdAt}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/disputes/${dispute.id}`}>
              <Button size="sm" variant="outline" className="glass-card border-primary/30">
                View Details
              </Button>
            </Link>
            <Link to={`/account/orders/${dispute.orderId}`}>
              <Button size="sm" variant="ghost">
                View Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
