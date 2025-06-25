
import { Outlet } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';

const Admin = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default Admin;
