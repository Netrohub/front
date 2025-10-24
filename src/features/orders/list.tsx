import React, { useState } from 'react';
import { useList, useUpdate } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CreditCard, Shield, RotateCcw } from 'lucide-react';

interface Order {
  id: number;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  amount: number;
  escrow_status: 'pending' | 'held' | 'released' | 'refunded';
  dispute_flag: boolean;
  created_at: string;
}

function OrdersList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [releaseDialog, setReleaseDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });
  const [refundDialog, setRefundDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });

  const { data, isLoading, refetch } = useList<Order>({
    resource: 'orders',
    pagination: { current: 1, pageSize: 10 },
  });

  const { mutate: updateOrder } = useUpdate();

  const handleReleaseEscrow = (orderId: number) => {
    setReleaseDialog({ open: true, orderId });
  };

  const handleRefund = (orderId: number) => {
    setRefundDialog({ open: true, orderId });
  };

  const confirmRelease = () => {
    if (releaseDialog.orderId) {
      updateOrder({
        resource: 'orders',
        id: releaseDialog.orderId,
        values: { escrow_status: 'released' },
      }, {
        onSuccess: () => {
          toast({
            title: 'Escrow Released',
            description: 'Funds have been released to the seller.',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to release escrow.',
            variant: 'destructive',
          });
        },
      });
    }
    setReleaseDialog({ open: false, orderId: null });
  };

  const confirmRefund = () => {
    if (refundDialog.orderId) {
      updateOrder({
        resource: 'orders',
        id: refundDialog.orderId,
        values: { escrow_status: 'refunded' },
      }, {
        onSuccess: () => {
          toast({
            title: 'Refund Processed',
            description: 'Order has been refunded to the buyer.',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to process refund.',
            variant: 'destructive',
          });
        },
      });
    }
    setRefundDialog({ open: false, orderId: null });
  };

  const columns: Column<Order>[] = [
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
      key: 'seller',
      title: 'Seller',
      dataIndex: 'seller',
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
      key: 'escrow_status',
      title: 'Escrow Status',
      dataIndex: 'escrow_status',
      render: (value) => (
        <Badge 
          variant={
            value === 'released' ? 'default' :
            value === 'held' ? 'secondary' :
            value === 'refunded' ? 'destructive' : 'outline'
          }
          className="capitalize"
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'dispute_flag',
      title: 'Dispute',
      dataIndex: 'dispute_flag',
      render: (value) => (
        <Badge variant={value ? 'destructive' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
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
      label: 'Release Escrow',
      onClick: () => handleBulkAction('Release Escrow'),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: 'Process Refund',
      onClick: () => handleBulkAction('Process Refund'),
      icon: <RotateCcw className="h-4 w-4" />,
    },
  ];

  const handleBulkAction = (action: string) => {
    toast({
      title: 'Bulk Action',
      description: `${action} applied to selected orders.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage orders and escrow transactions</p>
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
          view: (record) => navigate(`/admin/orders/${record.id}`),
          custom: [
            {
              label: 'Release Escrow',
              onClick: (record) => handleReleaseEscrow(record.id),
              icon: <CreditCard className="h-4 w-4" />,
            },
            {
              label: 'Refund',
              onClick: (record) => handleRefund(record.id),
              icon: <RotateCcw className="h-4 w-4" />,
            },
          ],
        }}
        bulkActions={bulkActions}
      />

      <ConfirmDialog
        open={releaseDialog.open}
        onOpenChange={(open) => setReleaseDialog({ open, orderId: null })}
        title="Release Escrow"
        description="Are you sure you want to release the escrow funds to the seller? This action cannot be undone."
        confirmText="Release"
        onConfirm={confirmRelease}
      />

      <ConfirmDialog
        open={refundDialog.open}
        onOpenChange={(open) => setRefundDialog({ open, orderId: null })}
        title="Process Refund"
        description="Are you sure you want to refund this order to the buyer? This action cannot be undone."
        confirmText="Refund"
        variant="destructive"
        onConfirm={confirmRefund}
      />
    </div>
  );
}

export default OrdersList;
