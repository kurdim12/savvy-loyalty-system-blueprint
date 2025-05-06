
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchCommunityGoals, 
  fetchActiveCommunityGoals,
  fetchCommunityGoalById,
  createCommunityGoal, 
  updateCommunityGoal, 
  deleteCommunityGoal,
  contributeToGoal
} from '@/services/communityGoals';
import type { 
  CommunityGoalRow, 
  CreateCommunityGoalInput,
  UpdateCommunityGoalInput,
  ContributeToGoalInput
} from '@/types/communityGoals';
import { toast } from 'sonner';

// Query keys for React Query
export const communityGoalsKeys = {
  all: ['community-goals'] as const,
  lists: () => [...communityGoalsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown> = {}) => [
    ...communityGoalsKeys.lists(),
    filters
  ] as const,
  actives: () => [...communityGoalsKeys.all, 'active'] as const,
  details: () => [...communityGoalsKeys.all, 'detail'] as const,
  detail: (id: string) => [...communityGoalsKeys.details(), id] as const,
};

/**
 * Hook to fetch all community goals
 */
export function useCommunityGoals() {
  return useQuery({
    queryKey: communityGoalsKeys.lists(),
    queryFn: fetchCommunityGoals,
  });
}

/**
 * Hook to fetch only active community goals
 */
export function useActiveCommunityGoals() {
  return useQuery({
    queryKey: communityGoalsKeys.actives(),
    queryFn: fetchActiveCommunityGoals,
  });
}

/**
 * Hook to fetch a single community goal
 */
export function useCommunityGoal(id: string) {
  return useQuery({
    queryKey: communityGoalsKeys.detail(id),
    queryFn: () => fetchCommunityGoalById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new community goal
 */
export function useCreateCommunityGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (goal: CreateCommunityGoalInput) => createCommunityGoal(goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.lists() });
      toast.success('Community goal created successfully');
    },
    onError: (error) => {
      console.error('Failed to create community goal:', error);
      toast.error(`Failed to create community goal: ${(error as Error).message}`);
    },
  });
}

/**
 * Hook to update an existing community goal
 */
export function useUpdateCommunityGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (goal: UpdateCommunityGoalInput) => updateCommunityGoal(goal),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.lists() });
      toast.success('Community goal updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update community goal:', error);
      toast.error(`Failed to update community goal: ${(error as Error).message}`);
    },
  });
}

/**
 * Hook to delete a community goal
 */
export function useDeleteCommunityGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCommunityGoal(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.lists() });
      toast.success('Community goal deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete community goal:', error);
      toast.error(`Failed to delete community goal: ${(error as Error).message}`);
    },
  });
}

/**
 * Hook to contribute points to a community goal
 */
export function useContributeToGoal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contribution: ContributeToGoalInput) => contributeToGoal(contribution),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.detail(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: communityGoalsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['recentTransactions'] });
      toast.success(`Successfully contributed ${variables.points} points!`);
    },
    onError: (error) => {
      console.error('Failed to contribute to goal:', error);
      toast.error(`Failed to contribute: ${(error as Error).message}`);
    },
  });
}
