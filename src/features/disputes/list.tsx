import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { safeFormatDate } from '@/utils/dateHelpers';
import { AlertTriangle, User, CheckCircle, MessageSquare } from 'lucide-react';
import { useAdminList } from '@/hooks/useAdminList';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { apiClient } from '@/lib/api';

interface Dispute {
  id: number;
  order_id: number;
  type: 'refund' | 'quality' | 'delivery' | 'other';
  state: 'open' | 'in_review' | 'resolved';
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  amount: number;
  created_at: string;
  updated_at: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  username: string;
}

function DisputesList() {
  const navigate = useNavigate();
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    disputeId: number | null;
    selectedAdminId: number | null;
  }>({ open: false, disputeId: null, selectedAdminId: null });
  const [resolveDialog, setResolveDialog] = useState<{
    open: boolean;
    disputeId: number | null;
    resolution: string;
  }>({ open: false, disputeId: null, resolution: '' });

  const { data, isLoading, refetch } = useAdminList<Dispute>({
    endpoint: '/disputes',
    initialSearchTerm: '',
  });

  // Fetch admin users for assignment
  const { data: adminUsersData } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: async () => {
      try {
        const response = await apiClient.request<any>('/admin/users?role=admin&per_page=100');
        if ('data' in response && response.data) {
          return response.data as AdminUser[];
        }
        return (response as any[]).filter((user: any) => 
          user.user_roles?.some((ur: any) => ur.role?.slug === 'admin')
        );
      } catch {
        return [];
      }
    },
  });

  const handleAssignModerator = (disputeId: number) => {
    setAssignDialog({ open: true, disputeId, selectedAdminId: null });
  };

  const handleResolve = (disputeId: number) => {
    setResolveDialog({ open: true, disputeId, resolution: '' });
  };

  const confirmAssign = async () => {
    if (assignDialog.disputeId && assignDialog.selectedAdminId) {
      try {
        // Use correct endpoint: POST /admin/disputes/:id/assign
        await apiClient.request(`/admin/disputes/${assignDialog.disputeId}/assign`, {
          method: 'POST',
          body: JSON.stringify({ admin_id: assignDialog.selectedAdminId }),
        });
        toast.success('Moderator Assigned', {
          description: 'A moderator has been assigned to this dispute.',
        });
        refetch();
      } catch (error: any) {
        console.error('Failed to assign moderator:', error);
        toast.error('Failed to assign moderator', {
          description: error.message || 'An error occurred while assigning moderator.',
        });
      }
    } else if (!assignDialog.selectedAdminId) {
      toast.error('Please select an admin');
      return;
    }
    setAssignDialog({ open: false, disputeId: null, selectedAdminId: null });
  };

  const confirmResolve = async () => {
    if (resolveDialog.disputeId) {
      try {
        // Use correct endpoint: PUT /admin/disputes/:id/status
        await apiClient.request(`/admin/disputes/${resolveDialog.disputeId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ 
            status: 'RESOLVED',
            resolution: resolveDialog.resolution || 'Dispute resolved by admin',
          }),
        });
        toast.success('Dispute Resolved', {
          description: 'The dispute has been marked as resolved.',
        });
        refetch();
      } catch (error: any) {
        console.error('Failed to resolve dispute:', error);
        toast.error('Failed to resolve dispute', {
          description: error.message || 'An error occurred while resolving dispute.',
        });
      }
    }
    setResolveDialog({ open: false, disputeId: null, resolution: '' });
  };

  const columns: Column<Dispute>[] = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      render: (value) => `#${value}`,
    },
    {
      key: 'order_id',
      title: 'Order',
      dataIndex: 'order_id',
      render: (value) => (
        <Button
          variant="link"
          onClick={() => navigate(`/admin/orders/${value}`)}
          className="p-0 h-auto"
        >
          Order #{value}
        </Button>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: 'state',
      title: 'Status',
      dataIndex: 'state',
      render: (value) => (
        <Badge 
          variant={
            value === 'resolved' ? 'default' :
            value === 'in_review' ? 'secondary' : 'destructive'
          }
          className="capitalize"
        >
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'buyer',
      title: 'Buyer',
      dataIndex: 'buyer',
      render: (value) => {
        if (!value || typeof value !== 'object') {
          return <span className="text-muted-foreground">N/A</span>;
        }
        const name = value.name || value.username || 'Unknown';
        const email = value.email || '';
        return (
          <div>
            <p className="font-medium">{String(name)}</p>
            {email && <p className="text-sm text-muted-foreground">{String(email)}</p>}
          </div>
        );
      },
    },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => {
        const numValue = typeof value === 'number' ? value : Number(value) || 0;
        return `$${numValue.toFixed(2)}`;
      },
    },
    {
      key: 'created_at',
      title: 'Created',
      dataIndex: 'created_at',
      render: (value) => safeFormatDate(value),
    },
  ];

  const bulkActions = [
    {
      label: 'Assign Moderator',
      onClick: () => handleBulkAction('Assign Moderator'),
      icon: <User className="h-4 w-4" />,
    },
    {
      label: 'Resolve',
      onClick: () => handleBulkAction('Resolve'),
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  const handleBulkAction = (action: string) => {
    toast.info('Bulk Action', {
      description: `${action} applied to selected disputes.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Disputes</h1>
          <p className="text-muted-foreground">Manage customer disputes and resolutions</p>
        </div>
      </div>

      <DataTable
        data={data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: data?.length || 0,
          onChange: (page, pageSize) => {
            // Handle pagination
          },
        }}
        actions={{
          view: (record) => navigate(`/admin/disputes/${record.id}`),
          custom: [
            {
              label: 'Assign Moderator',
              onClick: (record) => handleAssignModerator(record.id),
              icon: <User className="h-4 w-4" />,
            },
            {
              label: 'Resolve',
              onClick: (record) => handleResolve(record.id),
              icon: <CheckCircle className="h-4 w-4" />,
            },
          ],
        }}
        bulkActions={bulkActions}
      />

      {/* Assign Moderator Dialog */}
      <Dialog open={assignDialog.open} onOpenChange={(open) => setAssignDialog({ open, disputeId: null, selectedAdminId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Moderator</DialogTitle>
            <DialogDescription>
              Select an admin user to assign to this dispute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-select">Select Admin</Label>
              <Select
                value={assignDialog.selectedAdminId?.toString() || ''}
                onValueChange={(value) => setAssignDialog(prev => ({ ...prev, selectedAdminId: parseInt(value) }))}
              >
                <SelectTrigger id="admin-select">
                  <SelectValue placeholder="Select an admin..." />
                </SelectTrigger>
                <SelectContent>
                  {adminUsersData && adminUsersData.length > 0 ? (
                    adminUsersData.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id.toString()}>
                        {admin.name} ({admin.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No admins available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog({ open: false, disputeId: null, selectedAdminId: null })}>
              Cancel
            </Button>
            <Button onClick={confirmAssign} disabled={!assignDialog.selectedAdminId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dispute Dialog */}
      <Dialog open={resolveDialog.open} onOpenChange={(open) => setResolveDialog({ open, disputeId: null, resolution: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Enter resolution details and mark this dispute as resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Notes</Label>
              <Textarea
                id="resolution"
                placeholder="Enter resolution details..."
                value={resolveDialog.resolution}
                onChange={(e) => setResolveDialog(prev => ({ ...prev, resolution: e.target.value }))}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog({ open: false, disputeId: null, resolution: '' })}>
              Cancel
            </Button>
            <Button onClick={confirmResolve}>
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DisputesList;
