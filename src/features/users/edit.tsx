import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { apiClient } from '@/lib/api';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  role: z.enum(['admin', 'seller', 'user']),
  status: z.enum(['active', 'inactive', 'suspended']),
  phone: z.string().optional(),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

function UsersEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { update, isPending } = useAdminMutation<any>({
    endpoint: '/users',
    invalidateQueries: ['admin-list', '/users', 'admin-user-detail'],
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.request<any>(`/admin/users/${id}`);
      return 'data' in response ? response.data : response;
    },
    enabled: !!id && !isNaN(Number(id)),
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      role: 'user',
      status: 'active',
      phone: '',
      password: '',
    },
  });

  useEffect(() => {
    if (userData) {
      // Transform backend data to form format
      const userRoles = userData.user_roles || [];
      const role = userRoles.length > 0 ? userRoles[0]?.role?.slug || 'user' : 'user';
      const status = userData.is_active ? 'active' : 'inactive';

      form.reset({
        name: userData.name || '',
        email: userData.email || '',
        username: userData.username || '',
        role: role as 'admin' | 'seller' | 'user',
        status: status as 'active' | 'inactive' | 'suspended',
        phone: userData.phone || '',
        password: '', // Don't prefill password
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: UserFormData) => {
    if (!id) return;

    try {
      // Map form data to backend format
      const updateData: any = {
        name: data.name,
        email: data.email,
        username: data.username,
        phone: data.phone || undefined,
        role: data.role, // Backend handles role assignment
        is_active: data.status === 'active',
      };

      // Only include password if provided
      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      await update(Number(id), updateData);
      toast.success('User updated', {
        description: 'User has been successfully updated.',
      });
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Failed to update user:', error);
      // Error is already handled by the hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-destructive">User not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
          <p className="text-muted-foreground">Update user information</p>
        </div>
      </div>

      <Form
        schema={userSchema}
        defaultValues={form.getValues()}
        onSubmit={onSubmit}
        loading={isPending}
      >
        {(form) => (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                form={form}
                name="name"
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              <FormField
                form={form}
                name="email"
                label="Email Address"
                placeholder="Enter email address"
                type="email"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                form={form}
                name="username"
                label="Username"
                placeholder="Enter username"
                required
              />
              <FormField
                form={form}
                name="phone"
                label="Phone Number"
                placeholder="Enter phone number"
                type="tel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Role <span className="text-destructive">*</span>
                </label>
                <Select
                  value={form.watch('role')}
                  onValueChange={(value) => form.setValue('role', value as 'admin' | 'seller' | 'user')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status <span className="text-destructive">*</span>
                </label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive' | 'suspended')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                New Password (leave blank to keep current)
              </label>
              <Input
                type="password"
                placeholder="Enter new password"
                {...form.register('password')}
              />
              <p className="text-xs text-muted-foreground">
                Only fill this if you want to change the password
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}

export default UsersEdit;

