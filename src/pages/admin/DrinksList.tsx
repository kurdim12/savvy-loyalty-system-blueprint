
import AdminLayout from '@/components/admin/AdminLayout';
import DrinksList from '@/components/admin/DrinksList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const DrinksManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drinks Management</h1>
            <p className="text-gray-500">Configure drinks and their point values</p>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-amber-700 hover:bg-amber-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Drink
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Drinks Configuration</CardTitle>
            <CardDescription>
              Manage the drinks available in your loyalty program and their point values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DrinksList showAddDialogProp={showAddDialog} setShowAddDialogProp={setShowAddDialog} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DrinksManagement;
