import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserProfileLinkProps {
  username: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Helper component to generate user profile links with the @username pattern
 * Usage: <UserProfileLink username="john_doe">@john_doe</UserProfileLink>
 */
const UserProfileLink = ({ username, className, children }: UserProfileLinkProps) => {
  return (
    <Link 
      to={`/@${username}`}
      className={cn("text-primary hover:text-primary/80 transition-colors", className)}
    >
      {children || `@${username}`}
    </Link>
  );
};

export default UserProfileLink;
