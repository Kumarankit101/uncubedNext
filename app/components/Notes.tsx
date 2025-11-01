import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Edit3, Plus } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { useApiClient } from '@/lib/useApiClient';
import type { StartupDetailData } from '@/lib/types';
import { useThemeStore } from '@/lib/store/themeStore';

interface NotesProps {
  notes: StartupDetailData['notes'];
  projectId: string;
}

export const Notes: React.FC<NotesProps> = ({ notes: initialNotes, projectId }) => {
  const { theme } = useThemeStore();
  const [notesText, setNotesText] = useState(initialNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editText, setEditText] = useState(initialNotes);
  const { callApi } = useApiClient();

  const openModal = () => {
    setEditText(notesText);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditText(notesText);
  };

  const saveNotes = async () => {
    try {
      await callApi(`/projects/${projectId}/notes`, {
        method: 'PUT',
        body: JSON.stringify({ content: editText }),
      });
      setNotesText(editText);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const hasNotes = notesText.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <div className={`p-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-400/70'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>Notes</h3>
            <Button variant="glass" size="sm" onClick={openModal} className="gap-2">
              {hasNotes ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {hasNotes ? 'Edit' : 'Add Notes'}
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className={`text-sm whitespace-pre-wrap break-words ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>
            {notesText || 'No notes yet.'}
          </div>
        </div>
      </Card>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={hasNotes ? 'Edit Notes' : 'Add Notes'}
        size="xl"
      >
        <div className="space-y-6">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter your notes..."
            className={`w-full h-64 px-3 py-2 rounded-lg resize-none focus:outline-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-400 focus:border-white/20'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500'
            }`}
          />
          <div className="flex items-center justify-end space-x-2">
            <Button variant="glass" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveNotes}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};