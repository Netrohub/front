import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "@/components/AccountLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisputeCard, Dispute } from "@/components/disputes/DisputeCard";
import { Plus, AlertCircle, Clock, CheckCircle } from "lucide-react";

const DisputeList = () => {
  // TODO: Replace with actual API call
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch disputes from API
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setLoading(true);
        // TODO: Implement actual API call
        // const response = await fetch('/api/disputes');
        // const data = await response.json();
        // setDisputes(data);
        setDisputes([]); // Empty array for now
      } catch (error) {
        console.error('Failed to fetch disputes:', error);
        setDisputes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

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
