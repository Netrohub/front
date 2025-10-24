import React, { useState } from 'react';
import { useList, useUpdate } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { AlertTriangle, User, CheckCircle, MessageSquare } from 'lucide-react';

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

function DisputesList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignDialog, setAssignDialog] = useState<{
    open: boolean;
    disputeId: number | null;
  }>({ open: false, disputeId: null });
  const [resolveDialog, setResolveDialog] = useState<{
    open: boolean;
    disputeId: number | null;
  }>({ open: false, disputeId: null });

  const { data, isLoading, refetch } = useList<Dispute>({
    resource: 'disputes',
    pagination: { current: 1, pageSize: 10 },
  });

  const { mutate: updateDispute } = useUpdate();

  const handleAssignModerator = (disputeId: number) => {
    setAssignDialog({ open: true, disputeId });
  };

  const handleResolve = (disputeId: number) => {
    setResolveDialog({ open: true, disputeId });
  };

  const confirmAssign = () => {
    if (assignDialog.disputeId) {
      updateDispute({
        resource: 'disputes',
        id: assignDialog.disputeId,
        values: { state: 'in_review' },
      }, {
        onSuccess: () => {
          toast({
            title: 'Moderator Assigned',
            description: 'A moderator has been assigned to this dispute.',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to assign moderator.',
            variant: 'destructive',
          });
        },
      });
    }
    setAssignDialog({ open: false, disputeId: null });
  };

  const confirmResolve = () => {
    if (resolveDialog.disputeId) {
      updateDispute({
        resource: 'disputes',
        id: resolveDialog.disputeId,
        values: { state: 'resolved' },
      }, {
        onSuccess: () => {
          toast({
            title: 'Dispute Resolved',
            description: 'The dispute has been marked as resolved.',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to resolve dispute.',
            variant: 'destructive',
          });
        },
      });
    }
    setResolveDialog({ open: false, disputeId: null });
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
      render: (value) => (
        <div>
          <p className="font-medium">{value.name}</p>
          <p className="text-sm text-muted-foreground">{value.email}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: 'created_at',
      title: 'Created',
      dataIndex: 'created_at',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
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
    toast({
      title: 'Bulk Action',
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
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: data?.total || 0,
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

      <ConfirmDialog
        open={assignDialog.open}
        onOpenChange={(open) => setAssignDialog({ open, disputeId: null })}
        title="Assign Moderator"
        description="Are you sure you want to assign a moderator to this dispute?"
        confirmText="Assign"
        onConfirm={confirmAssign}
      />

      <ConfirmDialog
        open={resolveDialog.open}
        onOpenChange={(open) => setResolveDialog({ open, disputeId: null })}
        title="Resolve Dispute"
        description="Are you sure you want to mark this dispute as resolved?"
        confirmText="Resolve"
        onConfirm={confirmResolve}
      />
    </div>
  );
}

export default DisputesList;
