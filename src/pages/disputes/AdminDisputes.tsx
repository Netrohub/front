import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisputeCard, Dispute } from "@/components/disputes/DisputeCard";
import { AlertTriangle, Clock, CheckCircle, Users } from "lucide-react";

const AdminDisputes = () => {
  // Mock disputes data
  const [disputes] = useState<Dispute[]>([
    {
      id: "DIS-001",
      orderId: "ORD-001",
      productName: "Premium Instagram Account",
      productImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
      reason: "Product not as described",
      description: "The account followers are not real as advertised. Engagement rate is very low.",
      status: "escalated",
      messageCount: 5,
      createdAt: "2 days ago",
    },
    {
      id: "DIS-002",
      orderId: "ORD-002",
      productName: "Gaming Account - Level 80",
      productImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&q=80",
      reason: "Account not working",
      description: "Cannot login to the account. Credentials provided are incorrect.",
      status: "in_review",
      messageCount: 7,
      createdAt: "5 days ago",
    },
    {
      id: "DIS-003",
      orderId: "ORD-003",
      productName: "TikTok Account - 100K",
      productImage: "https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=200&q=80",
      reason: "Missing account details",
      description: "Original email access was not provided as promised.",
      status: "open",
      messageCount: 3,
      createdAt: "1 week ago",
    },
    {
      id: "DIS-004",
      orderId: "ORD-004",
      productName: "YouTube Channel - 50K Subs",
      productImage: "https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=200&q=80",
      reason: "Fraud or scam",
      description: "Seller disappeared after payment. No account details provided.",
      status: "escalated",
      messageCount: 10,
      createdAt: "3 days ago",
    },
  ]);

  const getStatusCounts = () => {
    return {
      total: disputes.length,
      escalated: disputes.filter(d => d.status === "escalated").length,
      in_review: disputes.filter(d => d.status === "in_review").length,
      resolved: disputes.filter(d => d.status === "resolved_refund" || d.status === "resolved_upheld").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-black text-foreground mb-2">
                Admin Dispute Management
              </h1>
              <p className="text-foreground/60">
                Review and manage all disputes across the platform
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{counts.total}</p>
                    <p className="text-sm text-foreground/60">Total Disputes</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6 border-orange-500/30 bg-orange-500/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{counts.escalated}</p>
                    <p className="text-sm text-foreground/60">Escalated</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{counts.in_review}</p>
                    <p className="text-sm text-foreground/60">In Review</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{counts.resolved}</p>
                    <p className="text-sm text-foreground/60">Resolved</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Disputes List with Filters */}
            <Tabs defaultValue="escalated" className="space-y-6">
              <TabsList className="glass-card border border-border/30">
                <TabsTrigger value="escalated">
                  Escalated ({counts.escalated})
                </TabsTrigger>
                <TabsTrigger value="in_review">
                  In Review ({counts.in_review})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({counts.total})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="escalated" className="space-y-4">
                {disputes
                  .filter(d => d.status === "escalated")
                  .map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
                {disputes.filter(d => d.status === "escalated").length === 0 && (
                  <Card className="glass-card p-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/60">No escalated disputes</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="in_review" className="space-y-4">
                {disputes
                  .filter(d => d.status === "in_review")
                  .map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
                {disputes.filter(d => d.status === "in_review").length === 0 && (
                  <Card className="glass-card p-12 text-center">
                    <Clock className="h-12 w-12 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/60">No disputes in review</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {disputes.map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDisputes;
