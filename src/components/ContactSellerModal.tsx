import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Loader2, MessageCircle } from "lucide-react";

interface ContactSellerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerId: number;
  sellerName: string;
  productId?: number;
  productName?: string;
}

export const ContactSellerModal = ({
  open,
  onOpenChange,
  sellerId,
  sellerName,
  productId,
  productName,
}: ContactSellerModalProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState(productName ? `Inquiry about ${productName}` : "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please provide both a subject and message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);

      // Send message via API (using support ticket endpoint or messages endpoint)
      await apiClient.request('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject,
          message: `To Seller ${sellerName} (ID: ${sellerId})${productId ? `\nProduct: ${productName} (ID: ${productId})` : ''}\n\n${message}`,
          category: 'seller_inquiry',
        }),
      });

      toast({
        title: "Message sent! ✉️",
        description: `Your message has been sent to ${sellerName}.`,
      });

      // Reset form and close modal
      setSubject("");
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Contact {sellerName}
          </DialogTitle>
          <DialogDescription>
            Send a message to the seller. They'll receive it and can respond directly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="What's your message about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="glass-card border-border/50"
              disabled={sending}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-card border-border/50 min-h-[150px]"
              disabled={sending}
            />
            <p className="text-xs text-foreground/60">
              Be respectful and provide clear details about your inquiry.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending} className="btn-glow">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

