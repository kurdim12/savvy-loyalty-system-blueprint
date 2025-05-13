
import { useState, useEffect } from 'react';
import { 
  useAllDrinks, 
  useCreateDrink, 
  useUpdateDrink, 
  useDeleteDrink, 
  type Drink, 
  type CreateDrinkInput 
} from '@/hooks/useDrinks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Coffee, Plus } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'signature', label: 'Signature' },
  { value: 'specialty', label: 'Specialty' }
];

const MEMBERSHIP_TIERS = [
  { value: 'none', label: 'None' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' }
];

interface DrinksListProps {
  showAddDialogProp?: boolean;
  setShowAddDialogProp?: (show: boolean) => void;
}

export default function DrinksList({ showAddDialogProp, setShowAddDialogProp }: DrinksListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [newDrink, setNewDrink] = useState<CreateDrinkInput>({
    name: '',
    points_earned: 5,
    category: 'signature',
    price: 0,
    membership_required: 'none',
    active: true
  });

  // Control dialog visibility from both internal state and parent prop
  useEffect(() => {
    if (showAddDialogProp !== undefined) {
      setShowAddDialog(showAddDialogProp);
    }
  }, [showAddDialogProp]);

  // Sync dialog state with parent component if provided
  const handleCloseDialog = () => {
    setShowAddDialog(false);
    if (setShowAddDialogProp) {
      setShowAddDialogProp(false);
    }
  };

  const { data: drinks, isLoading } = useAllDrinks();
  const createDrink = useCreateDrink();
  const updateDrink = useUpdateDrink();
  const deleteDrink = useDeleteDrink();

  const handleCreateDrink = async () => {
    try {
      await createDrink.mutateAsync(newDrink);
      toast.success('Drink created successfully!');
      setNewDrink({
        name: '',
        points_earned: 5,
        category: 'signature',
        price: 0,
        membership_required: 'none',
        active: true
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating drink:', error);
      toast.error('Failed to create drink');
    }
  };

  const handleUpdateDrink = async () => {
    if (!editingDrink) return;
    
    try {
      await updateDrink.mutateAsync({
        id: editingDrink.id,
        name: editingDrink.name,
        points_earned: editingDrink.points_earned,
        category: editingDrink.category || undefined,
        price: editingDrink.price || undefined,
        membership_required: editingDrink.membership_required || undefined,
        active: editingDrink.active
      });
      toast.success('Drink updated successfully!');
      setEditingDrink(null);
    } catch (error) {
      console.error('Error updating drink:', error);
      toast.error('Failed to update drink');
    }
  };

  const handleDeleteDrink = async (drinkId: string) => {
    if (!confirm('Are you sure you want to delete this drink?')) return;
    
    try {
      await deleteDrink.mutateAsync(drinkId);
      toast.success('Drink deleted successfully!');
    } catch (error) {
      console.error('Error deleting drink:', error);
      toast.error('Failed to delete drink');
    }
  };

  const handleToggleActive = async (drink: Drink) => {
    try {
      await updateDrink.mutateAsync({
        id: drink.id,
        active: !drink.active
      });
      toast.success(`Drink ${!drink.active ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling drink status:', error);
      toast.error('Failed to update drink status');
    }
  };

  const getPointsForCategory = (category: string): number => {
    switch (category) {
      case 'white': return 4;
      case 'black': return 3;
      case 'signature': return 5;
      case 'specialty': return 6;
      default: return 5;
    }
  };

  const handleCategoryChange = (category: string) => {
    if (editingDrink) {
      setEditingDrink({
        ...editingDrink,
        category,
        points_earned: getPointsForCategory(category)
      });
    } else {
      setNewDrink({
        ...newDrink,
        category,
        points_earned: getPointsForCategory(category)
      });
    }
  };

  const renderCategoryBadge = (category?: string | null) => {
    if (!category) return <Badge variant="outline">None</Badge>;
    
    const badgeClasses = {
      'white': 'bg-slate-200 text-slate-800',
      'black': 'bg-slate-800 text-slate-100',
      'signature': 'bg-amber-600 text-amber-50',
      'specialty': 'bg-purple-600 text-purple-50',
    };
    
    return (
      <Badge className={badgeClasses[category as keyof typeof badgeClasses] || 'bg-gray-200'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const renderTierBadge = (tier?: string | null) => {
    if (!tier || tier === 'none') return <Badge variant="outline">None</Badge>;
    
    const badgeClasses = {
      'bronze': 'bg-amber-100 text-amber-800 border-amber-300',
      'silver': 'bg-gray-200 text-gray-800 border-gray-400',
      'gold': 'bg-yellow-100 text-yellow-800 border-yellow-400',
    };
    
    return (
      <Badge className={badgeClasses[tier as keyof typeof badgeClasses] || 'bg-gray-200'} variant="outline">
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Standalone Add Button (only shown if not controlled by parent) */}
      {setShowAddDialogProp === undefined && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-amber-700 hover:bg-amber-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Drink
          </Button>
        </div>
      )}

      {/* Drinks Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Tier Required</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading drinks...
                </TableCell>
              </TableRow>
            ) : !drinks || drinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No drinks found. Add your first drink!
                </TableCell>
              </TableRow>
            ) : (
              drinks.map((drink) => (
                <TableRow key={drink.id}>
                  <TableCell className="font-medium">{drink.name}</TableCell>
                  <TableCell>{renderCategoryBadge(drink.category)}</TableCell>
                  <TableCell>{drink.points_earned} pts</TableCell>
                  <TableCell>{renderTierBadge(drink.membership_required)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={!!drink.active} 
                      onCheckedChange={() => handleToggleActive(drink)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEditingDrink(drink)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDrink(drink.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Drink Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Drink</DialogTitle>
            <DialogDescription>
              Create a new drink for your loyalty program. Points will be automatically suggested based on the category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newDrink.name}
                onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Raw Signature"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3">
                <Select 
                  value={newDrink.category || 'signature'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                min={1}
                value={newDrink.points_earned}
                onChange={(e) => setNewDrink({ ...newDrink, points_earned: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min={0}
                value={newDrink.price || ''}
                onChange={(e) => setNewDrink({ ...newDrink, price: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tier" className="text-right">
                Tier Required
              </Label>
              <div className="col-span-3">
                <Select 
                  value={newDrink.membership_required || 'none'} 
                  onValueChange={(value) => setNewDrink({ ...newDrink, membership_required: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Membership Tiers</SelectLabel>
                      {MEMBERSHIP_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          {tier.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="active" 
                  checked={newDrink.active}
                  onCheckedChange={(checked) => setNewDrink({ ...newDrink, active: checked })}
                />
                <Label htmlFor="active" className="text-sm text-muted-foreground">
                  {newDrink.active ? 'Available to customers' : 'Hidden from customers'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateDrink} 
              disabled={!newDrink.name || newDrink.points_earned <= 0}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Add Drink
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drink Dialog */}
      <Dialog open={!!editingDrink} onOpenChange={(open) => !open && setEditingDrink(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Drink</DialogTitle>
            <DialogDescription>
              Update the details for this drink.
            </DialogDescription>
          </DialogHeader>
          {editingDrink && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingDrink.name}
                  onChange={(e) => setEditingDrink({ ...editingDrink, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={editingDrink.category || 'signature'} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-points" className="text-right">
                  Points
                </Label>
                <Input
                  id="edit-points"
                  type="number"
                  min={1}
                  value={editingDrink.points_earned}
                  onChange={(e) => setEditingDrink({ ...editingDrink, points_earned: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  Price
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min={0}
                  value={editingDrink.price || ''}
                  onChange={(e) => setEditingDrink({ ...editingDrink, price: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tier" className="text-right">
                  Tier Required
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={editingDrink.membership_required || 'none'} 
                    onValueChange={(value) => setEditingDrink({ ...editingDrink, membership_required: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Membership Tiers</SelectLabel>
                        {MEMBERSHIP_TIERS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="edit-active" 
                    checked={!!editingDrink.active}
                    onCheckedChange={(checked) => setEditingDrink({ ...editingDrink, active: checked })}
                  />
                  <Label htmlFor="edit-active" className="text-sm text-muted-foreground">
                    {editingDrink.active ? 'Available to customers' : 'Hidden from customers'}
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDrink(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateDrink} 
              disabled={!editingDrink?.name || (editingDrink?.points_earned || 0) <= 0}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Coffee className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
