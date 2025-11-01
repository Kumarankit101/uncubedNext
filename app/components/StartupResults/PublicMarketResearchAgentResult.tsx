import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useThemeStore } from '@/lib/store/themeStore';

export interface PublicMarketResearchAgentResultProps {
  content: string;
  title: string;
  agentName: string;
  status: string;
}

export const PublicMarketResearchAgentResult = React.memo<PublicMarketResearchAgentResultProps>(({
  content,
  title,
  agentName,
  status,
}) => {
  const { theme } = useThemeStore();

  return (
    <div className={`relative p-8 rounded-3xl transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.15)]'
        : 'bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-gray-200/60'
    }`} style={{ borderRadius: '30px', boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : undefined }}>

      {/* Content - Always visible (no expansion logic) */}
      <div
        className={`transition-all duration-300 ${
          theme === 'dark'
            ? 'prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-gray-200 prose-pre:bg-gray-800/50 prose-blockquote:border-gray-600'
            : 'prose max-w-none prose-headings:text-light-900 prose-p:text-light-700 prose-strong:text-light-900 prose-code:text-light-800 prose-pre:bg-light-100/50 prose-blockquote:border-light-300'
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between mt-8 pt-6 ${
        theme === 'dark'
          ? 'border-t border-white/10'
          : 'border-t border-gray-200/60'
      }`}>
        <div className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>
          {status === 'completed'
            ? `${content.split(' ').length} words`
            : status === 'running'
              ? 'Analysis in progress...'
              : 'Analysis failed'
          }
        </div>
      </div>
    </div>
  );
});