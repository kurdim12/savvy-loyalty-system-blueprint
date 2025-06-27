
import BulkEmailSender from '@/components/admin/BulkEmailSender';

const BulkEmailManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Email Management</h1>
          <p className="text-gray-600 mt-2">Send personalized emails to all registered users</p>
        </div>
      </div>
      
      <BulkEmailSender />
    </div>
  );
};

export default BulkEmailManagement;
