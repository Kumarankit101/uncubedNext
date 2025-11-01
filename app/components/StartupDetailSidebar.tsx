import React from 'react';
import { Menu } from 'lucide-react';
import type { StartupDetailData } from '@/lib/types';
import { useThemeStore } from '@/lib/store/themeStore';

export interface StartupDetailSidebarProps {
  isOpen: boolean;
  toggleOpen: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sectionTabs: { id: string; label: string; icon: React.ComponentType<{className?: string}> }[];
  results: StartupDetailData['results'];
}

export const StartupDetailSidebar: React.FC<StartupDetailSidebarProps> = ({
  isOpen,
  toggleOpen,
  activeSection,
  setActiveSection,
  sectionTabs,
  results,
}) => {
  const { theme } = useThemeStore();
  const getTabIconColor = (tabId: string): string => {
    if (tabId === 'overview') return 'text-green-400';
    const tabResults = results.filter(r => r.agentId === tabId);
    if (tabResults.length === 0) return 'text-gray-400';
    const latest = tabResults.reduce((a, b) =>
      new Date(a.createdAt) > new Date(b.createdAt) ? a : b
    );
    switch (latest.status) {
      case 'completed':
        return 'text-green-400';
      case 'running':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed top-6 left-4 z-[100000] p-2 rounded-full focus:outline-none transition-colors duration-200"
      >
        <Menu className={`w-6 h-6 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`} />
      </button>
      <aside
        className={`fixed z-[4] top-20 left-0 h-screen flex flex-col transition-transform duration-300 w-64 backdrop-blur-sm p-2 overflow-hidden bg-transparent border-r ${theme === 'dark' ? 'border-white/10' : 'border-light-300/40'} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav className="flex-1 overflow-auto py-5">
          {sectionTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            const hasResults =
              tab.id === 'overview' || results.some(r => r.agentId === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                disabled={!hasResults}
                className={`flex items-center gap-2 mb-2 w-full transition-colors duration-200 ease-in-out focus:outline-none whitespace-nowrap border ${
                  isActive
                    ? 'border-blue-500/30 bg-blue-500/20 text-blue-400'
                    : hasResults
                    ? theme === 'dark'
                      ? 'border-transparent text-gray-300 hover:text-white hover:bg-white/[0.05]'
                      : 'border-transparent text-light-600 hover:text-light-900 hover:bg-light-200/30'
                    : theme === 'dark'
                    ? 'border-transparent text-gray-500 cursor-not-allowed'
                    : 'border-transparent text-light-500 cursor-not-allowed'
                } py-2 px-4 rounded-lg text-sm font-medium`}
              >
                <Icon className={`w-4 h-4 ${getTabIconColor(tab.id)}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};