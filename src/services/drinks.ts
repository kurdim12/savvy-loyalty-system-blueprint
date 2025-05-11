
import { supabase } from '@/integrations/supabase/client';
import { 
  getDrinks, 
  getAllDrinks, 
  updateDrink, 
  createDrink, 
  deleteDrink 
} from '@/integrations/supabase/functions';

export interface Drink {
  id: string;
  name: string;
  points_earned: number;
  category: string | null;
  price: number | null;
  active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateDrinkInput {
  name: string;
  points_earned: number;
  category?: string;
  price?: number;
  active?: boolean;
}

export interface UpdateDrinkInput extends Partial<CreateDrinkInput> {
  id: string;
}

/**
 * Fetch all active drinks
 */
export const fetchActiveDrinks = async (): Promise<Drink[]> => {
  const { data, error } = await getDrinks();
  
  if (error) throw error;
  return data || [];
};

/**
 * Fetch all drinks (for admin)
 */
export const fetchAllDrinks = async (): Promise<Drink[]> => {
  const { data, error } = await getAllDrinks();
  
  if (error) throw error;
  return data || [];
};

/**
 * Create a new drink
 */
export const createNewDrink = async (drinkData: CreateDrinkInput): Promise<void> => {
  const { error } = await createDrink(drinkData);
  
  if (error) throw error;
};

/**
 * Update an existing drink
 */
export const updateExistingDrink = async (drinkData: UpdateDrinkInput): Promise<void> => {
  const { error } = await updateDrink(drinkData.id, drinkData);
  
  if (error) throw error;
};

/**
 * Delete a drink
 */
export const removeExistingDrink = async (id: string): Promise<void> => {
  const { error } = await deleteDrink(id);
  
  if (error) throw error;
};
