import React from 'react';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';
import { Agent } from '@/lib/hooks/useAgents';

interface AgentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  isSelected: boolean;
  onSelect: () => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  isOpen,
  onClose,
  agent,
  isSelected,
  onSelect
}) => {
  const { theme } = useThemeStore();

  if (!agent) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Agent Header */}
        <div className="flex items-start gap-4">
          {(() => {
            const IconComponent = agent.icon;
            return (
              <div className={`w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center ${
                !agent.isActive ? 'grayscale' : ''
              }`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            );
          })()}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>{agent.name}</h3>
              {!agent.isActive && (
                <div className={`px-2 py-1 text-xs rounded-full ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  Coming Soon
                </div>
              )}
            </div>
            <p className={`leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>{agent.description}</p>
          </div>
        </div>

        {/* Output Example */}
        {agent.outputExample && (
          <div>
            <h4 className={`text-lg font-semibold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>Example Output</h4>
            <div className={`rounded-lg p-4 border ${
              theme === 'dark'
                ? 'bg-white/[0.03] border-white/[0.08]'
                : 'bg-gray-50/80 border-gray-200/60'
            }`}>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-light-700'
              }`}>{agent.outputExample}</p>
            </div>
          </div>
        )}

        {/* Cost */}
        <div className={`flex items-center justify-center p-4 rounded-xl border ${
          theme === 'dark'
            ? 'bg-white/[0.03] border-white/[0.08]'
            : 'bg-gray-50/80 border-gray-200/60'
        }`}>
          <div className="text-center">
            <div className={`font-medium ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>Cost</div>
            <div className={`font-semibold ${
              theme === 'dark' ? 'text-yellow-400' : 'text-amber-600'
            }`}>{agent.cost} credits</div>
          </div>
        </div>

        {/* Agent Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="glass"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={onSelect}
            disabled={!agent.isActive || isSelected}
          >
            {!agent.isActive
              ? 'Coming Soon'
              : isSelected
              ? 'Already Selected'
              : 'Select Agent'
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
};