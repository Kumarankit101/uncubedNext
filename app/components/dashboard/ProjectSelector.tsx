import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';
import type { Project } from '@/lib/hooks/useProjects';

interface ProjectSelectorProps {
  selectedProject: Project | null;
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onCreateProject: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  selectedProject,
  projects,
  onProjectSelect,
  onCreateProject,
  isOpen,
  onToggle
}) => {
  const { theme } = useThemeStore();
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-white/[0.08] hover:bg-white/[0.12] border-white/[0.12]'
            : 'bg-light-100/50 hover:bg-light-200/60 border-light-300/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <FolderOpen className={`w-4 h-4 ${theme === 'dark' ? 'text-[#EBB207]' : 'text-black'}`} />
          </div>
          <div className="text-left">
            <div className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>
              {selectedProject ? selectedProject.startupName : 'Select Project'}
            </div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>
              {selectedProject ? selectedProject.description.substring(0, 40) + '...' : 'Choose a project to run AI agents'}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          theme === 'dark' ? 'text-gray-400' : 'text-light-500'
        } ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-transparent z-30"
            onClick={onToggle}
          />
          
          {/* Dropdown content */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full left-0 right-0 mt-2 border rounded-xl p-2 z-40 max-h-[400px] overflow-y-auto shadow-2xl ${
              theme === 'dark'
                ? 'bg-black border-white/20'
                : 'bg-light-50 border-light-300/40'
            }`}
            style={{
              boxShadow: theme === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Button
              variant="glass"
              size="sm"
              className="w-full justify-start mb-2"
              onClick={() => {
                onCreateProject();
                onToggle();
              }}
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </Button>
            
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project);
                    onToggle();
                  }}
                  className={`w-full p-3 text-left rounded-lg transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'hover:bg-white/[0.08]'
                      : 'hover:bg-light-200/40'
                  }`}
                >
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>{project.startupName}</div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                    }`}>{project.description.substring(0, 50)}...</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};