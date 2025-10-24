import React, { useState } from 'react';
import { useList, useDelete } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { User, Shield, UserX } from 'lucide-react';

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
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({ open: false, userId: null });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { data, isLoading, refetch } = useList<User>({
    resource: 'users',
    pagination: { current: 1, pageSize: 10 },
  });

  const { mutate: deleteUser } = useDelete();

  const handleDelete = (userId: number) => {
    setDeleteDialog({ open: true, userId });
  };

  const confirmDelete = () => {
    if (deleteDialog.userId) {
      deleteUser({
        resource: 'users',
        id: deleteDialog.userId,
      }, {
        onSuccess: () => {
          toast({
            title: 'User deleted',
            description: 'User has been successfully deleted.',
          });
          refetch();
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to delete user.',
            variant: 'destructive',
          });
        },
      });
    }
    setDeleteDialog({ open: false, userId: null });
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) return;
    
    toast({
      title: 'Bulk Action',
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
