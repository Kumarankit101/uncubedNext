import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useThemeStore } from '@/lib/store/themeStore';
import { Competitor } from '@/app/components/StartupResults/CompetitorFinderAgentResult';
import { useClerkAppearance } from '@/lib/hooks/useClerkAppearance';

export interface PublicCompetitorFinderAgentResultProps {
  competitors: Competitor[];
  title: string;
  agentName: string;
  status: string;
  onSelectCompetitor: (competitor: Competitor | null) => void;
}

export const PublicCompetitorFinderAgentResult = React.memo<PublicCompetitorFinderAgentResultProps>(({
  competitors,
  title,
  agentName,
  status,
  onSelectCompetitor,
}) => {
  const { theme } = useThemeStore();
  const { openSignUp } = useClerk();
  const getAppearance = useClerkAppearance();



  // Sort competitors using the same logic as the private component
  const sortedCompetitors = [...competitors].sort((a, b) => {
    // Prioritize competitors with agentRunStatus 'completed'
    if (a.agentRunStatus === 'completed' && b.agentRunStatus !== 'completed') return -1;
    if (a.agentRunStatus !== 'completed' && b.agentRunStatus === 'completed') return 1;

    // Then sort by confidence descending (default sorting in private component)
    return (b.confidence || 0) - (a.confidence || 0);
  });

  const completedCompetitors = sortedCompetitors.filter(c => c.agentRunStatus === 'completed');
  const nonCompletedCompetitors = sortedCompetitors.filter(c => c.agentRunStatus !== 'completed');

  return (
    <div className={`relative p-8 rounded-3xl transition-all duration-200 ${
      theme === 'dark'
        ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.15)]'
        : 'bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-gray-200/60'
    }`} style={{ borderRadius: '30px', boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : undefined }}>

      {/* Table */}
      <div className={`relative p-4 rounded-xl shadow-md overflow-x-auto ${
        theme === 'dark'
          ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
          : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
      }`}>
        <table className="w-full border-collapse text-sm table-fixed">
          <thead>
            <tr>
              {[
                { key: 'companyName', label: 'Company Name', width: 'w-1/4' },
                { key: 'yearFounded', label: 'Year Founded', width: 'w-1/5' },
                { key: 'fundingStatus', label: 'Funding Status', width: 'w-1/4' },
                { key: 'moneyRaised', label: 'Money Raised', width: 'w-1/4' },
              ].map((col) => (
                <th
                  key={col.key}
                  className={`p-3 text-left ${
                    theme === 'dark'
                      ? 'text-gray-300'
                      : 'text-light-600'
                  } ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCompetitors.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No competitors found
                </td>
              </tr>
            ) : (
               sortedCompetitors.map((c, idx) => {
                 const fundingColor =
                   c.fundingStatus?.toLowerCase().includes('seed') && !c.fundingStatus?.toLowerCase().includes('series')
                     ? 'bg-green-600'
                     : c.fundingStatus?.toLowerCase().includes('series a')
                     ? 'bg-blue-600'
                     : c.fundingStatus?.toLowerCase().includes('series b')
                     ? 'bg-[#EBB207]'
                     : 'bg-gray-600';
                 return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCompetitor(c)}
                      className={`cursor-pointer transition-colors duration-200 h-12 ${
                        c.agentRunStatus !== 'completed' ? 'blur-sm' : ''
                      } ${
                       theme === 'dark'
                         ? `${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]'} hover:bg-white/[0.08]`
                         : `${idx % 2 === 0 ? 'bg-gray-100/70' : 'bg-gray-200/60'} hover:bg-gray-300/50`
                     }`}
                   >
                    <td className={`p-3 flex items-center gap-2 overflow-hidden ${
                      theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>
                      {c.companyWebsite && (
                        <ExternalLink
                          className={`w-4 h-4 cursor-pointer transition-colors duration-200 ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-white'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(c.companyWebsite, '_blank');
                          }}
                        />
                      )}
                      <span className="truncate">{c.companyName}</span>
                    </td>
                    <td className={`p-3 overflow-hidden whitespace-nowrap text-ellipsis ${
                      theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                    }`}>{c.yearFounded || '-'}</td>
                    <td className="p-3 overflow-hidden whitespace-nowrap text-ellipsis">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${fundingColor}`}>
                        {c.fundingStatus || '-'}
                      </span>
                    </td>
                     <td className={`p-3 overflow-hidden whitespace-nowrap text-ellipsis ${
                       theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                     }`}>{c.moneyRaised || '-'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {nonCompletedCompetitors.length > 0 && (
          <div
            className={`absolute flex items-center justify-center text-center p-4 z-10 ${
              theme === 'dark'
                ? 'bg-black/30 text-white'
                : 'bg-gray-100/50 text-gray-800'
            }`}
            style={{
              top: `${60 + completedCompetitors.length * 48}px`,
              height: `${nonCompletedCompetitors.length * 48}px`,
              left: 0,
              right: 0,
            }}
          >
            We found {nonCompletedCompetitors.length} more competitors! &nbsp;<span onClick={() => openSignUp({ signInUrl: '/login', afterSignUpUrl: '/home', appearance: getAppearance() })} className={`underline hover:no-underline cursor-pointer ${theme === 'dark' ? 'text-[#EBB207]' : 'text-black'}`}> Sign up </span>&nbsp; to see the full list.
          </div>
        )}
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
            ? `${competitors.length} competitors found`
            : status === 'running'
              ? 'Analysis in progress...'
              : 'Analysis failed'
          }
        </div>
      </div>
    </div>
  );
});