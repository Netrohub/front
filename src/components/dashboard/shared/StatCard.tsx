import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
  variant?: "default" | "compact";
}

const StatCard = ({ label, value, change, icon: Icon, color, variant = "default" }: StatCardProps) => {
  return (
    <Card className={`glass-card relative overflow-hidden group hover:scale-105 transition-all ${variant === "compact" ? "p-4" : "p-6"}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {change && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
              {change}
            </Badge>
          )}
        </div>
        <p className={`font-black text-foreground mb-1 ${variant === "compact" ? "text-xl" : "text-2xl"}`}>
          {value}
        </p>
        <p className={`text-foreground/60 ${variant === "compact" ? "text-xs" : "text-sm"}`}>
          {label}
        </p>
      </div>
    </Card>
  );
};

export default StatCard;
