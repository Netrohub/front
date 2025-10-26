import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { User, Shield, UserX } from 'lucide-react';
import { useAdminList } from '@/hooks/useAdminList';
import { useAdminMutation } from '@/hooks/useAdminMutation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

function UsersList() {
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({ open: false, userId: null });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data, isLoading } = useAdminList<User>({
    endpoint: '/users',
    initialSearchTerm: '',
  });

  const { remove } = useAdminMutation<User>({
    endpoint: '/users',
    invalidateQueries: ['admin-list', '/users'],
  });

  const handleDelete = (userId: number) => {
    setDeleteDialog({ open: true, userId });
  };

  const confirmDelete = async () => {
    if (deleteDialog.userId) {
      try {
        await remove(deleteDialog.userId);
        toast.success('User deleted', {
          description: 'User has been successfully deleted.',
        });
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        // Error is already handled by the hook
      }
    }
    setDeleteDialog({ open: false, userId: null });
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) return;
    
    toast.info('Bulk Action', {
      description: `${action} applied to ${selectedRows.length} users.`,
    });
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (value, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{record.name}</p>
            <p className="text-sm text-muted-foreground">{record.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (value) => (
        <Badge variant="secondary" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <Badge 
          variant={value === 'active' ? 'default' : 'destructive'}
          className="capitalize"
        >
          {value}
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
      label: 'Deactivate',
      onClick: () => handleBulkAction('Deactivate'),
      icon: <UserX className="h-4 w-4" />,
    },
    {
      label: 'Impersonate',
      onClick: () => handleBulkAction('Impersonate'),
      icon: <Shield className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => navigate('/admin/users/create')}>
          Add User
        </Button>
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
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: setSelectedRows,
        }}
        actions={{
          view: (record) => navigate(`/admin/users/${record.id}`),
          edit: (record) => navigate(`/admin/users/${record.id}/edit`),
          delete: handleDelete,
        }}
        bulkActions={bulkActions}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, userId: null })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default UsersList;
