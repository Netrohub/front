import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { useAdminList } from '@/hooks/useAdminList';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { LoadingSpinner } from '@/components/admin/LoadingSpinner';
import { EmptyState } from '@/components/admin/EmptyState';

interface Payout {
  id: number;
  seller_id: number;
  seller?: {
    id: number;
    name: string;
    email: string;
  };
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  description: string | null;
  notes: string | null;
  request_date: string;
  process_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

function PayoutsList() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: payouts, isLoading, refetch } = useAdminList<Payout>({
    endpoint: '/payouts',
    initialSearchTerm: '',
  });

  const { update } = useAdminMutation<Payout>({
    endpoint: '/payouts',
    invalidateQueries: ['admin-list', '/payouts'],
  });

  const handleProcessPayout = () => {
    toast.info('Process Payout', {
      description: 'Opening payout processing form...',
    });
  };

  const handleUpdateStatus = async (payoutId: number, status: string) => {
    try {
      await update(payoutId, { status });
      toast.success('Payout updated', {
        description: `Payout status updated to ${status}`,
      });
    } catch (error: any) {
      console.error('Failed to update payout:', error);
      // Error is already handled by the hook
    }
  };

  const handleViewPayout = (payoutId: number) => {
    toast.info('Viewing payout', {
      description: `Opening payout #${payoutId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const searchLower = searchTerm.toLowerCase();
    return (
      payout.seller?.name?.toLowerCase().includes(searchLower) ||
      payout.seller?.email?.toLowerCase().includes(searchLower) ||
      payout.status?.toLowerCase().includes(searchLower) ||
      payout.method?.toLowerCase().includes(searchLower) ||
      payout.reference?.toLowerCase().includes(searchLower)
    );
  });

  const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
  const completedPayouts = payouts.filter(p => p.status === 'completed').length;
  const failedPayouts = payouts.filter(p => p.status === 'failed').length;
  const totalAmount = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payouts</h1>
          <p className="text-muted-foreground">Manage seller payouts and transactions</p>
        </div>
        <Button onClick={handleProcessPayout} disabled={false}>
          {false && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <CreditCard className="w-4 h-4 mr-2" />
          Process Payout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingPayouts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedPayouts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{failedPayouts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search payouts..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Payouts Table */}
      <Card>
        {isLoading ? (
          <LoadingSpinner text="Loading payouts..." />
        ) : filteredPayouts.length === 0 ? (
          <EmptyState 
            icon={CreditCard}
            title="No payouts found"
            description="When sellers request payouts, they'll appear here"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">
                    {payout.seller?.name || `Seller #${payout.seller_id}`}
                  </TableCell>
                  <TableCell>${Number(payout.amount).toFixed(2)}</TableCell>
                  <TableCell>{payout.method || '-'}</TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>
                    {payout.reference ? (
                      <span className="font-mono text-sm">{payout.reference}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(payout.request_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewPayout(payout.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payout.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateStatus(payout.id, 'processing')}
                          disabled={false}
                        >
                          {false && <Loader2 className="w-4 h-4 animate-spin" />}
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default PayoutsList;
