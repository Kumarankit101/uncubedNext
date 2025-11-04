'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MultipleAgentSelector } from '@/app/components/dashboard/MultipleAgentSelector';
import { ReviewModal } from '@/app/components/ReviewModal';
import { useThemeStore } from '@/lib/store/themeStore';
import { useProjects } from '@/lib/hooks/useProjects';
import { useAgents } from '@/lib/hooks/useAgents';
import { useApiClient } from '@/lib/useApiClient';

type DraftType = {
  startupName: string;
  problem: string;
  solution: string;
  tagline: string;
  startupIdea: string;
  targetMarket: string;
  description: string;
};

interface DashboardClientProps {
  initialAgents: any[];
  initialProjects: any[];
}

export default function DashboardClient({ initialAgents, initialProjects }: DashboardClientProps) {
  const { theme } = useThemeStore();
  const [appIdea, setAppIdea] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<DraftType | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [creationStatus, setCreationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeValidationErrors, setActiveValidationErrors] = useState<Record<string, string>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { createProject } = useProjects({ initialData: initialProjects });
  const { agents, loading: agentsLoading, runAgent } = useAgents({ initialData: initialAgents });
  const router = useRouter();
  const { callApi } = useApiClient();

  const activeAgents = useMemo(() => agents.filter(agent => agent.isActive), [agents]);

  const resetReviewState = useCallback(() => {
    setReviewModalOpen(false);
    setGeneratedDraft(null);
    setGenerationStatus('idle');
    setCreationStatus('idle');
    setActiveValidationErrors({});
  }, []);

  const validateDraft = useCallback((draft: DraftType | null): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!draft?.startupName?.trim()) {
      errors.startupName = 'Startup name is required';
    }
    if (!draft?.startupIdea?.trim()) {
      errors.startupIdea = 'Startup idea is required';
    }
    if (draft?.startupName && draft.startupName.length > 100) {
      errors.startupName = 'Startup name must be less than 100 characters';
    }
    if (draft?.tagline && draft.tagline.length > 200) {
      errors.tagline = 'Tagline must be less than 200 characters';
    }
    return errors;
  }, []);

  const normalizeDraft = useCallback((draft: DraftType | null): DraftType | null => {
    if (!draft) return null;
    return {
      ...draft,
      startupName: draft.startupName.trim(),
      problem: draft.problem.trim(),
      solution: draft.solution.trim(),
      tagline: draft.tagline.trim(),
      startupIdea: draft.startupIdea.trim(),
      targetMarket: draft.targetMarket.trim(),
      description: draft.description.trim()
    };
  }, []);

  // Check for pending startup idea and selected agents from landing page
  useEffect(() => {
    const pendingIdea = localStorage.getItem('pendingStartupIdea');
    const pendingAgents = localStorage.getItem('pendingSelectedAgents');

    if (pendingIdea) {
      setAppIdea(pendingIdea);
      localStorage.removeItem('pendingStartupIdea');
    }

    if (agents.length > 0 && pendingAgents) {
      try {
        const agentIds: string[] = JSON.parse(pendingAgents);
        const validIds = agentIds.filter(id => agents.some(a => a.id === id));
        setSelectedAgents(validIds);
      } catch (error) {
        console.error('Error parsing pending agents:', error);
      } finally {
        localStorage.removeItem('pendingSelectedAgents');
      }
    }
  }, [agents]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.max(50, Math.min(140, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > 140 ? 'auto' : 'hidden';
    }
  }, [appIdea]);

  const handleAgentToggle = useCallback((agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent || !agent.isActive) return;

    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  }, [agents]);

  const handleSelectAllAgents = useCallback(() => {
    setSelectedAgents(activeAgents.map(agent => agent.id));
  }, [activeAgents]);

  const handleClearAllAgents = useCallback(() => {
    setSelectedAgents([]);
  }, []);

  const generatePreliminaryInfo = useCallback(async () => {
    setGenerationStatus('loading');
    try {
      let startupName = `Analysis: ${appIdea.substring(0, 50)}...`;
      let problem = '';
      let solution = '';
      let tagline = '';
      let startupIdea = '';
      let targetMarket = '';

      const infoRes = (await callApi('/agents/generate-preliminary-info', {
        method: 'POST',
        body: JSON.stringify({ startupIdea: appIdea })
      })) as { startupName: string; problem: string; solution: string; tagline: string; startupIdea: string; targetMarket: string };

      startupName = infoRes.startupName || startupName;
      problem = infoRes.problem || '';
      solution = infoRes.solution || '';
      tagline = infoRes.tagline || '';
      startupIdea = infoRes.startupIdea || '';
      targetMarket = infoRes.targetMarket || '';

      const draft: DraftType = {
        startupName,
        problem,
        solution,
        tagline,
        startupIdea,
        targetMarket,
        description: `startupName: ${startupName}\n\n idea: ${appIdea}`
      };

      setGeneratedDraft(draft);
      setGenerationStatus('success');
      setReviewModalOpen(true);
    } catch (err) {
      console.error('Error generating preliminary info:', err);
      setGenerationStatus('error');
    }
  }, [appIdea, callApi]);

  const handleRunAgents = useCallback(async () => {
    if (selectedAgents.length === 0 || !appIdea.trim()) {
      return;
    }

    setIsProcessing(true);
    await generatePreliminaryInfo();
    setIsProcessing(false);
  }, [selectedAgents, appIdea, generatePreliminaryInfo]);

  const handleConfirmProject = useCallback(async (editedDraft: DraftType | null) => {
    if (!editedDraft) return;

    const normalized = normalizeDraft(editedDraft);
    if (!normalized) return;

    const errors = validateDraft(normalized);
    setActiveValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setCreationStatus('loading');
    try {
      const project = await createProject(normalized);

      for (const agentId of selectedAgents) {
        const agent = agents.find(a => a.id === agentId);
        if (!agent || !agent.isActive) continue;

        try {
          await runAgent({
            projectId: project.id,
            agentId: agentId,
            inputData: {
              description: `startupName: ${editedDraft.startupName}\n\n idea: ${appIdea}\n\ntargetMarket: ${editedDraft.targetMarket}`
            }
          });
        } catch (error) {
          console.error(`Error running agent ${agentId}:`, error);
        }
      }

      setAppIdea('');
      setSelectedAgents([]);
      setReviewModalOpen(false);
      setGeneratedDraft(null);
      setGenerationStatus('idle');
      setCreationStatus('idle');

      router.push(`/startup/${project.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setCreationStatus('error');
    }
  }, [createProject, selectedAgents, agents, runAgent, appIdea, router, normalizeDraft, validateDraft]);

  const canRunAgents = selectedAgents.length > 0 && appIdea.trim() && !isProcessing;

  return (
    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.h1
          className="leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(46px, 6vw, 82px)', marginTop: '0px' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className={`block ${theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>
            Think it. Build it. Launch it.
          </span>
        </motion.h1>
        <motion.p
          className={`text-lg md:text-lg max-w-4xl mx-auto leading-relaxed mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-light-600'
            }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2}}
        >
          Select AI agents and describe your idea to get comprehensive analysis.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mb-12"
      >
        <div className="mx-auto" style={{ maxWidth: '720px' }}>
          <div className="relative">
            <div className={`relative p-8 border shadow-xl transition-all duration-200 ${theme === 'dark'
                ? 'bg-[#0A0A0A] backdrop-blur-sm border-white/20 focus-within:border-white shadow-black/20'
                : 'bg-white/90 backdrop-blur-sm border-gray-200/60 focus-within:border-black shadow-gray-200/60'
              }`} style={{ height: '240px', borderRadius: '30px', boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : '0 0 15px rgba(0,0,0,0.1)' }}>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  placeholder="The more detailed your description, the better our AI can help "
                  className={`textarea-scroll w-full px-2 py-2 pr-20 bg-transparent text-base resize-none focus:outline-none leading-relaxed transition-colors ${theme === 'dark'
                      ? 'text-white placeholder-gray-400 focus:text-white'
                      : 'text-gray-900 placeholder-gray-500 focus:text-gray-900'
                    }`}
                  style={{
                    height: '60px',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto'
                  }}
                  rows={8}
                />

                <button
                  onClick={handleRunAgents}
                  disabled={!canRunAgents}
                  className={`absolute flex items-center justify-center transition-all duration-200 ${canRunAgents
                      ? theme === 'dark'
                        ? 'bg-white text-black hover:bg-gray-200 hover:scale-110 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-110 shadow-lg'
                      : theme === 'dark'
                        ? 'bg-[#848484] text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  style={{
                    bottom: '-30px',
                    right: '-3px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '25px'
                  }}
                >
                  {isProcessing ? (
                    <Loader2 className={`w-8 h-8 animate-spin ${canRunAgents
                        ? theme === 'dark'
                          ? 'text-black'
                          : 'text-white'
                        : 'text-gray-400'
                      }`} />
                  ) : (
                    <ArrowRight className={`w-8 h-8 transition-transform duration-200 ${canRunAgents ? 'group-hover:translate-x-0.5' : 'text-[#0A0A0A]'
                      }`} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .textarea-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .textarea-scroll::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#666' : '#ccc'};
          border-radius: 4px;
        }
        .textarea-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#888' : '#aaa'};
        }
        .textarea-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      {agentsLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 w-screen -mx-[calc(50vw-50%)] px-40"
        >
          <MultipleAgentSelector
            selectedAgents={selectedAgents}
            onAgentToggle={handleAgentToggle}
            onClearAll={handleClearAllAgents}
            onSelectAll={handleSelectAllAgents}
            agents={agents}
          />
        </motion.div>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={resetReviewState}
        draft={generatedDraft}
        onConfirm={handleConfirmProject}
        onRegenerate={generatePreliminaryInfo}
        generationStatus={generationStatus}
        creationStatus={creationStatus}
        validationErrors={activeValidationErrors}
      />
    </div>
  );
}