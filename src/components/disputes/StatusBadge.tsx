import { Badge } from "@/components/ui/badge";

export type DisputeStatus = 
  | "open" 
  | "in_review" 
  | "escalated" 
  | "resolved_refund" 
  | "resolved_upheld";

interface StatusBadgeProps {
  status: DisputeStatus;
}

const statusConfig: Record<DisputeStatus, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  in_review: {
    label: "In Review",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  escalated: {
    label: "Escalated",
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  resolved_refund: {
    label: "Resolved - Refunded",
    className: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  resolved_upheld: {
    label: "Resolved - Upheld",
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
