import React, { useEffect, useState } from 'react';
import { ExternalLink, Search, Loader2, StopCircle, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useApiClient } from '@/lib/useApiClient';
import { useThemeStore } from '@/lib/store/themeStore';

export interface Competitor {
  id: string;
  companyName: string;
  companyWebsite?: string;
  yearFounded?: string;
  fundingStatus?: string;
  moneyRaised?: string;
  employees?: { name: string; role?: string; linkedIn?: string; twitter?: string }[];
  customers?: { name: string; url?: string }[];
  offices?: { address?: string; city?: string }[];
  ceo?: { name: string; linkedIn?: string; twitter?: string }[];
  founders?: { name: string; linkedIn?: string }[];
  keyPeople?: { name: string; role?: string; linkedIn?: string; twitter?: string }[];
  latestArticles?: { title: string; snippet: string; url: string; publishedDate?: string }[];
  features?: { name: string; description?: string }[];
  pricingPlans?: any[];
  factorsThatImpactPrice?: any[];
  discountsPromotions?: any[];
  customPlans?: any;
  freeTrial?: any;
  freemiumVersion?: any;
  complementaryTools?: { name: string; description?: string; price?: string }[];
  technologyUsed?: { name: string; description?: string; purpose?: string }[];
  numberOfReviews?: number;
  positiveMentionsPercent?: string;
  negativeMentionsPercent?: string;
  topPros?: string[];
  topCons?: string[];
  topCountries?: string[];
  topSocialMediaPlatforms?: string[];
  confidence?: number;
  agentRunStatus?: string;
}

export interface CompetitorFinderAgentResultProps {
  resultOutputId: string;
  status: 'completed' | 'running' | 'failed';
  onSelectCompetitor: (competitor: Competitor | null) => void;
  projectId: string;
  helperAgentId: string;
  agentName: string;
  shareLink?: (resultId: string, agentName: string) => Promise<void>;
}

