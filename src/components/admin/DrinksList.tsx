
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CoffeeIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAllDrinks, useCreateDrink, useUpdateDrink, useDeleteDrink } from '@/hooks/useDrinks';
import { toast } from 'sonner';

// Form schema for drink
const drinkSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  category: z.string().optional(),
  points_earned: z.coerce.number().min(1, 'Points must be at least 1'),
  price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
  active: z.boolean().default(true),
});

type DrinkFormValues = z.infer<typeof drinkSchema>;

const DrinksList = () => {
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { data: drinks, isLoading } = useAllDrinks();
  const createDrink = useCreateDrink();
  const updateDrink = useUpdateDrink();
  const deleteDrink = useDeleteDrink();
  
  const form = useForm<DrinkFormValues>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      name: '',
      category: '',
      points_earned: 5,
      price: 0,
      active: true,
    },
  });
  
  const openCreateDialog = () => {
    form.reset({
      name: '',
      category: '',
      points_earned: 5,
      price: 0,
      active: true,
    });
    setSelectedDrink(null);
    setDialogOpen(true);
  };
  
  const openEditDialog = (drink: any) => {
    form.reset({
      name: drink.name,
      category: drink.category || '',
      points_earned: drink.points_earned,
      price: drink.price || 0,
      active: !!drink.active,
    });
    setSelectedDrink(drink);
    setDialogOpen(true);
  };
  
  const openDeleteDialog = (drink: any) => {
    setSelectedDrink(drink);
    setDeleteDialogOpen(true);
  };
  
  const onSubmit = (values: DrinkFormValues) => {
    if (selectedDrink) {
      // Update existing drink
      updateDrink.mutate({
        id: selectedDrink.id,
        ...values
      }, {
        onSuccess: () => {
          setDialogOpen(false);
        }
      });
    } else {
      // Create new drink - Fix: Ensure all required fields are present
      createDrink.mutate({
        name: values.name, // This ensures name is always provided
        points_earned: values.points_earned,
        category: values.category,
        price: values.price,
        active: values.active
      }, {
        onSuccess: () => {
          setDialogOpen(false);
        }
      });
    }
  };
  
  const handleDelete = () => {
    if (!selectedDrink) return;
    
    deleteDrink.mutate(selectedDrink.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Drinks</h2>
        <Button onClick={openCreateDialog} className="bg-amber-700 hover:bg-amber-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Drink
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-8 text-center">Loading drinks...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {drinks?.map((drink) => (
            <div 
              key={drink.id}
              className="border rounded-lg p-4 flex items-center justify-between bg-white"
            >
              <div className="flex items-center gap-3">
                <div className={`bg-amber-100 p-2 rounded-full ${!drink.active ? 'opacity-50' : ''}`}>
                  <CoffeeIcon className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-medium">{drink.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {drink.points_earned} points
                    </Badge>
                    {drink.category && (
                      <Badge variant="outline" className="capitalize">
                        {drink.category}
                      </Badge>
                    )}
                    {drink.price && (
                      <span className="text-sm text-amber-700">
                        ${drink.price.toFixed(2)}
                      </span>
                    )}
                    {!drink.active && (
                      <Badge variant="outline" className="bg-gray-100">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(drink)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => openDeleteDialog(drink)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {drinks?.length === 0 && (
            <div className="col-span-2 py-8 text-center border rounded-lg">
              <CoffeeIcon className="mx-auto h-10 w-10 text-amber-300 mb-2" />
              <h3 className="text-lg font-medium">No drinks configured</h3>
              <p className="text-muted-foreground">Add your first drink to get started</p>
            </div>
          )}
        </div>
      )}
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDrink ? 'Edit Drink' : 'Add New Drink'}
            </DialogTitle>
            <DialogDescription>
              {selectedDrink 
                ? 'Update the details for this drink' 
                : 'Configure a new drink and set its point value'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Espresso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="tradition, signature, or specialty" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional category to group drinks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="points_earned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points Earned</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (optional)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Inactive drinks won't be visible to customers
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
                  {selectedDrink ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Drink</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDrink?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrinksList;
