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

export const useProjects = (opts?: { initialData?: Project[] }) => {
  const { callApi } = useApiClient();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = (await callApi('/projects')) as { projects: Project[] };
      return response.projects || [];
    },
    staleTime: 60 * 1000, // 1 minute (align with server revalidate)
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: opts?.initialData,
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
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
      if (secret && typeof window !== 'undefined') {
        try {
          fetch(`/api/revalidate?token=${secret}&tag=projects`, { method: 'POST' });
          if (project?.id) fetch(`/api/revalidate?token=${secret}&tag=project:${project.id}`, { method: 'POST' });
        } catch {}
      }
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
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
      if (secret && typeof window !== 'undefined') {
        try {
          fetch(`/api/revalidate?token=${secret}&tag=projects`, { method: 'POST' });
          if (project?.id) fetch(`/api/revalidate?token=${secret}&tag=project:${project.id}`, { method: 'POST' });
        } catch {}
      }
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await callApi(`/projects/${id}`, { method: 'DELETE' });
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;
      if (secret && typeof window !== 'undefined') {
        try {
          fetch(`/api/revalidate?token=${secret}&tag=projects`, { method: 'POST' });
          if (id) fetch(`/api/revalidate?token=${secret}&tag=project:${id}`, { method: 'POST' });
        } catch {}
      }
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
