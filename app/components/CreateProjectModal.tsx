import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';
import type { ProjectFormData } from '@/app/components/EditProjectModal';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => Promise<any>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { theme } = useThemeStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      reset();
      onClose();
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Create New Project"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Startup Name
          </label>
          <input
            {...register('startupName', { required: 'Startup name is required' })}
            type="text"
            placeholder="Enter your startup name..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.startupName && (
            <p className="text-red-400 text-sm mt-1">{errors.startupName.message}</p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Brief description of your project..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Tagline
          </label>
          <input
            {...register('tagline')}
            type="text"
            placeholder="Enter a tagline..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Problem
          </label>
          <textarea
            {...register('problem')}
            placeholder="Describe the problem..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Solution
          </label>
          <textarea
            {...register('solution')}
            placeholder="Describe the solution..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Target Market
          </label>
          <textarea
            {...register('targetMarket')}
            placeholder="Describe the target market..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
          }`}>
            Startup Idea
          </label>
          <textarea
            {...register('startupIdea', { required: 'Startup idea is required' })}
            placeholder="Describe your startup idea in detail..."
            disabled={isSubmitting}
            className={`w-full px-4 py-3 rounded-xl h-32 resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {errors.startupIdea && (
            <p className="text-red-400 text-sm mt-1">{errors.startupIdea.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="glass"
            disabled={isSubmitting}
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};