
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  createDrink as createDrinkApi, 
  updateDrink as updateDrinkApi, 
  deleteDrink as deleteDrinkApi
} from '@/integrations/supabase/functions';
import { toast } from 'sonner';

export type Drink = {
  id: string;
  name: string;
  points_earned: number;
  category?: string | null;
  price?: number | null;
  membership_required?: string | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CreateDrinkInput = {
  name: string;
  points_earned: number;
  category?: string;
  price?: number;
  membership_required?: string;
  active?: boolean;
};

export type UpdateDrinkInput = {
  id: string;
  name?: string;
  points_earned?: number;
  category?: string;
  price?: number;
  membership_required?: string;
  active?: boolean;
};

// Get all drinks
export function useAllDrinks() {
  return useQuery({
    queryKey: ['drinks', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error('Failed to load drinks');
        throw error;
      }
      
      return data as Drink[];
    }
  });
}

// Get active drinks
export function useActiveDrinks() {
  return useQuery({
    queryKey: ['drinks', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) {
        toast.error('Failed to load drinks');
        throw error;
      }
      
      return data as Drink[];
    }
  });
}

// Create drink
export function useCreateDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drinkData: CreateDrinkInput) => {
      const { data, error } = await createDrinkApi(drinkData);
      
      if (error) {
        toast.error(`Failed to create drink: ${error.message}`);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    }
  });
}

// Update drink
export function useUpdateDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drinkData: UpdateDrinkInput) => {
      const { id, ...updateData } = drinkData;
      const { data, error } = await updateDrinkApi(id, updateData);
      
      if (error) {
        toast.error(`Failed to update drink: ${error.message}`);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    }
  });
}

// Delete drink
export function useDeleteDrink() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await deleteDrinkApi(id);
      
      if (error) {
        toast.error(`Failed to delete drink: ${error.message}`);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drinks'] });
    }
  });
}
