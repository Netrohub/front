import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminLogin } from '../../components/AdminLogin';
import AdminLayout from '../../layouts/AdminLayout';
import { LoadingSpinner } from '../../components/admin';

const AdminPanelContent = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading admin panel..." />;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
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