export const CompetitorFinderAgentResult = React.memo<CompetitorFinderAgentResultProps>(({
  resultOutputId,
  status,
  onSelectCompetitor,
  projectId,
  helperAgentId,
  agentName,
  shareLink,
}) => {
  const { theme } = useThemeStore();
  const {callApi} = useApiClient();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [sortCol, setSortCol] = useState<keyof Competitor>('confidence');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if ((status === 'completed' || status === 'running') && resultOutputId) {
      callApi<Competitor[]>(`/competitors/${resultOutputId}`, { method: 'GET' })
        .then((data) => {
          setCompetitors(data || []);
        })
        .catch((err: unknown) => {
          console.error('Error fetching competitors', err);
        });
    }
  }, [status, resultOutputId, callApi]);

  useEffect(() => {
    if ((status === 'running' || status === 'completed') && resultOutputId) {
      const intervalTime = status === 'running' ? 30000 : 15000;
      const interval = setInterval(() => {
        callApi<Competitor[]>(`/competitors/${resultOutputId}`, { method: 'GET' })
          .then((data) => {
            setCompetitors(data || []);
          })
          .catch((err: unknown) => {
            console.error('Error fetching competitors', err);
          });
      }, intervalTime);
      return () => clearInterval(interval);
    }
  }, [status, resultOutputId, callApi]);

  const sorted = [...competitors].sort((a, b) => {
    // Prioritize competitors with agentRunStatus 'completed'
    if (a.agentRunStatus === 'completed' && b.agentRunStatus !== 'completed') return -1;
    if (a.agentRunStatus !== 'completed' && b.agentRunStatus === 'completed') return 1;

    // Then sort by the selected column
    const aVal = a[sortCol] || '';
    const bVal = b[sortCol] || '';
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const toggleSort = (col: keyof Competitor) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  return (
    <div className="relative">
      {/* Table */}
       <div className={`p-4 rounded-xl shadow-md overflow-x-auto ${
         theme === 'dark'
           ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
           : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
       }`}>
        <table className="w-full border-collapse text-sm table-fixed">
          <thead>
            <tr>
               {[
                 { key: 'companyName', label: 'Company Name', width: 'w-1/5' },
                 { key: 'yearFounded', label: 'Year Founded', width: 'w-1/6' },
                 { key: 'fundingStatus', label: 'Funding Status', width: 'w-1/5' },
                 { key: 'moneyRaised', label: 'Money Raised', width: 'w-1/5' },
                 { key: 'actions', label: '', width: 'w-1/12' },
               ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key as keyof Competitor)}
                  className={`p-3 cursor-pointer text-left transition-colors duration-200 ${col.width} ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white'
                      : 'text-light-600 hover:text-light-900'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key && (
                      <span>{sortAsc ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
           <tbody>
             {sorted.length === 0 ? (
               <tr>
                 <td colSpan={5} className="text-center p-4">
                    <Loader2 className={`w-6 h-6 animate-spin mx-auto ${theme === 'dark' ? 'text-[#EBB207]' : 'text-black'}`} />
                 </td>
               </tr>
             ) : (
               sorted.map((c, idx) => {
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
                          <span className="truncate bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">{c.companyName}</span>
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
                               <td className="flex items-center gap-3">
                                  {c.agentRunStatus === 'running' ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                       <span
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           callApi('/competitors/stop', {
                                             method: 'POST',
                                             body: JSON.stringify({ competitorId: c.id })
                                           }).then(() => {
                                             // Optionally update local state after API call
                                             setCompetitors(prev => prev.map(comp =>
                                               comp.id === c.id ? { ...comp, agentRunStatus: 'stopped' } : comp
                                             ));
                                           }).catch((err) => {
                                             console.error('Error stopping competitor', err);
                                           });
                                         }}
                                         className={`inline cursor-pointer transition-colors duration-200 ${
                                           theme === 'dark'
                                             ? 'text-gray-400 hover:text-red-400'
                                             : 'text-gray-500 hover:text-red-500'
                                         }`}
                                       >
                                         <StopCircle className="w-4 h-4" />
                                       </span>
                                    </>
                                  ) : c.agentRunStatus === 'completed' ? (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Immediately set to loading state
                                      setCompetitors(prev => prev.map(comp =>
                                        comp.id === c.id ? { ...comp, agentRunStatus: 'running' } : comp
                                      ));
                                      callApi('/helperAgents/run', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                          projectId,
                                          helperAgentId,
                                          inputData: { competitorId: c.id }
                                        })
                                      }).catch((err) => {
                                        console.error('Error running helper agent', err);
                                        // Revert on error
                                        setCompetitors(prev => prev.map(comp =>
                                          comp.id === c.id ? { ...comp, agentRunStatus: undefined } : comp
                                        ));
                                      });
                                    }}
                                   className={`inline cursor-pointer transition-colors duration-200 ${
                                     theme === 'dark'
                                       ? 'text-gray-400 hover:text-[#EBB207]'
                                       : 'text-gray-500 hover:text-[#EBB207]'
                                   }`}
                                 >
                                   <RotateCcw className="w-4 h-4" />
                                 </span>
                                  ) : (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Immediately set to loading state
                                      setCompetitors(prev => prev.map(comp =>
                                        comp.id === c.id ? { ...comp, agentRunStatus: 'running' } : comp
                                      ));
                                      callApi('/helperAgents/run', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                          projectId,
                                          helperAgentId,
                                          inputData: { competitorId: c.id }
                                        })
                                      }).catch((err) => {
                                        console.error('Error running helper agent', err);
                                        // Revert on error
                                        setCompetitors(prev => prev.map(comp =>
                                          comp.id === c.id ? { ...comp, agentRunStatus: undefined } : comp
                                        ));
                                      });
                                    }}
                                   className={`inline cursor-pointer transition-colors duration-200 ${
                                     theme === 'dark'
                                       ? 'text-gray-400 hover:text-[#EBB207]'
                                       : 'text-gray-500 hover:text-[#EBB207]'
                                   }`}
                                 >
                                   <Search className="w-4 h-4" />
                                 </span>
                                  )}
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      callApi(`/competitors/${c.id}`, { method: 'DELETE' })
                                        .then(() => {
                                          setCompetitors(prev => prev.filter(comp => comp.id !== c.id));
                                        })
                                        .catch((err) => {
                                          console.error('Error deleting competitor', err);
                                        });
                                    }}
                                    className={`inline cursor-pointer transition-colors duration-200 ${
                                      theme === 'dark'
                                        ? 'text-gray-400 hover:text-red-400'
                                        : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </span>
                               </td>
                      </tr>
                 );
               })
             )}
           </tbody>
        </table>
      </div>

       {/* Footer with Share button */}
       {shareLink && status === 'completed' && (
         <div className={`flex items-center justify-end mt-6 pt-4 ${
           theme === 'dark'
             ? 'border-t border-white/10'
             : 'border-t border-gray-200/60'
         }`}>
           <Button
             variant="glass"
             size="sm"
             onClick={() => shareLink(resultOutputId, agentName)}
             disabled={status !== 'completed'}
             title={status === 'completed' ? 'Copy shareable link (valid for 7 days)' : 'Share link available when completed'}
             className={`gap-2 transition-all duration-200 ${
               status !== 'completed'
                 ? 'opacity-50 cursor-not-allowed'
                 : theme === 'dark'
                   ? 'hover:bg-white/10'
                   : 'hover:bg-light-200/50'
             }`}
           >
             <ExternalLink className="w-4 h-4" />
             Share
           </Button>
         </div>
       )}
    </div>
  );
});