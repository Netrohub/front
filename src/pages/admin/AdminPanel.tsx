import React from 'react';
import { Outlet } from 'react-router-dom';
import { Refine } from '@refinedev/core';
import { dataProvider } from '../../refine/dataProvider';
import { authProvider } from '../../refine/authProvider';
import { AdminAuthProvider, useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminLogin } from '../../components/AdminLogin';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPanelContent = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      resources={[
        {
          name: 'users',
          list: '/admin/users',
          create: '/admin/users/create',
          edit: '/admin/users/:id',
          show: '/admin/users/:id',
        },
        {
          name: 'orders',
          list: '/admin/orders',
          show: '/admin/orders/:id',
        },
        {
          name: 'listings',
          list: '/admin/listings',
          show: '/admin/listings/:id',
        },
        {
          name: 'payouts',
          list: '/admin/payouts',
          show: '/admin/payouts/:id',
        },
        {
          name: 'disputes',
          list: '/admin/disputes',
          show: '/admin/disputes/:id',
        },
      ]}
    >
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Refine>
  );
};

const AdminPanel = () => {
  return (
    <AdminAuthProvider>
      <AdminPanelContent />
    </AdminAuthProvider>
  );
};

export default AdminPanel;
