import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';
import { Agent } from '@/lib/hooks/useAgents';

interface AgentModalProps {
  agentId: string | null;
  projectId: string | null;
  projectTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentId: string, projectId: string, input: string) => void;
  agents: Agent[];
}

interface FormData {
  input: string;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  agentId,
  projectId,
  projectTitle,
  isOpen,
  onClose,
  onSubmit,
  agents
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const agent = agentId ? agents.find(a => a.id === agentId) : null;
  const IconComponent = agent ? agent.icon : null;

  const handleFormSubmit = async (data: FormData) => {
    if (!agentId || !projectId) return;
    
    setLoading(true);
    try {
      await onSubmit(agentId, projectId, data.input);
      reset();
      onClose();
    } catch (error) {
      console.error('Agent submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!agent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${agent.name} - ${projectTitle}`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 flex items-center justify-center">
            {IconComponent && <IconComponent className={`w-6 h-6 ${
              theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
            }`} />}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>{agent.name}</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>{agent.description}</p>
          </div>
        </div>

        <div className={`border rounded-xl p-4 ${
          theme === 'dark'
            ? 'bg-blue-500/10 border-blue-500/20'
            : 'bg-blue-50/50 border-blue-200/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>Project: {projectTitle}</span>
            <span className="text-yellow-400 font-medium">Cost: {agent.cost} credits</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
            }`}>
              Additional Instructions
            </label>
            <textarea
              {...register('input')}
              placeholder={`Describe what aspects of "${projectTitle}" you want to achieve with ${agent.name}...`}
              className={`w-full px-4 py-3 rounded-xl h-32 resize-none ${
                theme === 'dark'
                  ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400'
                  : 'bg-light-100/50 border border-light-300/30 text-light-900 placeholder-light-500'
              }`}
            />
            {errors.input && (
              <p className="text-red-400 text-sm mt-1">{errors.input.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="glass"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Run Analysis ({agent.cost} credits)
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};