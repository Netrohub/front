import { useState } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisputeCard, Dispute } from "@/components/disputes/DisputeCard";
import { Plus, AlertCircle, Clock, CheckCircle } from "lucide-react";

const DisputeList = () => {
  // Mock disputes data
  const [disputes] = useState<Dispute[]>([
    {
      id: "DIS-001",
      orderId: "ORD-001",
      productName: "Premium Instagram Account",
      productImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
      reason: "Product not as described",
      description: "The account followers are not real as advertised. Engagement rate is very low.",
      status: "open",
      messageCount: 3,
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
      status: "resolved_refund",
      messageCount: 12,
      createdAt: "2 weeks ago",
    },
  ]);

  const getStatusCounts = () => {
    return {
      open: disputes.filter(d => d.status === "open").length,
      in_review: disputes.filter(d => d.status === "in_review" || d.status === "escalated").length,
      resolved: disputes.filter(d => d.status === "resolved_refund" || d.status === "resolved_upheld").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <AccountLayout>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-foreground mb-2">My Disputes</h1>
                <p className="text-foreground/60">Manage and track your order disputes</p>
              </div>
              <Link to="/disputes/create">
                <Button className="btn-glow">
                  <Plus className="h-5 w-5 mr-2" />
                  New Dispute
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-500/10">
                    <AlertCircle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{counts.open}</p>
                    <p className="text-sm text-foreground/60">Open Disputes</p>
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
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="glass-card border border-border/30">
                <TabsTrigger value="all">All ({disputes.length})</TabsTrigger>
                <TabsTrigger value="open">Open ({counts.open})</TabsTrigger>
                <TabsTrigger value="in_review">In Review ({counts.in_review})</TabsTrigger>
                <TabsTrigger value="resolved">Resolved ({counts.resolved})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {disputes.map((dispute) => (
                  <DisputeCard key={dispute.id} dispute={dispute} />
                ))}
              </TabsContent>

              <TabsContent value="open" className="space-y-4">
                {disputes
                  .filter(d => d.status === "open")
                  .map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
              </TabsContent>

              <TabsContent value="in_review" className="space-y-4">
                {disputes
                  .filter(d => d.status === "in_review" || d.status === "escalated")
                  .map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {disputes
                  .filter(d => d.status === "resolved_refund" || d.status === "resolved_upheld")
                  .map((dispute) => (
                    <DisputeCard key={dispute.id} dispute={dispute} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
    </AccountLayout>
  );
};

export default DisputeList;
