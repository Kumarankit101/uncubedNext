'use client';


import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import nextDynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Globe,
  LayoutDashboard
} from 'lucide-react';

import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';
import { aiAgents } from '@/lib/data/aiAgents';
// TODO Phase 5: Replace wildcard import with icon map for tree-shaking
// Dynamic icon lookup based on database agent.icon property
import * as Icons from 'lucide-react';
import { useAgents } from '@/lib/hooks/useAgents';
import { useApiClient } from '@/lib/useApiClient';
import type { StartupDetailData } from '@/lib/types';
import { useProjects } from '@/lib/hooks/useProjects';
import { ActivityLog } from '@/app/components/ActivityLog';
import { Notes } from '@/app/components/Notes';
import { Edit3 } from 'lucide-react';
import { StartupDetailSidebar } from '@/app/components/StartupDetailSidebar';
import { EditProjectModal } from '@/app/components/EditProjectModal';
import type { ProjectFormData } from '@/app/components/EditProjectModal';
import type { Competitor } from '@/app/components/StartupResults/CompetitorFinderAgentResult';

const MarketResearchAgentResult = nextDynamic(() => import('@/app/components/StartupResults/MarketResearchAgentResult').then(module => ({ default: module.MarketResearchAgentResult })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const PitchDeckGeneratorResult = nextDynamic(() => import('@/app/components/StartupResults/PitchDeckGeneratorResult').then(module => ({ default: module.PitchDeckGeneratorResult })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const AppBuilder = nextDynamic(() => import('@/app/components/StartupResults/AppBuilder').then(module => ({ default: module.AppBuilder })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const CompetitorFinderAgentResult = nextDynamic(() => import('@/app/components/StartupResults/CompetitorFinderAgentResult').then(module => ({ default: module.CompetitorFinderAgentResult })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const CompetitorSidePanel = nextDynamic(() => import('@/app/components/StartupResults/CompetitorSidePanel').then(module => ({ default: module.CompetitorSidePanel })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const FeaturePrioritizerResult = nextDynamic(() => import('@/app/components/StartupResults/FeaturePrioritizerResult').then(module => ({ default: module.FeaturePrioritizerResult })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
const LaunchDirectory = nextDynamic(() => import('@/app/components/StartupResults/LaunchDirectory').then(module => ({ default: module.LaunchDirectory })), { ssr: false, loading: () => <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div> });
import { useThemeStore } from '@/lib/store/themeStore';
import { Directory } from '@/app/components/StartupResults/LaunchDirectory';
import { DirectoryModal } from '@/app/components/DirectoryModal';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StartupDetail({ params }: PageProps) {
  const { theme } = useThemeStore();
  const { agents, runAgent } = useAgents();
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[section: string]: string[]}>({});
  const contentRefs = React.useRef<{ [key: string]: HTMLElement | null }>({});

  const { callApi } = useApiClient();
  const [startup, setStartup] = useState<StartupDetailData | null>(null);
  const [loadingStartup, setLoadingStartup] = useState<boolean>(true);
  const [agentIds, setAgentIds] = useState<string[]>([]);
  const [loadingAgentRuns, setLoadingAgentRuns] = useState<boolean>(true);
  const [rerunningAgentId, setRerunningAgentId] = useState<string | null>(null);

  const { updateProject } = useProjects();
  const [editDefaultValues, setEditDefaultValues] = useState<ProjectFormData | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [selectedDirectory, setSelectedDirectory] = useState<Directory | null>(null);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [shareNotification, setShareNotification] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const diyChildOrigin = "/diy/";
  const myData = "This is my text";

  const sendMessageToChild = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "MY_DATA", payload: myData },
        window.location.origin
      );
    }
  }, [myData]);

  useEffect(() => {
    sendMessageToChild();
  }, [sendMessageToChild]);

  const openEditModal = () => {
    if (!startup) return;
    setEditDefaultValues({
      startupName: startup.startupName,
      description: startup.description,
      tagline: startup.tagline,
      problem: startup.problem,
      solution: startup.solution,
      targetMarket: startup.targetMarket,
      startupIdea: startup.startupIdea,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProject = async (data: ProjectFormData) => {
    if (!startup) return;
    try {
      await updateProject({ id: startup.id, projectData: data });
      setStartup(prev => prev ? { ...prev, ...data } : prev);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  useEffect(() => {
    document.body.classList.add('startup-detail-page');
    return () => {
      document.body.classList.remove('startup-detail-page');
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoadingStartup(true);
    setLoadingAgentRuns(true);

    callApi(`/startupDetails/${id}`)
      .then(data => {
        const detail = data as StartupDetailData;
        setStartup(detail);
      })
      .catch(error => console.error('Failed to fetch startup details:', error))
      .finally(() => setLoadingStartup(false));

    callApi(`/agentRuns/${id}`)
      .then((response: any) => {
        const ids = response.agentIds || [];
        setAgentIds(ids);
      })
      .catch(error => console.error('Failed to fetch agent runs:', error))
      .finally(() => setLoadingAgentRuns(false));
  }, [id, callApi]);

  useEffect(() => {
    if (!startup) return;
    const interval = setInterval(() => {
      startup.results.filter(r => r.status === 'running').forEach(async r => {
        try {
          const res = await callApi(`/agents/runs/${r.agentRunId}`);
          const run = (res as any).agentRun;
          if (run.status !== 'running') {
            setStartup(prev => prev && ({
              ...prev,
              results: prev.results.map(item =>
                item.outputId === r.outputId
                  ? {
                    ...item,
                    status: run.status,
                    content: run.outputs.slice(-1)[0]?.content || item.content,
                    createdAt: run.outputs.slice(-1)[0]?.createdAt || item.createdAt
                  }
                  : item
              )
            }));
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [startup, callApi]);

  useEffect(() => {
    if (!startup || !agentIds.length) return;
    setExpandedResults(prev => {
      if (Object.keys(prev).length > 0) return prev;
      const newExpanded: {[section: string]: string[]} = {};
      const overviewResults = startup.results;
      const firstOverview = overviewResults.find(r => r.status === 'completed');
      newExpanded['overview'] = firstOverview ? [firstOverview.outputId] : [];
      agentIds.forEach(agentId => {
        const agentResults = startup.results.filter(r => r.agentId === agentId);
        const firstAgent = agentResults.find(r => r.status === 'completed');
        newExpanded[agentId] = firstAgent ? [firstAgent.outputId] : [];
      });
      return newExpanded;
    });
  }, [startup, agentIds]);

  const toggleResultExpansion = useCallback((resultId: string) => {
    setExpandedResults(prev => {
      const current = prev[activeSection] || [];
      const newExpanded = current.includes(resultId)
        ? current.filter(id => id !== resultId)
        : [...current, resultId];
      return { ...prev, [activeSection]: newExpanded };
    });
  }, [activeSection]);

  const handleRerunAgent = useCallback(async (agentId: string) => {
    if (!startup || !id) return;
    setRerunningAgentId(agentId);
    try {
      await runAgent({
        projectId: startup.id,
        agentId: agentId,
        inputData: {
          description: startup.description,
          projectContext: startup.startupIdea
        }
      });
      const runsRes = await callApi(`/agentRuns/${id}`);
      setAgentIds((runsRes as any).agentIds || []);
      const detail = await callApi(`/startupDetails/${id}`);
      setStartup(detail as StartupDetailData);
    } catch (err) {
      console.error('Error rerunning agent:', err);
    } finally {
      setRerunningAgentId(null);
    }
  }, [startup, id, runAgent, callApi]);

  const handleAddNewAgent = useCallback(() => {
    if (!startup) return;
    // Use query param instead of state for Next.js
    router.push(`/agents?projectId=${startup.id}`);
  }, [startup, router]);

  const exportAsMarkdown = useCallback((content: string, agentName: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${agentName.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportAsPDF = useCallback(async (resultId: string, agentName: string) => {
    const element = contentRefs.current[resultId];
    if (!element) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `${agentName.replace(/\s+/g, '_')}.pdf`,
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        html2canvas: {
          useCORS: true,
          scale: 2,
          backgroundColor: '#fff',
          onclone: (clonedDoc: Document) => {
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * { background: #fff !important; color: #000 !important; }
              .prose, .prose * { break-inside: avoid-page !important; page-break-inside: avoid !important; }
              @media print { html, body { width: 100%; } }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        pagebreak: { mode: ['avoid-all', 'css'], selector: '.prose' }
      })
      .from(element)
      .save();
  }, []);

  const shareLink = useCallback(async (resultId: string, agentName: string) => {
    try {
      await callApi(`/outputs/${resultId}/share`, { method: 'POST' });

      let url;
      if (agentName === 'Competitor Analyst' || agentName === 'Competitor Finder' || agentName.toLowerCase().includes('competitor') || agentName.toLowerCase().includes('finder')) {
        url = `${window.location.origin}/shared/result/competitor-finder/${resultId}`;
      } else {
        url = `${window.location.origin}/shared/result/market-research/${resultId}`;
      }

      await navigator.clipboard.writeText(url);
      setShareNotification('Shareable link copied to clipboard! (Valid for 7 days)');
      setTimeout(() => setShareNotification(null), 3000);
    } catch (err) {
      console.error('Share error:', err);
      setShareNotification('Failed to share result. Please try again.');
      setTimeout(() => setShareNotification(null), 3000);
    }
  }, [callApi]);

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  if (loadingStartup || loadingAgentRuns || !startup) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`animate-spin rounded-full h-12 w-12 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
      </div>
    );
  }

  const agentTabs = agents.filter(agent => agent.isActive && agentIds.includes(agent.id))
    .map(agent => ({ id: agent.id, label: agent.name, icon: agent.icon || FileText}))
    .sort((a, b) => a.label.localeCompare(b.label));
  const sectionTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ...agentTabs
  ];

  const getAgentIcon = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent ? (Icons as any)[agent.icon] : FileText;
  };

  const getAgentColor = (agentId: string) => {
    const agent = aiAgents.find(a => a.id === agentId);
    return agent?.color || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const filteredResults = activeSection === 'overview'
    ? startup!.results
    : startup!.results.filter((result: StartupDetailData['results'][0]) =>
      result.agentId === activeSection
    );

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body.startup-detail-page .rayContainer .lightRay {
            opacity: 0.4 !important;
          }
          body.startup-detail-page .rayContainer {
            opacity: 0.5 !important;
          }

          body.startup-detail-page.light .rayContainer .lightRay {
            opacity: 0.6 !important;
            mix-blend-mode: normal !important;
            filter: brightness(1.2) saturate(1.4) !important;
          }
          body.startup-detail-page.light .rayContainer {
            opacity: 0.7 !important;
            mix-blend-mode: normal !important;
          }

          body.startup-detail-page.dark .rayContainer .lightRay {
            opacity: 0.3 !important;
            mix-blend-mode: screen !important;
            filter: brightness(0.8) !important;
          }
          body.startup-detail-page.dark .rayContainer {
            opacity: 0.4 !important;
            mix-blend-mode: screen !important;
          }

          body.startup-detail-page.light .rayContainer .ray3,
          body.startup-detail-page.light .rayContainer .ray6 {
            opacity: 0.8 !important;
            filter: brightness(1.4) saturate(1.6) hue-rotate(10deg) !important;
          }
        `
      }} />
      <StartupDetailSidebar
        isOpen={isSidebarOpen}
        toggleOpen={() => setIsSidebarOpen(prev => !prev)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sectionTabs={sectionTabs}
        results={startup!.results}
      />
      <div id="startup-detail-page" className={`flex w-full min-h-screen bg-transparent`}>
        <main className={`flex-1 space-y-8 transition-all duration-300 p-6 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-light-900'
                  }`}>{startup.startupName}</h1>
                </div>
                <div className={`flex items-center gap-4 text-sm ${
                  theme === 'dark' ? 'text-gray-500' : 'text-light-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last updated {startup.lastUpdated}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created {startup.createdAt}
                  </div>
                </div>
              </div>

              {shareNotification && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                  theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                }`}>
                  {shareNotification}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button variant="glass" size="sm" onClick={openEditModal} className="gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit Project
                </Button>
                <Button variant="glass" size="sm" onClick={handleAddNewAgent} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Agent
                </Button>
                {!startup.results.some(result => result.agentName === 'Launchpad') && (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={isLaunching}
                    onClick={async () => {
                      setIsLaunching(true);
                      try {
                        await runAgent({
                          projectId: startup.id,
                          agentId: '9b862929-3067-472b-9d35-4bbb896fb1ee',
                          inputData: {
                            description: startup.description,
                            projectContext: startup.startupIdea
                          }
                        });
                        const [startupData, agentRunsData] = await Promise.all([
                          callApi(`/startupDetails/${id}`),
                          callApi(`/agentRuns/${id}`)
                        ]);
                        setStartup(startupData as StartupDetailData);
                        setAgentIds((agentRunsData as any).agentIds || []);
                        setActiveSection('9b862929-3067-472b-9d35-4bbb896fb1ee');
                      } catch (error) {
                        console.error('Error running Launchpad:', error);
                      } finally {
                        setIsLaunching(false);
                      }
                    }}
                    className="gap-2"
                  >
                    {isLaunching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                    {isLaunching ? 'Launching...' : 'Launch'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }} className={activeSection === 'overview' ? '' : 'hidden'}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 transition-all duration-300" />

              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-light-900'
                  }`}>{startup.tagline}</h2>
                  <p className={`max-w-3xl mx-auto leading-relaxed ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>
                    {startup.startupIdea}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                  {startup.problem && (
                    <div className={`text-center p-6 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.03] border-white/[0.08]'
                        : 'bg-white/[0.12] border-gray-400/70'
                    }`}>
                      <h3 className={`text-base font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-light-900'
                      }`}>Problem</h3>
                      <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{startup.problem}</p>
                    </div>
                  )}

                  {startup.solution && (
                    <div className={`text-center p-6 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.03] border-white/[0.08]'
                        : 'bg-white/[0.12] border-gray-400/70'
                    }`}>
                      <h3 className={`text-base font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-light-900'
                      }`}>Solution</h3>
                      <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{startup.solution}</p>
                    </div>
                  )}

                  {startup.targetMarket && (
                    <div className={`text-center p-6 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-white/[0.03] border-white/[0.08]'
                        : 'bg-white/[0.12] border-gray-400/70'
                    }`}>
                      <h3 className={`text-base font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-light-900'
                      }`}>Target Market</h3>
                      <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{startup.targetMarket}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${activeSection === 'overview' ? 'hidden' : ''} space-y-6`}
          >
            {filteredResults.length === 0 ? (
              <Card className="text-center py-12">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-500/20' : 'bg-gray-200/60'
                }`}>
                  <FileText className={`w-8 h-8 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <h3 className={`text-base font-medium mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-light-900'
                }`}>No results yet</h3>
                <p className={`mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                }`}>Run AI agents to generate insights for this section.</p>
                <Button variant="primary" size="sm" onClick={handleAddNewAgent}>
                  <Plus className="w-4 h-4" />
                  Add AI Agent
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredResults.map((result: StartupDetailData['results'][0], index: number) => {
                  const Icon = getAgentIcon(result.agentId);
                  const isExpanded = (expandedResults[activeSection] || []).includes(result.outputId);

                  return (
                    <motion.div
                      key={result.outputId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden">
                        <div className={`p-6 border-b ${
                          theme === 'dark' ? 'border-white/10' : 'border-gray-400/70'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 ${getAgentColor(result.agentId)} rounded-xl flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className={`text-base font-semibold ${
                                  theme === 'dark' ? 'text-white' : 'text-light-900'
                                }`}>{result.agentName}</h3>
                                <div className={`flex items-center gap-4 text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                }`}>
                                  <div className="flex items-center gap-1">
                                    {result.status === 'completed' ? (
                                      <CheckCircle className="w-4 h-4 text-green-400" />
                                    ) : result.status === 'failed' ? (
                                      <XCircle className="w-4 h-4 text-red-400" />
                                    ) : (
                                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                    )}
                                    <span className={result.status === 'completed' ? 'text-green-400' : result.status === 'failed' ? 'text-red-400' : 'text-blue-400'}>
                                      {result.status === 'completed' ? 'Completed' : result.status === 'failed' ? 'Failed' : 'Running'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(result.createdAt).toLocaleDateString()}{' '}{new Date(result.createdAt).toLocaleTimeString()}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {result.agentName !== 'App Builder' && result.agentName !== 'Launchpad' && (
                                <Button
                                  variant="glass"
                                  size="sm"
                                  onClick={() => handleRerunAgent(result.agentId)}
                                  disabled={result.status === 'running' || rerunningAgentId === result.agentId}
                                  className={`gap-1 ${(result.status === 'running' || rerunningAgentId === result.agentId) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {rerunningAgentId === result.agentId ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <RotateCcw className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="glass"
                                size="sm"
                                onClick={() => result.status === 'completed' && toggleResultExpansion(result.outputId)}
                                disabled={result.status !== 'completed'}
                                className={`gap-1 ${result.status !== 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6"
                          >
                            <div className="overflow-x-auto">
                              <article>
                                {result.agentName === 'Market Researcher' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <MarketResearchAgentResult
                                      content={result.content}
                                      resultOutputId={result.outputId}
                                      agentName={result.agentName}
                                      status={result.status as 'completed' | 'running' | 'failed'}
                                      isExpanded={(expandedResults[activeSection] || []).includes(result.outputId)}
                                      copyToClipboard={copyToClipboard}
                                      onRerun={() => handleRerunAgent(result.agentId)}
                                      toggleExpanded={() => toggleResultExpansion(result.outputId)}
                                      exportAsPDF={exportAsPDF}
                                      exportAsMarkdown={exportAsMarkdown}
                                      shareLink={shareLink}
                                      contentRef={el => { contentRefs.current[result.outputId] = el; }}
                                    />
                                  </Suspense>
                                )}

                                {result.agentName === 'Competitor Analyst' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <CompetitorFinderAgentResult
                                      resultOutputId={result.outputId}
                                      status={result.status as 'completed' | 'running' | 'failed'}
                                      onSelectCompetitor={setSelectedCompetitor}
                                      projectId={startup.id}
                                      helperAgentId="c2f1a7a8-3b9e-4b82-92d6-83d0fb0f9e1c"
                                      agentName={result.agentName}
                                      shareLink={shareLink}
                                    />
                                  </Suspense>
                                )}

                                {result.agentName === 'Pitch Deck Generator' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <PitchDeckGeneratorResult
                                      exportUrl={(() => { try { return JSON.parse(result.content).exportUrl; } catch { return ''; } })()}
                                      resultOutputId={result.outputId}
                                      shareLink=""
                                      content={result.content}
                                    />
                                  </Suspense>
                                )}

                                {result.agentName === 'App Builder' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <AppBuilder
                                      childOrigin={diyChildOrigin}
                                      projectId={startup.id}
                                    />
                                  </Suspense>
                                )}

                                {result.agentName === 'Feature Prioritizer' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <FeaturePrioritizerResult
                                      content={result.content}
                                      status={result.status as 'completed' | 'running' | 'failed'}
                                    />
                                  </Suspense>
                                )}

                                {result.agentName === 'Launchpad' && (
                                  <Suspense fallback={<div className="flex items-center justify-center p-8"><div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div></div>}>
                                    <LaunchDirectory onOpenModal={(directory) => {
                                      setSelectedDirectory(directory);
                                      setIsDirectoryModalOpen(true);
                                    }} />
                                  </Suspense>
                                )}

                                {result.agentName !== 'Market Researcher' && result.agentName !== 'Pitch Deck Generator' && result.agentName !== 'App Builder' && result.agentName !== 'Competitor Analyst' && result.agentName !== 'Feature Prioritizer' && result.agentName !== 'Launchpad' && (
                                  <pre className={`p-4 rounded-lg w-10 ${
                                    theme === 'dark'
                                      ? 'bg-white/[0.05] text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}>
                                    {JSON.stringify(result.content, null, 2)}
                                  </pre>
                                )}
                              </article>
                            </div>
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityLog activityLog={startup.activityLog} />
              <Notes notes={startup.notes} projectId={startup.id} />
            </div>
          )}
        </main>
      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        defaultValues={editDefaultValues}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditDefaultValues(undefined);
        }}
        onSubmit={handleEditProject}
      />

      {selectedCompetitor && (
        <Suspense fallback={<div className="flex justify-center items-center p-8"><Loader2 className="animate-spin w-6 h-6 text-blue-400" /></div>}>
          <CompetitorSidePanel
            competitor={selectedCompetitor}
            onClose={() => setSelectedCompetitor(null)}
          />
        </Suspense>
      )}

      {isDirectoryModalOpen && selectedDirectory && (
        <DirectoryModal
          directory={selectedDirectory}
          onClose={() => {
            setIsDirectoryModalOpen(false);
            setSelectedDirectory(null);
          }}
          theme={theme}
        />
      )}
    </>
  );
}
