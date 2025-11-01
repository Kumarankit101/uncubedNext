import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/useApiClient';

export interface Plan {
  id: string;
  name: string;
  description?: string;
  features?: any[];
  monthlyPrice: number;
  monthlyCredits: number;
  isActive: boolean;
}

export default function usePlans() {
  const { callApi } = useApiClient();

  const { data: plans = [], isLoading: loading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const data = await callApi<{ plans: Plan[] }>('/plans');
      return data.plans.filter(p => p.isActive);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (plans change rarely)
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    plans,
    loading,
    error: error ? (error instanceof Error ? error.message : 'Failed to load plans') : null,
  };
}