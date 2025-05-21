
import AdminLayout from '@/components/admin/AdminLayout';
import RedemptionsManagement from '@/components/admin/RedemptionsManagement';

const RedemptionsAdmin = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Redemptions</h1>
          <p className="text-muted-foreground">
            Approve or reject customer reward redemptions
          </p>
        </div>
        
        <RedemptionsManagement />
      </div>
    </AdminLayout>
  );
};

export default RedemptionsAdmin;
