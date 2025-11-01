import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/useApiClient';

export interface Project {
  id: string;
  profileId: string;
  startupName: string;
  description: string;
  tagline?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  startupIdea: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  results?: any;
  createdAt: string;
  updatedAt: string;
  agentsRun?: number;
  lastActivity?: string;
}

export const useProjects = () => {
  const { callApi } = useApiClient();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = (await callApi('/projects')) as { projects: Project[] };
      return response.projects || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: {
      startupName: string;
      description: string;
      tagline?: string;
      problem?: string;
      solution?: string;
      targetMarket?: string;
      startupIdea: string;
    }) => {
      const response = (await callApi('/projects', { method: 'POST', body: JSON.stringify(projectData) })) as { project: Project };
      return response.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, projectData }: {
      id: string;
      projectData: {
        startupName?: string;
        description?: string;
        tagline?: string;
        problem?: string;
        solution?: string;
        targetMarket?: string;
        startupIdea?: string;
        status?: string;
      };
    }) => {
      const response = (await callApi(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(projectData) })) as { project: Project };
      return response.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await callApi(`/projects/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    projects,
    loading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch projects') : null,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
  };
};
