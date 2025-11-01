'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, Clock, MoreVertical, Eye, Play, Trash2, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Modal } from '@/app/components/ui/Modal';
import { EditProjectModal } from '@/app/components/EditProjectModal';
import { CreateProjectModal } from '@/app/components/CreateProjectModal';
import type { ProjectFormData } from '@/app/components/EditProjectModal';
import { useProjects } from '@/lib/hooks/useProjects';
import { useThemeStore } from '@/lib/store/themeStore';

export default function Projects() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      const project = await createProject({
        startupName: data.startupName,
        description: data.description,
        tagline: data.tagline,
        problem: data.problem,
        solution: data.solution,
        targetMarket: data.targetMarket,
        startupIdea: data.startupIdea
      });
      setIsCreateModalOpen(false);
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const handleEditProject = async (data: ProjectFormData) => {
    if (!selectedProject) return;

    try {
      await updateProject({
        id: selectedProject.id,
        projectData: {
          startupName: data.startupName,
          description: data.description,
          tagline: data.tagline,
          problem: data.problem,
          solution: data.solution,
          targetMarket: data.targetMarket,
          startupIdea: data.startupIdea
        }
      });
      setIsEditModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleViewDetails = (projectId: string) => {
    router.push(`/startup/${projectId}`);
  };

  const handleRunAgent = (projectId: string) => {
    router.push(`/agents?projectId=${projectId}`);
  };

  const openEditModal = (project: any) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const toggleDropdown = (projectId: string) => {
    setOpenDropdown(openDropdown === projectId ? null : projectId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`animate-spin rounded-full h-12 w-12 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between relative z-10"
      >
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>Projects</h1>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
          }`}>Manage your startup projects and track their progress.</p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          New Project
        </Button>
      </motion.div>

      <div className="relative z-10">
        {projects.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FolderOpen className={`w-10 h-10 ${
                theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
              }`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>No projects yet</h3>
            <p className={`mb-6 max-w-md mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>
              Create your first project to start analyzing and building your startup ideas with AI-powered tools.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <FolderOpen className={`w-6 h-6 ${
                        theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
                      }`} />
                    </div>

                    <div className="relative">
                      <button
                        className={`p-1 transition-colors ${
                          theme === 'dark'
                            ? 'text-gray-400 hover:text-white'
                            : 'text-light-500 hover:text-light-700'
                        }`}
                        onClick={() => toggleDropdown(project.id)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openDropdown === project.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`absolute right-0 top-8 border rounded-xl p-2 z-10 min-w-[160px] shadow-2xl ${
                            theme === 'dark'
                              ? 'bg-black border-white/20'
                              : 'bg-white border-gray-200'
                          }`}
                          style={{
                            boxShadow: theme === 'dark'
                              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          <button
                            onClick={() => openEditModal(project)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                                : 'text-light-700 hover:text-light-900 hover:bg-light-100'
                            }`}
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Project
                          </button>
                          <button
                            onClick={() => {
                              setProjectToDelete(project.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-light-900'
                  }`}>{project.startupName}</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>{project.description}</p>

                  <div className="flex items-center justify-end mb-4">
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                    }`}>{project.agentsRun || 0} agents run</div>
                  </div>

                  <div className={`flex items-center justify-between text-xs mb-4 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                  }`}>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {getTimeAgo(project.updatedAt)}
                    </div>
                    <div>Created {formatDate(project.createdAt)}</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="glass"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleViewDetails(project.id)}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleRunAgent(project.id)}
                    >
                      <Play className="w-4 h-4" />
                      Run Agent
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleEditProject}
        defaultValues={selectedProject}
      />

      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>Delete Project</h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>
              Are you sure you want to delete this project? This action cannot be undone and will remove all associated data.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="glass"
              onClick={() => setProjectToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDeleteProject(projectToDelete!)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>

      {openDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
