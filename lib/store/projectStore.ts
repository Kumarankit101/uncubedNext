import { create } from 'zustand';
import { Project, AgentResult } from '@/lib/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  results: AgentResult[];
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setResults: (results: AgentResult[]) => void;
  addResult: (result: AgentResult) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  results: [],
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  setResults: (results) => set({ results }),
  addResult: (result) => set((state) => ({ 
    results: [...state.results, result] 
  })),
}));