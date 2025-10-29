import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Package,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { useAdminList } from '@/hooks/useAdminList';
import { useAdminMutation } from '@/hooks/useAdminMutation';

interface Listing {
  id: number;
  title: string;
  seller: {
    name: string;
    email: string;
  };
  price: number;
  stock: number;
  status: 'active' | 'pending' | 'rejected' | 'draft';
  rating?: number;
  sales_count?: number;
  category?: string;
  created_at: string;
}

function ListingsList() {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    listingId: number | null;
  }>({ open: false, listingId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading } = useAdminList<Listing>({
    endpoint: '/products',
    initialSearchTerm: '',
  });

  const { remove } = useAdminMutation<Listing>({
    endpoint: '/products',
    invalidateQueries: ['admin-list', '/products'],
  });

  const handleDelete = (listingId: number) => {
    setDeleteDialog({ open: true, listingId });
  };

  const confirmDelete = async () => {
    if (deleteDialog.listingId) {
      try {
        await remove(deleteDialog.listingId);
        toast.success('Listing deleted', {
          description: 'Listing has been successfully deleted.',
        });
      } catch (error: any) {
        console.error('Failed to delete listing:', error);
        // Error is already handled by the hook
      }
    }
    setDeleteDialog({ open: false, listingId: null });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: Column<Listing>[] = [
    {
      key: 'title',
      title: 'Listing',
      dataIndex: 'title',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            {record.category && (
              <p className="text-sm text-muted-foreground">{record.category}</p>
            )}
          </div>
        </div>
      ),
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
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      render: (value) => {
        const numValue = typeof value === 'number' ? value : Number(value) || 0;
        return (
          <div>
            <p className="font-medium">${numValue.toFixed(2)}</p>
          </div>
        );
      },
    },
    {
      key: 'stock',
      title: 'Stock',
      dataIndex: 'stock',
      render: (value) => (
        <Badge variant={value > 0 ? 'secondary' : 'destructive'}>
          {value || 0}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'rating',
      title: 'Rating',
      dataIndex: 'rating',
      render: (value) => (
        value ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{value.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
    },
    {
      key: 'sales_count',
      title: 'Sales',
      dataIndex: 'sales_count',
      render: (value) => (
        value ? (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">0</span>
        )
      ),
    },
    {
      key: 'created_at',
      title: 'Created',
      dataIndex: 'created_at',
      render: (value) => format(new Date(value), 'MMM dd, yyyy'),
    },
  ];

  const filteredData = data?.filter((listing) => {
    const matchesSearch = (listing.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Listings</h1>
          <p className="text-muted-foreground">Manage product listings and approvals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Package className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Package className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'active', 'pending', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <DataTable
        data={filteredData || []}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: 1,
          pageSize: 10,
          total: filteredData?.length || 0,
          onChange: (page, pageSize) => {
            // Handle pagination
          },
        }}
        actions={{
          view: (record) => navigate(`/admin/listings/${record.id}`),
          edit: (record) => navigate(`/admin/listings/${record.id}/edit`),
          delete: handleDelete,
        }}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, listingId: null })}
        title="Delete Listing"
        description="Are you sure you want to delete this listing? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default ListingsList;
