import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';
import { Agent } from '@/lib/hooks/useAgents';

interface AgentGridProps {
  onAgentSelect: (agentId: string) => void;
  onAgentDetail?: (agentId: string) => void;
  agents: Agent[];
}

// Removed category mapping - now showing all agents in a single list



export const AgentGrid: React.FC<AgentGridProps> = ({ onAgentSelect, onAgentDetail, agents }) => {
  const { theme } = useThemeStore();
  
  // Filter and sort active agents alphabetically
  const activeAgents = agents
    .filter(agent => agent.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
          theme === 'dark' ? 'bg-gray-500/20' : 'bg-light-300/30'
        }`}>
          <Icons.Box className={`w-8 h-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-light-500'
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
    <div className="space-y-8">
      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeAgents.map((agent, index) => {
                const IconComponent = agent.icon;
                
                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                     <Card
                       hover={true}
                       className="h-full relative transition-all duration-200 cursor-pointer"
                     >
                       <div></div>

                       <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAgentDetail?.(agent.id);
                            }}
                            className={`w-6 h-6 transition-colors rounded-full flex items-center justify-center ${
                              theme === 'dark'
                                ? 'text-gray-400 hover:text-blue-400'
                                : 'text-light-500 hover:text-blue-500'
                            }`}
                          >
                           <HelpCircle className="w-4 h-4" />
                         </button>
                       </div>
                      
                       <div className="w-10 h-10 flex items-center justify-center mb-3">
                         <IconComponent className={`w-5 h-5 ${
                           theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
                         }`} />
                       </div>
                      
                       <h4 className={`text-base font-semibold mb-2 pr-8 ${
                         theme === 'dark' ? 'text-white' : 'text-light-900'
                       }`}>
                         {agent.name}
                       </h4>
                       <p className={`text-sm mb-4 flex-grow line-clamp-2 ${
                         theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                       }`}>
                         {agent.description}
                       </p>
                      
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            
                         
                               <span className={`text-sm font-medium px-2 py-1 rounded ${
                                  theme === 'dark'
                                     ? 'text-yellow-400 bg-yellow-400/10'
                                     : 'text-amber-600 bg-amber-100'
                                  
                               }`}>
                                 {agent.cost}
                               </span>
                        
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-500' : 'text-light-600'
                            }`}>
                              credits
                            </span>
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onAgentSelect(agent.id)}
                          >
                            Run
                          </Button>
                       </div>
                    </Card>
                  </motion.div>
                );
              })}
      </div>

    </div>
  );
};