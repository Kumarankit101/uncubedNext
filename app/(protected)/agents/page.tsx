'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { AgentGrid } from '@/app/components/agents/AgentGrid';
import { AgentModal } from '@/app/components/agents/AgentModal';
import { AgentDetailModal } from '@/app/components/dashboard/AgentDetailModal';
import { ProjectSelector } from '@/app/components/dashboard/ProjectSelector';
import { CreateProjectModal } from '@/app/components/CreateProjectModal';
import { useProjects, type Project } from '@/lib/hooks/useProjects';
import { useAgents } from '@/lib/hooks/useAgents';
import { useThemeStore } from '@/lib/store/themeStore';
import type { ProjectFormData } from '@/app/components/EditProjectModal';

export default function Agents() {
  const searchParams = useSearchParams();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const initializedRef = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);
  const [selectedDetailAgent, setSelectedDetailAgent] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { theme } = useThemeStore();
  const { projects, loading: projectsLoading, createProject } = useProjects();
  const { agents, loading: agentsLoading, runAgent } = useAgents();

  // Handle pre-selected project from URL query params
  useEffect(() => {
    if (initializedRef.current || projects.length === 0) return;

    const projectId = searchParams.get('projectId');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        initializedRef.current = true;
      }
    } else if (!selectedProject) {
      // Auto-select first project if none selected
      setSelectedProject(projects[0]);
      initializedRef.current = true;
    }
  }, [searchParams, projects]);

  const handleAgentSelect = (agentId: string) => {
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }
    setSelectedAgentId(agentId);
    setIsModalOpen(true);
  };

  const handleAgentDetail = (agentId: string) => {
    setSelectedDetailAgent(agentId);
  };

  const handleAgentSubmit = async (agentId: string, projectId: string, input: string) => {
    try {
      await runAgent({
        projectId: projectId,
        agentId: agentId,
        inputData: {
          description: input,
          projectContext: selectedProject?.startupIdea
        }
      });

      console.log('Agent submitted successfully');
    } catch (error) {
      console.error('Error submitting agent:', error);
    }
  };

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateProjectSubmit = async (data: ProjectFormData) => {
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
      setSelectedProject(project);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="space-y-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>AI Agents</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>Choose an AI-powered agent to analyze and enhance your startup project.</p>
      </motion.div>

      {/* Project Selection */}
      {projectsLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-20 mb-8"
        >
          <div className="mb-4">
            <h2 className={`text-lg font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
            }`}>Select Project:</h2>
          </div>
          <ProjectSelector
            selectedProject={selectedProject}
            projects={projects}
            onProjectSelect={(project) => setSelectedProject(project)}
            onCreateProject={handleCreateProject}
            isOpen={isProjectSelectorOpen}
            onToggle={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
          />
        </motion.div>
      )}

      {/* Agent Grid */}
      {agentsLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
        </div>
      ) : (
        <div className="relative z-10">
          <AgentGrid onAgentSelect={handleAgentSelect} onAgentDetail={handleAgentDetail} agents={agents} />
        </div>
      )}

      {/* Agent Modal */}
      <AgentModal
        agentId={selectedAgentId}
        projectId={selectedProject?.id || null}
        projectTitle={selectedProject?.startupName}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAgentId(null);
        }}
        onSubmit={handleAgentSubmit}
        agents={agents}
      />

      {/* Agent Detail Modal */}
      <AgentDetailModal
        isOpen={!!selectedDetailAgent}
        onClose={() => setSelectedDetailAgent(null)}
        agent={selectedDetailAgent ? agents.find(a => a.id === selectedDetailAgent) || null : null}
        isSelected={false}
        onSelect={() => {
          if (selectedDetailAgent) {
            handleAgentSelect(selectedDetailAgent);
          }
          setSelectedDetailAgent(null);
        }}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
      />
    </div>
  );
}
