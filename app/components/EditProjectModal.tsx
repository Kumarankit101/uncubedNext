import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';

export interface ProjectFormData {
  startupName: string;
  description: string;
  tagline?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  startupIdea: string;
}

export interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  defaultValues?: ProjectFormData;
  title?: string;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  title = 'Edit Project',
}) => {
  const { theme } = useThemeStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>();

  // Populate form when defaultValues or open state changes
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof ProjectFormData, value as any);
      });
    } else {
      reset();
    }
  }, [defaultValues, isOpen, reset, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                  : 'bg-white border border-gray-400/70 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
              }`}
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
             className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
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
             className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
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
             className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
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
             className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
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
             className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
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
             className={`w-full px-4 py-3 rounded-xl h-32 resize-none transition-all duration-200 ${
               theme === 'dark'
                 ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                 : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
             }`}
           />
          {errors.startupIdea && (
            <p className="text-red-400 text-sm mt-1">{errors.startupIdea.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button type="button" variant="glass" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};