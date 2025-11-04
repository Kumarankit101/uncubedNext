import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/useApiClient';

export default function useCredits(opts?: { initialData?: number }) {
  const { callApi } = useApiClient();

  const { data: credits = 0 } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const data = await callApi<{ credits: { balance: number } }>('/credits');
      return data.credits.balance;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (credits may change more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    initialData: opts?.initialData,
  });

  return credits;
}
