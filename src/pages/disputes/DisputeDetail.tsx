import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/disputes/StatusBadge";
import { MessageThread, Message } from "@/components/disputes/MessageThread";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, AlertTriangle, Package, Image as ImageIcon } from "lucide-react";

const DisputeDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(`dispute_messages_${id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Default messages for new disputes
      const defaultMessages: Message[] = [
        {
          id: "1",
          sender: { name: "You", role: "buyer" },
          content: "I purchased this account yesterday but the engagement rate is much lower than advertised. Can you please check?",
          timestamp: "2 days ago",
        },
        {
          id: "2",
          sender: { name: "Digital Elite", role: "seller" },
          content: "Hello, thank you for reaching out. Can you please provide more details about the engagement issues you're experiencing?",
          timestamp: "1 day ago",
        },
        {
          id: "3",
          sender: { name: "You", role: "buyer" },
          content: "I've attached screenshots showing the analytics. The engagement is around 2-3% but your listing stated 8-12%.",
          timestamp: "1 day ago",
        },
      ];
      setMessages(defaultMessages);
      localStorage.setItem(`dispute_messages_${id}`, JSON.stringify(defaultMessages));
    }
  }, [id]);

  // Mock dispute data
  const dispute = {
    id: id || "DIS-001",
    orderId: "ORD-001",
    productName: "Premium Instagram Account",
    productImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
    reason: "Product not as described",
    description: "The account followers are not real as advertised. Engagement rate is very low compared to what was promised in the listing.",
    status: "open" as const,
    createdAt: "2 days ago",
    evidence: [
      { id: "1", name: "screenshot1.png", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" },
      { id: "2", name: "screenshot2.png", url: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80" },
    ],
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Message is empty",
        description: "Please type a message before sending.",
        variant: "destructive",
      });
      return;
    }

    // Add message to thread
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: { name: "You", role: "buyer" },
      content: newMessage,
      timestamp: "Just now",
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessage("");
    
    // Save to localStorage
    localStorage.setItem(`dispute_messages_${id}`, JSON.stringify(updatedMessages));
    
    toast({
      title: "Message sent! 💬",
      description: "Your message has been sent to the dispute thread.",
    });
  };

  const handleEscalate = () => {
    toast({
      title: "Escalated to admin",
      description: "This dispute has been escalated for admin review.",
    });
  };

  return (
    <AccountLayout>
          <div className="space-y-6">
            {/* Back Button */}
            <Link to="/disputes">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Disputes
              </Button>
            </Link>

            {/* Header */}
            <Card className="glass-card p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={dispute.productImage}
                    alt={dispute.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-black text-foreground mb-2">
                        {dispute.reason}
                      </h1>
                      <p className="text-foreground/60">
                        Dispute #{dispute.id} • Created {dispute.createdAt}
                      </p>
                    </div>
                    <StatusBadge status={dispute.status} />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-foreground/60" />
                    <span className="text-foreground/60">Order #{dispute.orderId}</span>
                    <span className="text-foreground/40">•</span>
                    <span className="text-foreground/60">{dispute.productName}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-3">Description</h2>
              <p className="text-foreground/70 leading-relaxed">{dispute.description}</p>
            </Card>

            {/* Evidence */}
            {dispute.evidence.length > 0 && (
              <Card className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Evidence ({dispute.evidence.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {dispute.evidence.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card className="glass-card p-2 overflow-hidden hover:border-primary/40 transition-all">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <p className="text-xs text-foreground/60 mt-2 truncate">
                          {item.name}
                        </p>
                      </Card>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Messages */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Messages</h2>
              <MessageThread messages={messages} />
            </Card>

            {/* Reply */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Add Message</h2>
              <div className="space-y-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="glass-card border-border/50 min-h-[100px]"
                />
                <div className="flex gap-3">
                  <Button onClick={handleSendMessage} className="btn-glow">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    className="glass-card border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    onClick={handleEscalate}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate to Admin
                  </Button>
                </div>
              </div>
            </Card>
          </div>
    </AccountLayout>
  );
};

export default DisputeDetail;
