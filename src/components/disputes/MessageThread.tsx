import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield } from "lucide-react";

export interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    role: "buyer" | "seller" | "admin";
  };
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

interface MessageThreadProps {
  messages: Message[];
}

export const MessageThread = ({ messages }: MessageThreadProps) => {
  const getRoleColor = (role: Message["sender"]["role"]) => {
    switch (role) {
      case "admin":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "seller":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={`glass-card p-4 ${
            message.isInternal ? "border-orange-500/30 bg-orange-500/5" : ""
          }`}
        >
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {message.sender.avatar ? (
                <AvatarImage src={message.sender.avatar} />
              ) : (
                <AvatarFallback>
                  {message.sender.role === "admin" ? (
                    <Shield className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">
                  {message.sender.name}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getRoleColor(message.sender.role)}`}
                >
                  {message.sender.role.charAt(0).toUpperCase() + message.sender.role.slice(1)}
                </Badge>
                {message.isInternal && (
                  <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                    Internal Note
                  </Badge>
                )}
                <span className="text-xs text-foreground/40 ml-auto">
                  {message.timestamp}
                </span>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
