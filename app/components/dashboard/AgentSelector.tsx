import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { aiAgents } from '@/lib/data/aiAgents';
// TODO Phase 5: Replace wildcard import with icon map for tree-shaking
// Dynamic icon lookup based on database agent.icon property
import * as Icons from 'lucide-react';

interface AgentSelectorProps {
  selectedAgent: string | null;
  onAgentSelect: (agentId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgent,
  onAgentSelect,
  isOpen,
  onToggle
}) => {
  const selectedAgentData = selectedAgent ? aiAgents.find(a => a.id === selectedAgent) : null;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center justify-between p-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] rounded-xl transition-all duration-200 min-w-[200px]"
      >
        <div className="flex items-center gap-2">
          {selectedAgentData ? (
            <>
              <div className={`w-6 h-6 ${selectedAgentData.color} rounded-lg flex items-center justify-center`}>
                {React.createElement((Icons as any)[selectedAgentData.icon], { className: "w-3 h-3 text-white" })}
              </div>
              <span className="text-white font-medium text-sm">{selectedAgentData.name}</span>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Select AI Agent</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-xl p-2 z-50 max-h-64 overflow-y-auto min-w-[300px]"
        >
          <div className="space-y-1">
            {aiAgents.map((agent) => {
              const IconComponent = (Icons as any)[agent.icon];
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    onAgentSelect(agent.id);
                    onToggle();
                  }}
                  className="w-full p-3 text-left hover:bg-white/[0.08] rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${agent.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{agent.name}</div>
                      <div className="text-gray-400 text-xs">{agent.description.substring(0, 60)}...</div>
                    </div>
                    <div className="text-yellow-400 text-xs font-medium">{agent.cost} credits</div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};