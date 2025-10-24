import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Starfield from "@/components/Starfield";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Package,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock disputes data
const mockDisputes = [
  {
    id: 1,
    orderId: "ORD-12345",
    customer: "John Doe",
    seller: "ProGamer_Elite",
    reason: "Product not as described",
    status: "open",
    priority: "high",
    createdAt: "2024-01-20",
    amount: 449.99,
  },
  {
    id: 2,
    orderId: "ORD-12346",
    customer: "Jane Smith",
    seller: "SocialKing",
    reason: "Product not received",
    status: "in_review",
    priority: "medium",
    createdAt: "2024-01-19",
    amount: 299.99,
  },
  {
    id: 3,
    orderId: "ORD-12347",
    customer: "Mike Johnson",
    seller: "GamingPro",
    reason: "Account credentials invalid",
    status: "open",
    priority: "critical",
    createdAt: "2024-01-18",
    amount: 599.99,
  },
];

const AdminDisputes = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const getStatusBadge = (status: string) => {
    const styles = {
      open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      resolved: "bg-green-500/10 text-green-500 border-green-500/20",
      declined: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return styles[status as keyof typeof styles] || styles.open;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      critical: "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse",
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />;
      case "in_review":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredDisputes = mockDisputes.filter((dispute) => {
    const matchesSearch =
      dispute.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || dispute.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || dispute.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: mockDisputes.length,
    open: mockDisputes.filter((d) => d.status === "open").length,
    in_review: mockDisputes.filter((d) => d.status === "in_review").length,
    resolved: mockDisputes.filter((d) => d.status === "resolved").length,
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Starfield />
      <Navbar />

      <main className="flex-1 relative z-10 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {t('adminDisputes') || 'Admin Disputes Management'}
                </h1>
                <p className="text-foreground/60">
                  {t('manageAllDisputes') || 'Manage and resolve customer disputes'}
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-2">
                {filteredDisputes.length} {t('disputes') || 'Disputes'}
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{t('totalDisputes') || 'Total'}</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-primary/50" />
              </div>
            </Card>
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{t('open') || 'Open'}</p>
                  <p className="text-3xl font-bold text-blue-500">{stats.open}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-blue-500/50" />
              </div>
            </Card>
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{t('inReview') || 'In Review'}</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.in_review}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-500/50" />
              </div>
            </Card>
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">{t('resolved') || 'Resolved'}</p>
                  <p className="text-3xl font-bold text-green-500">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500/50" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-card p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                <Input
                  placeholder={t('searchDisputes') || 'Search by order, customer, or seller...'}
                  className="pl-10 glass-card border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="glass-card border-border/50">
                  <SelectValue placeholder={t('filterByStatus') || 'Filter by status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses') || 'All Statuses'}</SelectItem>
                  <SelectItem value="open">{t('open') || 'Open'}</SelectItem>
                  <SelectItem value="in_review">{t('inReview') || 'In Review'}</SelectItem>
                  <SelectItem value="resolved">{t('resolved') || 'Resolved'}</SelectItem>
                  <SelectItem value="declined">{t('declined') || 'Declined'}</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="glass-card border-border/50">
                  <SelectValue placeholder={t('filterByPriority') || 'Filter by priority'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allPriorities') || 'All Priorities'}</SelectItem>
                  <SelectItem value="low">{t('low') || 'Low'}</SelectItem>
                  <SelectItem value="medium">{t('medium') || 'Medium'}</SelectItem>
                  <SelectItem value="high">{t('high') || 'High'}</SelectItem>
                  <SelectItem value="critical">{t('critical') || 'Critical'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Disputes Table */}
          <Card className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('disputeId') || 'Dispute ID'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('orderInfo') || 'Order Info'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('parties') || 'Parties'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('reason') || 'Reason'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('priority') || 'Priority'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('status') || 'Status'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('amount') || 'Amount'}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      {t('actions') || 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map((dispute) => (
                    <tr key={dispute.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm font-semibold">#{dispute.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-foreground/50" />
                          <div>
                            <p className="font-semibold text-sm">{dispute.orderId}</p>
                            <p className="text-xs text-foreground/50 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {dispute.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="font-medium">{dispute.customer}</span>
                          </p>
                          <p className="text-xs text-foreground/50">vs {dispute.seller}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground/70 max-w-xs truncate">{dispute.reason}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getPriorityBadge(dispute.priority)}>
                          {dispute.priority.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusBadge(dispute.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(dispute.status)}
                            {dispute.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary">${dispute.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Button asChild size="sm" variant="outline" className="glass-card">
                          <Link to={`/disputes/${dispute.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            {t('view') || 'View'}
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDisputes.length === 0 && (
              <div className="p-12 text-center">
                <AlertTriangle className="h-16 w-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-lg text-foreground/60">
                  {t('noDisputesFound') || 'No disputes found matching your filters'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDisputes;

