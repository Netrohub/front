import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [processDialog, setProcessDialog] = useState<{
    open: boolean;
    payoutId: number | null;
    amount: string;
    method: string;
    reference: string;
    description: string;
  }>({
    open: false,
    payoutId: null,
    amount: '',
    method: '',
    reference: '',
    description: '',
  });
  
  const { data: payouts, isLoading, refetch } = useAdminList<Payout>({
    endpoint: '/payouts',
    initialSearchTerm: '',
  });

  const handleProcessPayout = (payoutId: number) => {
    const payout = payouts?.find(p => p.id === payoutId);
    if (payout) {
      setProcessDialog({
        open: true,
        payoutId,
        amount: String(payout.amount || ''),
        method: payout.method || '',
        reference: payout.reference || '',
        description: payout.description || '',
      });
    }
  };

  const confirmProcessPayout = async () => {
    if (processDialog.payoutId) {
      try {
        // Use correct endpoint: PUT /admin/payouts/:id/status
        await apiClient.request(`/admin/payouts/${processDialog.payoutId}/status`, {
          method: 'PUT',
          body: JSON.stringify({
            status: 'PROCESSING',
            method: processDialog.method,
            reference: processDialog.reference,
            description: processDialog.description,
          }),
        });
        toast.success('Payout Processing Started', {
          description: 'Payout processing has been initiated.',
        });
        refetch();
        setProcessDialog({ open: false, payoutId: null, amount: '', method: '', reference: '', description: '' });
      } catch (error: any) {
        console.error('Failed to process payout:', error);
        toast.error('Failed to process payout', {
          description: error.message || 'An error occurred while processing payout.',
        });
      }
    }
  };

  const handleUpdateStatus = async (payoutId: number, status: string) => {
    try {
      // Use correct endpoint: PUT /admin/payouts/:id/status
      await apiClient.request(`/admin/payouts/${payoutId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast.success('Payout updated', {
        description: `Payout status updated to ${status}`,
      });
      refetch();
    } catch (error: any) {
      console.error('Failed to update payout:', error);
      toast.error('Failed to update payout', {
        description: error.message || 'An error occurred while updating payout.',
      });
    }
  };

  const handleViewPayout = (payoutId: number) => {
    navigate(`/admin/payouts/${payoutId}`);
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
                          onClick={() => handleProcessPayout(payout.id)}
                        >
                          <CreditCard className="w-4 h-4" />
                        </Button>
                      )}
                      {payout.status === 'processing' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateStatus(payout.id, 'COMPLETED')}
                        >
                          <CheckCircle className="w-4 h-4" />
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

      {/* Process Payout Dialog */}
      <Dialog open={processDialog.open} onOpenChange={(open) => !open && setProcessDialog({ open: false, payoutId: null, amount: '', method: '', reference: '', description: '' })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
            <DialogDescription>
              Enter payout details to process this payout request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={processDialog.amount}
                  onChange={(e) => setProcessDialog(prev => ({ ...prev, amount: e.target.value }))}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select
                  value={processDialog.method}
                  onValueChange={(value) => setProcessDialog(prev => ({ ...prev, method: value }))}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Transaction Reference</Label>
              <Input
                id="reference"
                placeholder="Enter transaction reference or tracking number"
                value={processDialog.reference}
                onChange={(e) => setProcessDialog(prev => ({ ...prev, reference: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add any notes or additional information"
                value={processDialog.description}
                onChange={(e) => setProcessDialog(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessDialog({ open: false, payoutId: null, amount: '', method: '', reference: '', description: '' })}>
              Cancel
            </Button>
            <Button onClick={confirmProcessPayout} disabled={!processDialog.method || !processDialog.reference}>
              Process Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayoutsList;
