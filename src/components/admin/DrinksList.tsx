
import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  category: z.string().min(1, 'Please select a category'),
  points_earned: z.coerce.number().min(1, 'Points must be at least 1'),
  price: z.coerce.number().min(0, 'Price cannot be negative').optional(),
  membership_required: z.string().optional(),
  active: z.boolean().default(true),
});

type DrinkFormValues = z.infer<typeof drinkSchema>;

const CATEGORIES = [
  { label: 'White Tradition', value: 'white_tradition', defaultPoints: 4 },
  { label: 'Black Tradition', value: 'black_tradition', defaultPoints: 3 },
  { label: 'Raw Signature', value: 'raw_signature', defaultPoints: 5 },
  { label: 'Raw Specialty', value: 'raw_specialty', defaultPoints: 6 },
];

const MEMBERSHIP_TIERS = [
  { label: 'None', value: '' },
  { label: 'Bronze', value: 'bronze' },
  { label: 'Silver', value: 'silver' },
  { label: 'Gold', value: 'gold' },
];

interface DrinksListProps {
  showAddDialogProp?: boolean;
  setShowAddDialogProp?: (open: boolean) => void;
}

const DrinksList = ({ showAddDialogProp, setShowAddDialogProp }: DrinksListProps = {}) => {
  const [selectedDrink, setSelectedDrink] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Use prop value if provided, otherwise use local state
  const showDialog = showAddDialogProp !== undefined ? showAddDialogProp : dialogOpen;
  const setShowDialog = setShowAddDialogProp || setDialogOpen;
  
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
      membership_required: '',
      active: true,
    },
  });

  // Update points based on category selection
  useEffect(() => {
    const category = form.watch('category');
    const categoryData = CATEGORIES.find(cat => cat.value === category);
    
    if (categoryData && !selectedDrink) {
      form.setValue('points_earned', categoryData.defaultPoints);
    }
  }, [form.watch('category'), form, selectedDrink]);
  
  const openCreateDialog = () => {
    form.reset({
      name: '',
      category: '',
      points_earned: 5,
      price: 0,
      membership_required: '',
      active: true,
    });
    setSelectedDrink(null);
    setShowDialog(true);
  };
  
  const openEditDialog = (drink: any) => {
    form.reset({
      name: drink.name,
      category: drink.category || '',
      points_earned: drink.points_earned,
      price: drink.price || 0,
      membership_required: drink.membership_required || '',
      active: !!drink.active,
    });
    setSelectedDrink(drink);
    setShowDialog(true);
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
          toast.success(`${values.name} has been updated`);
          setShowDialog(false);
        }
      });
    } else {
      // Create new drink
      createDrink.mutate({
        name: values.name,
        points_earned: values.points_earned,
        category: values.category,
        price: values.price,
        membership_required: values.membership_required,
        active: values.active
      }, {
        onSuccess: () => {
          toast.success(`${values.name} has been created`);
          setShowDialog(false);
        }
      });
    }
  };
  
  const handleDelete = () => {
    if (!selectedDrink) return;
    
    deleteDrink.mutate(selectedDrink.id, {
      onSuccess: () => {
        toast.success(`${selectedDrink.name} has been deleted`);
        setDeleteDialogOpen(false);
      }
    });
  };

  const handleToggleActive = (drink: any) => {
    updateDrink.mutate({
      id: drink.id,
      active: !drink.active
    }, {
      onSuccess: () => {
        toast.success(`${drink.name} is now ${!drink.active ? 'active' : 'inactive'}`);
      }
    });
  };

  // If using as a standalone component (not in DrinksManagement page)
  if (!showAddDialogProp) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Manage Drinks</h2>
          <Button onClick={openCreateDialog} className="bg-amber-700 hover:bg-amber-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Drink
          </Button>
        </div>
        
        {/* Main drinks list content */}
        {renderDrinksList()}
        
        {/* Create/Edit Dialog */}
        {renderCreateEditDialog()}
        
        {/* Delete Confirmation Dialog */}
        {renderDeleteDialog()}
      </div>
    );
  }
  
  // If used within DrinksManagement page
  return (
    <>
      {/* Main drinks list content */}
      {renderDrinksList()}
      
      {/* Create/Edit Dialog */}
      {renderCreateEditDialog()}
      
      {/* Delete Confirmation Dialog */}
      {renderDeleteDialog()}
    </>
  );
  
  function renderDrinksList() {
    if (isLoading) {
      return (
        <div className="py-8 text-center">Loading drinks...</div>
      );
    }
    
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drinks?.map((drink) => (
          <div 
            key={drink.id}
            className="border rounded-lg p-4 flex flex-col bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`bg-amber-100 p-2 rounded-full ${!drink.active ? 'opacity-50' : ''}`}>
                <CoffeeIcon className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={!!drink.active} 
                  onCheckedChange={() => handleToggleActive(drink)}
                  aria-label={drink.active ? 'Active' : 'Inactive'}
                />
                <span className="text-sm text-gray-500">{drink.active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            <h3 className="font-medium text-lg">{drink.name}</h3>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
              {drink.category && (
                <Badge variant="outline" className="capitalize">
                  {getCategoryLabel(drink.category)}
                </Badge>
              )}
              <Badge variant="secondary" className="capitalize">
                {drink.points_earned} points
              </Badge>
              {drink.membership_required && (
                <Badge className={getTierBadgeClass(drink.membership_required)}>
                  {drink.membership_required}
                </Badge>
              )}
            </div>

            {drink.price && (
              <div className="text-sm text-amber-700 mt-auto mb-4">
                ${drink.price.toFixed(2)}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-auto">
              <Button variant="outline" size="sm" onClick={() => openEditDialog(drink)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteDialog(drink)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
        
        {drinks?.length === 0 && (
          <div className="col-span-full py-8 text-center border rounded-lg">
            <CoffeeIcon className="mx-auto h-10 w-10 text-amber-300 mb-2" />
            <h3 className="text-lg font-medium">No drinks configured</h3>
            <p className="text-muted-foreground">Add your first drink to get started</p>
            <Button onClick={openCreateDialog} className="bg-amber-700 hover:bg-amber-800 mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add First Drink
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  function renderCreateEditDialog() {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDrink ? 'Edit Drink' : 'Add New Drink'}
            </DialogTitle>
            <DialogDescription>
              {selectedDrink 
                ? 'Update the details for this drink' 
                : 'Configure a new drink with its category and point value'}
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {CATEGORIES.map(category => (
                            <SelectItem 
                              key={category.value} 
                              value={category.value}
                            >
                              {category.label} ({category.defaultPoints} pts)
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Category determines the default point value
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
                name="membership_required"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier Required</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || ''}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select required tier (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {MEMBERSHIP_TIERS.map(tier => (
                            <SelectItem 
                              key={tier.value || 'none'} 
                              value={tier.value || 'none'}
                            >
                              {tier.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Minimum membership tier required to order this drink
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
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
    );
  }
  
  function renderDeleteDialog() {
    return (
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
    );
  }

  // Helper functions
  function getCategoryLabel(categoryValue: string): string {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  }

  function getTierBadgeClass(tier: string): string {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-200 text-amber-800 hover:bg-amber-300';
      case 'silver':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
      case 'gold':
        return 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300';
      default:
        return '';
    }
  }
};

export default DrinksList;
