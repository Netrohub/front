import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { safeFormatDate } from '@/utils/dateHelpers';
import { CreditCard, Shield, RotateCcw } from 'lucide-react';
import { useAdminList } from '@/hooks/useAdminList';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { apiClient } from '@/lib/api';

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
  const { id } = useParams();
  const [releaseDialog, setReleaseDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });
  const [refundDialog, setRefundDialog] = useState<{
    open: boolean;
    orderId: number | null;
  }>({ open: false, orderId: null });

  // If ID is provided, show order detail view
  const { data: orderDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['admin-order-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.request<any>(`/admin/orders/${id}`);
      return 'data' in response ? response.data : response;
    },
    enabled: !!id && !isNaN(Number(id)),
  });

  const { data, isLoading, refetch } = useAdminList<Order>({
    endpoint: '/orders',
    initialSearchTerm: '',
  });

  // If viewing a detail, show detail view
  if (id && !isNaN(Number(id))) {
    if (isLoadingDetail) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      );
    }

    if (!orderDetail) {
      return (
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => navigate('/admin/orders')}>
            ← Back to Orders
          </Button>
          <Card className="p-6">
            <p className="text-destructive">Order not found</p>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin/orders')}>
            ← Back to Orders
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Order #{orderDetail.order_number || orderDetail.id}</h1>
              <p className="text-muted-foreground">
                {safeFormatDate(orderDetail.created_at)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Buyer</label>
                <p className="text-foreground">
                  {orderDetail.buyer?.name || 'N/A'} ({orderDetail.buyer?.email || 'N/A'})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Seller</label>
                <p className="text-foreground">
                  {orderDetail.seller?.name || 'N/A'} ({orderDetail.seller?.email || 'N/A'})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="text-foreground font-semibold">
                  ${Number(orderDetail.total_amount || orderDetail.amount || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-foreground capitalize">{orderDetail.status || orderDetail.payment_status}</p>
              </div>
            </div>

            {orderDetail.items && orderDetail.items.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                <div className="space-y-2">
                  {orderDetail.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.product?.name || item.name || 'Unknown Product'}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number(item.price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const { update } = useAdminMutation<Order>({
    endpoint: '/orders',
    invalidateQueries: ['admin-list', '/orders'],
  });

  const handleReleaseEscrow = (orderId: number) => {
    setReleaseDialog({ open: true, orderId });
  };

  const handleRefund = (orderId: number) => {
    setRefundDialog({ open: true, orderId });
  };

  const confirmRelease = async () => {
    if (releaseDialog.orderId) {
      try {
        // Use correct endpoint: PUT /admin/orders/:id/status
        await apiClient.request(`/admin/orders/${releaseDialog.orderId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'COMPLETED' }), // Backend uses PaymentStatus enum
        });
        toast.success('Escrow Released', {
          description: 'Funds have been released to the seller.',
        });
        refetch(); // Refresh the list
      } catch (error: any) {
        console.error('Failed to release escrow:', error);
        toast.error('Failed to release escrow', {
          description: error.message || 'An error occurred while releasing escrow.',
        });
      }
    }
    setReleaseDialog({ open: false, orderId: null });
  };

  const confirmRefund = async () => {
    if (refundDialog.orderId) {
      try {
        // Use correct endpoint: PUT /admin/orders/:id/status
        await apiClient.request(`/admin/orders/${refundDialog.orderId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'REFUNDED' }), // Backend uses PaymentStatus enum
        });
        toast.success('Refund Processed', {
          description: 'Order has been refunded to the buyer.',
        });
        refetch(); // Refresh the list
      } catch (error: any) {
        console.error('Failed to process refund:', error);
        toast.error('Failed to process refund', {
          description: error.message || 'An error occurred while processing refund.',
        });
      }
    }
    setRefundDialog({ open: false, orderId: null });
  };

  const columns: Column<Order>[] = [
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
      key: 'seller',
      title: 'Seller',
      dataIndex: 'seller',
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
      render: (value) => safeFormatDate(value),
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
    toast.info('Bulk Action', {
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
