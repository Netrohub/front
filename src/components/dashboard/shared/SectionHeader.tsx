import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
  };
}

const SectionHeader = ({ title, description, icon: Icon, action }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-6 w-6 text-primary" />}
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-foreground/60 mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button 
          asChild 
          variant={action.variant || "outline"}
          size="sm"
        >
          <Link to={action.href}>
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
