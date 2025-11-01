import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, HelpCircle, CheckSquare, Plus, Square, Box, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Modal } from '@/app/components/ui/Modal';
import { useThemeStore } from '@/lib/store/themeStore';

import { Agent } from '@/lib/hooks/useAgents';
import { AgentDetailModal } from '@/app/components/dashboard/AgentDetailModal';


interface MultipleAgentSelectorProps {
  selectedAgents: string[];
  onAgentToggle: (agentId: string) => void;
  onClearAll: () => void;
  onSelectAll: () => void;
  agents: Agent[];
  onAgentInstructions?: (agentId: string, instructions: string) => void;
}



export const MultipleAgentSelector: React.FC<MultipleAgentSelectorProps> = ({
  selectedAgents,
  onAgentToggle,
  onClearAll,
  onSelectAll,
  agents,
  onAgentInstructions
}) => {
  const { theme } = useThemeStore();
  const [selectedDetailAgent, setSelectedDetailAgent] = useState<string | null>(null);
  const [instructionAgent, setInstructionAgent] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertAgent, setAlertAgent] = useState<Agent | null>(null);
  
  // Group agents by category - include ALL agents, not just active ones
  const groupedAgents = agents.reduce<Record<string, Agent[]>>((acc, agent) => {
    const category = agent.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  const categoryOrder = [
    'IDEA VALIDATION',
    'BRAND & MARKETING',
    'PRODUCT BUILDER',
    'ALL-IN-ONE',
    'BUSINESS STRATEGY',
    'GROWTH & OPERATIONS',
    'PRODUCT STRATEGY'
  ];

  // Sort categories: by active status, then custom order
  const sortedCategories = Object.entries(groupedAgents).sort(([a, agentsA], [b, agentsB]) => {
    // First sort by whether category has active agents (active categories first)
    const hasActiveA = agentsA.some(agent => agent.isActive);
    const hasActiveB = agentsB.some(agent => agent.isActive);
    if (hasActiveA !== hasActiveB) {
      return hasActiveB ? 1 : -1;
    }

    // Then sort by custom order
    const indexA = categoryOrder.indexOf(a.toUpperCase());
    const indexB = categoryOrder.indexOf(b.toUpperCase());
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // If neither is in the order, sort alphabetically
    return a.localeCompare(b);
  }).map(([categoryKey, categoryAgents]) => {
    // Sort agents: active first, then alphabetically within each group
    const sortedAgents = categoryAgents.sort((a, b) => {
      // First sort by active status (active first)
      if (a.isActive !== b.isActive) {
        return b.isActive ? 1 : -1;
      }
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
    
    return [categoryKey, sortedAgents] as [string, Agent[]];
  });

  // Handle agent selection
  const handleAgentClick = (agent: Agent) => {
    if (!agent.isActive) return;

    // Check if selecting Pitch Deck Generator without Market Researcher
    if (agent.name === 'Pitch Deck Generator') {
      const marketResearcher = agents.find(a => a.name === 'Market Researcher');
      const isMarketResearcherSelected = marketResearcher && selectedAgents.includes(marketResearcher.id);

      if (!isMarketResearcherSelected) {
        setAlertAgent(agent);
        setShowAlertModal(true);
        return;
      }
    }



    onAgentToggle(agent.id);
  };

  // Only count active agents for "select all" functionality
  const activeAgents = agents.filter(agent => agent.isActive);
  const allActiveAgentsSelected = activeAgents.length > 0 && activeAgents.every(agent => selectedAgents.includes(agent.id));

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
          theme === 'dark' ? 'bg-gray-500/20' : 'bg-gray-200/60'
        }`}>
          <Box className={`w-8 h-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
        </div>
        <h3 className={`text-lg font-medium mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>No AI agents available</h3>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>AI agents will appear here once they're configured.</p>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header with Select All and Clear All */}
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
        <div>
          <h3 className={`text-xl font-semibold mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>AI Agents</h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
          }`}>Select the AI agents you want to run on your idea</p>
        </div>

        <div className="flex items-center gap-3">
          {!allActiveAgentsSelected && (
            <Button
              variant="glass"
              size="sm"
              onClick={onSelectAll}
              className="gap-2"
            >
              
              Select All Active
            </Button>
          )}

          {selectedAgents.length > 0 && (
            <Button
              variant="glass"
              size="sm"
              onClick={onClearAll}
              className="gap-2"
            >
              Clear All ({selectedAgents.length})
            </Button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Categories with Table Layout */}
      <div className="relative w-full">
         <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide w-full">
          {sortedCategories.map(([categoryKey, categoryAgents], categoryIndex) => {
            const categoryInfo = {
              name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
              description: 'AI-powered analysis tools',
              color: 'from-gray-500 to-gray-600'
            };

            const activeInCategory = categoryAgents.filter(agent => agent.isActive).length;
            const totalInCategory = categoryAgents.length;
            const hasActiveAgents = activeInCategory > 0;

            return (
               <motion.div
                 key={categoryKey}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: categoryIndex * 0.05 }}
                  className={`flex-shrink-0 w-[380px] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-black/30 border border-white/[0.12]'
                      : 'bg-white/80 border border-gray-200/60'
                  }`}
               >
                 {/* Category Header */}
                 <div className={`px-4 py-4 ${
                   theme === 'dark'
                     ? 'bg-white/[0.05] border-b border-white/[0.08]'
                     : 'bg-gray-50/80 border-b border-gray-200/60'
                 }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-r ${categoryInfo.color} rounded-lg flex items-center justify-center ${
                      !hasActiveAgents ? 'grayscale opacity-60' : ''
                    }`}>
                      <Folder className="w-4 h-4 text-white" />
                    </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${
                            hasActiveAgents
                              ? theme === 'dark' ? 'text-white' : 'text-light-900'
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {categoryInfo.name}
                          </h4>
                          <div className={`text-xs ${
                            hasActiveAgents
                              ? theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                              : theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            {activeInCategory}/{totalInCategory} active
                          </div>
                        </div>
                     </div>
                  </div>
                </div>

                 {/* Agents Cards */}
                 <div className="p-4 space-y-3">
                   {categoryAgents.map((agent, index) => {
                     const IconComponent = agent.icon;
                     const isSelected = selectedAgents.includes(agent.id);
                     const isActive = agent.isActive;

                     return (
                       <motion.div
                         key={agent.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: (categoryIndex * 0.05) + (index * 0.02) }}
                           className={`rounded-lg p-3 transition-all duration-200 ${
                             !isActive
                               ? theme === 'dark'
                                 ? 'bg-dark-800/25 border border-dark-600/50 opacity-70 cursor-not-allowed'
                                 : 'bg-gray-100/40 border border-gray-300/50 opacity-50 cursor-not-allowed'
                               : isSelected
                               ? 'bg-blue-500/10 hover:bg-blue-500/15 cursor-pointer border border-blue-500/30'
                               : theme === 'dark'
                               ? 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] cursor-pointer'
                               : 'bg-gray-50/60 border border-gray-200/60 hover:bg-gray-100/80 cursor-pointer'
                           }`}
                          onClick={() => handleAgentClick(agent)}
                       >
                          <div className="grid grid-cols-[1fr,36px,36px,60px,36px] gap-0 items-center">
                            {/* Agent Info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 bg-gradient-to-r ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0 ${
                                !isActive ? 'grayscale' : ''
                              }`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className={`font-medium text-sm ${
                                   isActive
                                     ? theme === 'dark' ? 'text-white' : 'text-light-900'
                                     : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                 }`}>
                                   {agent.name}
                                 </div>
                              </div>
                            </div>

                             {/* Help */}
                             <div className="flex justify-center">
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setSelectedDetailAgent(agent.id);
                                 }}
                                 className={`w-6 h-6 transition-colors flex items-center justify-center ${
                                   isActive
                                     ? theme === 'dark'
                                       ? 'text-gray-400 hover:text-blue-400'
                                       : 'text-gray-500 hover:text-blue-500'
                                     : theme === 'dark'
                                       ? 'text-gray-600 cursor-not-allowed'
                                       : 'text-gray-400 cursor-not-allowed'
                                 }`}
                                 disabled={!isActive}
                               >
                                 <HelpCircle className="w-4 h-4" />
                               </button>
                             </div>

                             {/* Instructions */}
                             <div className="flex justify-center">
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setInstructionAgent(agent.id);
                                   setInstructions('');
                                 }}
                                 className={`w-6 h-6 transition-colors flex items-center justify-center ${
                                   isActive
                                     ? theme === 'dark'
                                       ? 'text-gray-400 hover:text-blue-400'
                                       : 'text-gray-500 hover:text-blue-500'
                                     : theme === 'dark'
                                       ? 'text-gray-600 cursor-not-allowed'
                                       : 'text-gray-400 cursor-not-allowed'
                                 }`}
                                 disabled={!isActive}
                               >
                                 <Settings className="w-4 h-4" />
                               </button>
                             </div>

                             {/* Cost */}
                             <div className="flex justify-center">
                               <span className={`text-sm font-medium px-2 py-1 rounded ${
                                 isActive
                                   ? theme === 'dark'
                                     ? 'text-yellow-400 bg-yellow-400/10'
                                     : 'text-amber-600 bg-amber-100'
                                   : theme === 'dark'
                                     ? 'text-gray-600 bg-gray-600/10'
                                     : 'text-gray-400 bg-gray-200/60'
                               }`}>
                                 {agent.cost}
                               </span>
                             </div>

                             {/* Select/Action */}
                             <div className="flex justify-center">
                               {isActive ? (
                                 isSelected ? (
                                   <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                                     <CheckSquare className="w-3 h-3 text-white" />
                                   </div>
                                 ) : (
                                   <div className={`w-6 h-6 border rounded flex items-center justify-center hover:border-blue-400 transition-colors duration-200 ${
                                     theme === 'dark'
                                       ? 'border-gray-400 hover:border-blue-400'
                                       : 'border-gray-500 hover:border-blue-500'
                                   }`}>
                                     <Plus className={`w-3 h-3 transition-colors duration-200 ${
                                       theme === 'dark'
                                         ? 'text-gray-400 hover:text-blue-400'
                                         : 'text-gray-500 hover:text-blue-500'
                                     }`} />
                                   </div>
                                 )
                               ) : (
                                 <div className={`w-6 h-6 border rounded flex items-center justify-center opacity-40 ${
                                   theme === 'dark'
                                     ? 'border-gray-600/30'
                                     : 'border-gray-400/40'
                                 }`}>
                                   <Plus className={`w-3 h-3 ${
                                     theme === 'dark'
                                       ? 'text-gray-600/30'
                                       : 'text-gray-400/40'
                                   }`} />
                                 </div>
                               )}
                             </div>
                          </div>
                       </motion.div>
                     );
                   })}
                 </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Detail Modal */}
      <AgentDetailModal
        isOpen={!!selectedDetailAgent}
        onClose={() => setSelectedDetailAgent(null)}
        agent={selectedDetailAgent ? agents.find(a => a.id === selectedDetailAgent) || null : null}
        isSelected={selectedDetailAgent ? selectedAgents.includes(selectedDetailAgent) : false}
        onSelect={() => {
          if (selectedDetailAgent) {
            const agent = agents.find(a => a.id === selectedDetailAgent);
            if (agent && agent.isActive && !selectedAgents.includes(selectedDetailAgent)) {
              onAgentToggle(selectedDetailAgent);
            }
          }
          setSelectedDetailAgent(null);
        }}
      />

        {/* Instructions Modal */}
        <Modal
          isOpen={!!instructionAgent}
          onClose={() => setInstructionAgent(null)}
          title="Additional Instructions"
          size="md"
        >
          {instructionAgent && (
            <div className="space-y-6">
              {/* Agent Info */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-white/[0.03] border-white/[0.08]'
                  : 'bg-gray-50/80 border-gray-200/60'
              }`}>
                <div className="flex items-center gap-3">
                  {(() => {
                    const agent = agents.find(a => a.id === instructionAgent);
                    if (!agent) return null;
                    const IconComponent = agent.icon;
                    return (
                      <div className={`w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center ${
                        !agent.isActive ? 'grayscale' : ''
                      }`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>
                      {agents.find(a => a.id === instructionAgent)?.name}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                    }`}>
                      Customize this agent's behavior
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions Input */}
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-light-900'
                  }`}>
                    Custom Instructions
                  </label>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>
                    Add specific instructions, context, or preferences for this agent to consider.
                  </p>
                </div>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Example: Focus on B2B SaaS companies, emphasize technical architecture, include competitor analysis..."
                  className={`w-full h-40 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-white/[0.05] border-white/[0.12] text-white placeholder-gray-400 hover:bg-white/[0.08] focus:bg-white/[0.08]'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:bg-white hover:border-gray-300'
                  }`}
                />
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {instructions.length}/1000 characters
                </div>
              </div>

              {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="glass"
                  onClick={() => setInstructionAgent(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (onAgentInstructions && instructionAgent) {
                      onAgentInstructions(instructionAgent, instructions);
                    }
                    setInstructionAgent(null);
                  }}
                  disabled={!instructions.trim()}
                >
                  Save Instructions
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Alert Modal for Agent Dependencies */}
        <Modal
          isOpen={showAlertModal}
          onClose={() => setShowAlertModal(false)}
          title="Agent Dependency Notice"
          size="md"
        >
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${
              theme === 'dark'
                ? 'bg-white/[0.03] border-white/[0.08]'
                : 'bg-gray-50/80 border-gray-200/60'
            }`}>
              <div className="flex items-center gap-3">
                {alertAgent && (() => {
                  const IconComponent = alertAgent.icon;
                  return (
                    <div className={`w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-light-900'
                  }`}>
                    {alertAgent?.name} Dependency
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>
                    This agent works better with data from another agent
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                 {alertAgent?.name === 'Pitch Deck Generator' ? (
                   <>
                     The Pitch Deck Generator uses data from the Market Researcher to create comprehensive and data-driven pitch decks.
                     For the best results, please select the Market Researcher agent as well to ensure your pitch deck contains real market data and insights.
                   </>
                 ) : (
                   'This agent works better when combined with related agents for optimal results.'
                 )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="glass"
                size="sm"
                className="min-w-[140px]"
                onClick={() => {
                  // Select only the current agent
                  if (alertAgent && !selectedAgents.includes(alertAgent.id)) {
                    onAgentToggle(alertAgent.id);
                  }
                  setShowAlertModal(false);
                  setAlertAgent(null);
                }}
              >
                Select Only {alertAgent?.name}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="min-w-[140px]"
                onClick={() => {
                  // Select both agents based on the dependency
                  if (alertAgent?.name === 'Pitch Deck Generator') {
                    const marketResearcher = agents.find(a => a.name === 'Market Researcher');
                    if (marketResearcher && !selectedAgents.includes(marketResearcher.id)) {
                      onAgentToggle(marketResearcher.id);
                    }
                  }

                  if (alertAgent && !selectedAgents.includes(alertAgent.id)) {
                    onAgentToggle(alertAgent.id);
                  }
                  setShowAlertModal(false);
                  setAlertAgent(null);
                }}
              >
                Select Both Agents
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };