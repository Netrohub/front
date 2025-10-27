import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
  };
  showBackground?: boolean;
}

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  showBackground = true 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className={`mb-6 ${showBackground ? "p-4 rounded-full bg-primary/10" : ""}`}>
        <Icon className={`text-primary ${showBackground ? "h-12 w-12" : "h-16 w-16"}`} />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-foreground/60 mb-6 max-w-md">{description}</p>
      {action && (
        <Button 
          asChild 
          variant={action.variant || "default"}
        >
          <Link to={action.href}>
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
