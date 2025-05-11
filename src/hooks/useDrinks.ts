
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchActiveDrinks, 
  fetchAllDrinks,
  createNewDrink,
  updateExistingDrink,
  removeExistingDrink,
  type Drink,
  type CreateDrinkInput,
  type UpdateDrinkInput
} from '@/services/drinks';
import { toast } from 'sonner';

// Query keys for React Query
export const drinksKeys = {
  all: ['drinks'] as const,
  lists: () => [...drinksKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) => [
    ...drinksKeys.lists(),
    filters
  ] as const,
  actives: () => [...drinksKeys.all, 'active'] as const,
  details: () => [...drinksKeys.all, 'detail'] as const,
  detail: (id: string) => [...drinksKeys.details(), id] as const,
};

/**
 * Hook to fetch all active drinks
 */
export function useActiveDrinks() {
  return useQuery({
    queryKey: drinksKeys.actives(),
    queryFn: fetchActiveDrinks,
  });
}

/**
 * Hook to fetch all drinks (for admin)
 */
export function useAllDrinks() {
  return useQuery({
    queryKey: drinksKeys.lists(),
    queryFn: fetchAllDrinks,
  });
}

/**
 * Hook to create a new drink
 */
export function useCreateDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (drink: CreateDrinkInput) => createNewDrink(drink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinksKeys.lists() });
      toast.success('Drink created successfully');
    },
    onError: (error) => {
      console.error('Failed to create drink:', error);
      toast.error(`Failed to create drink: ${(error as Error).message}`);
    },
  });
}

/**
 * Hook to update an existing drink
 */
export function useUpdateDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (drink: UpdateDrinkInput) => updateExistingDrink(drink),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: drinksKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: drinksKeys.lists() });
      toast.success('Drink updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update drink:', error);
      toast.error(`Failed to update drink: ${(error as Error).message}`);
    },
  });
}

/**
 * Hook to delete a drink
 */
export function useDeleteDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => removeExistingDrink(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: drinksKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: drinksKeys.lists() });
      toast.success('Drink deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete drink:', error);
      toast.error(`Failed to delete drink: ${(error as Error).message}`);
    },
  });
}
