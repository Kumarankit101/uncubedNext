import React, { useState, useEffect } from 'react';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';

type DraftType = {
  startupName: string;
  problem: string;
  solution: string;
  tagline: string;
  startupIdea: string;
  targetMarket: string;
  description: string;
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: DraftType | null;
  onConfirm: (editedDraft: DraftType | null) => void;
  onRegenerate: () => void;
  generationStatus: 'idle' | 'loading' | 'success' | 'error';
  creationStatus: 'idle' | 'loading' | 'success' | 'error';
  validationErrors: Record<string, string>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  draft,
  onConfirm,
  onRegenerate,
  generationStatus,
  creationStatus,
  validationErrors
}) => {
  const { theme } = useThemeStore();
  const [editedDraft, setEditedDraft] = useState(draft);

  useEffect(() => {
    setEditedDraft(draft);
  }, [draft]);

  if (!draft || !editedDraft) return null;

  const handleFieldChange = (field: keyof typeof editedDraft, value: string) => {
    setEditedDraft(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleConfirm = () => {
    if (editedDraft) {
      onConfirm(editedDraft);
    }
  };

  const fields = [
    { key: 'startupName' as const, label: 'Startup Name', required: true },
    { key: 'tagline' as const, label: 'Tagline' },
    { key: 'startupIdea' as const, label: 'Startup Idea', required: true },
    { key: 'problem' as const, label: 'Problem' },
    { key: 'solution' as const, label: 'Solution' },
    { key: 'targetMarket' as const, label: 'Target Market' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Your Startup Details"
      size="lg"
      closeOnBackdrop={false}
    >
      <div className="space-y-6">
        {fields.map(({ key, label, required }) => (
          <div key={key}>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
            }`}>
              {label}{required ? ' *' : ''}
            </label>
            {key === 'startupIdea' || key === 'problem' || key === 'solution' || key === 'targetMarket' ? (
              <textarea
                value={editedDraft[key]}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                disabled={creationStatus === 'loading'}
                className={`w-full px-4 py-3 rounded-xl h-24 resize-none transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
                } ${creationStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            ) : (
              <input
                type="text"
                value={editedDraft[key]}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                disabled={creationStatus === 'loading'}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20 focus:bg-white/[0.08]'
                    : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:bg-gray-50'
                } ${creationStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            )}
            {validationErrors[key] && (
              <p className="text-red-400 text-sm mt-1">{validationErrors[key]}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="glass"
            onClick={onClose}
            disabled={creationStatus === 'loading'}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="glass"
            onClick={onRegenerate}
            loading={generationStatus === 'loading'}
            disabled={creationStatus === 'loading'}
          >
            Regenerate
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            loading={creationStatus === 'loading'}
            disabled={generationStatus === 'loading'}
          >
            Confirm & Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};