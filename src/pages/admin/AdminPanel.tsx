import React from 'react';
import { Outlet } from 'react-router-dom';
import { Refine } from '@refinedev/core';
import { dataProvider } from '../../refine/dataProvider';
import { authProvider } from '../../refine/authProvider';
import AdminLayout from '../../layouts/AdminLayout';

const AdminPanel = () => {
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

export default AdminPanel;
