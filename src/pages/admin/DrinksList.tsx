
import AdminLayout from '@/components/admin/AdminLayout';
import { DrinksList as DrinksListComponent } from '@/components/admin/DrinksList';

const DrinksList = () => {
  return (
    <AdminLayout>
      <DrinksListComponent />
    </AdminLayout>
  );
};

export default DrinksList;
