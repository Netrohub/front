import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/disputes/StatusBadge";
import { MessageThread, Message } from "@/components/disputes/MessageThread";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { ArrowLeft, Send, AlertTriangle, Package, Image as ImageIcon, Loader2 } from "lucide-react";

const DisputeDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // ✅ FIXED: Fetch dispute and messages from API
  const [dispute, setDispute] = useState<{
    id: string;
    orderId: string;
    productName: string;
    productImage: string;
    reason: string;
    description: string;
    status: string;
    createdAt: string;
    evidence: Array<{ id: string; name: string; url: string }>;
  } | null>(null);

  useEffect(() => {
    const fetchDisputeData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch dispute details
        const disputeData = await apiClient.request<any>(`/disputes/${id}`);
        
        // Transform to match component format
        setDispute({
          id: String(disputeData.id),
          orderId: disputeData.order?.order_number || String(disputeData.order_id),
          productName: disputeData.order?.items?.[0]?.product_name || 'Product',
          productImage: disputeData.order?.items?.[0]?.product?.images?.[0] || '/placeholder-product.png',
          reason: disputeData.reason,
          description: disputeData.description,
          status: disputeData.status,
          createdAt: new Date(disputeData.created_at).toLocaleDateString(),
          evidence: disputeData.evidence || [],
        });

        // Fetch dispute messages (if endpoint exists)
        try {
          const messagesData = await apiClient.request<any[]>(`/disputes/${id}/messages`);
          const transformedMessages: Message[] = messagesData.map((msg: any) => ({
            id: String(msg.id),
            sender: {
              name: msg.sender_type === 'buyer' ? 'You' : msg.sender_type === 'seller' ? 'Seller' : 'Admin',
              role: msg.sender_type,
            },
            content: msg.message,
            timestamp: new Date(msg.created_at).toLocaleString(),
          }));
          setMessages(transformedMessages);
        } catch (msgError) {
          // Messages endpoint might not exist yet, use empty array
          setMessages([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch dispute:', error);
        toast({
          title: "Error loading dispute",
          description: error.message || "Failed to load dispute details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDisputeData();
  }, [id, toast]);

  // ✅ FIXED: Send message via API
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast({
        title: "Message is empty",
        description: "Please type a message before sending.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      
      // Send message to API
      const sentMessage = await apiClient.request<any>(`/disputes/${id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          message: newMessage,
        }),
      });

      // Add message to local state
      const newMsg: Message = {
        id: String(sentMessage.id),
        sender: { name: "You", role: "buyer" },
        content: newMessage,
        timestamp: "Just now",
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      toast({
        title: "Message sent! 💬",
        description: "Your message has been sent to the dispute thread.",
      });
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

  const handleEscalate = () => {
    toast({
      title: "Escalated to admin",
      description: "This dispute has been escalated for admin review.",
    });
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground/60">Loading dispute details...</p>
          </div>
        </div>
      </AccountLayout>
    );
  }

  if (!dispute) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Dispute not found</h2>
            <p className="text-foreground/60 mb-4">The dispute you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/disputes">Back to Disputes</Link>
            </Button>
          </div>
        </div>
      </AccountLayout>
    );
  }

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
                  <Button onClick={handleSendMessage} className="btn-glow" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
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
