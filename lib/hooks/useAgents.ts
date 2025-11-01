import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import { useApiClient } from '@/lib/useApiClient';

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
  slug?: string;
  agentUrl?: string;
  outputExample?: string;
  promptTemplate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useAgents = () => {
  const { callApi } = useApiClient();
  const queryClient = useQueryClient();

  const { data: rawAgents = [], isLoading: loading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await callApi('/agents') as { agents: any[] };
      return response.agents || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const enrichedAgents = useMemo(() => {
    const colors = [
      'from-green-500 to-emerald-500',
      'from-orange-500 to-amber-500',
      'from-blue-500 to-cyan-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-purple-500'
    ];
    const agentResult = rawAgents.map((agent: any, index: number) => ({
      ...agent,
      color: colors[index % colors.length],
      icon: (Icons as any)[agent.icon] || Icons.Eye
    }));
    return agentResult
  }, [rawAgents]);

  const runAgentMutation = useMutation({
    mutationFn: async (agentData: {
      projectId: string;
      agentId: string;
      inputData: any;
    }) => {
      const response = await callApi('/agents/run', { method: 'POST', body: JSON.stringify(agentData) }) as { agentRun: any };
      return response.agentRun;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });

  return {
    agents: enrichedAgents,
    loading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch agents') : null,
    runAgent: runAgentMutation.mutateAsync,
  };
};
