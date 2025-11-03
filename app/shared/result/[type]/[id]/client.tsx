'use client';

import React, { useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { PublicMarketResearchAgentResult } from '@/app/components/StartupResults/PublicMarketResearchAgentResult';
import { PublicCompetitorFinderAgentResult } from '@/app/components/StartupResults/PublicCompetitorFinderAgentResult';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import type { Competitor } from '@/app/components/StartupResults/CompetitorFinderAgentResult';
import dynamic from 'next/dynamic';

const CompetitorSidePanel = dynamic(() => import('@/app/components/StartupResults/CompetitorSidePanel').then(module => ({ default: module.CompetitorSidePanel })), { ssr: false });

export function SharedResultClient({ data, type }: { data: any; type: string }) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  return (
    <>
      <ErrorBoundary>
        {type === 'competitor-finder' ? (
          <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div>}>
            <PublicCompetitorFinderAgentResult
              competitors={data.competitors || []}
              title={data.title}
              agentName={data.agentName}
              status={data.status}
              onSelectCompetitor={setSelectedCompetitor}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div>}>
            <PublicMarketResearchAgentResult
              content={data.content || ''}
              title={data.title}
              agentName={data.agentName}
              status={data.status}
            />
          </Suspense>
        )}
      </ErrorBoundary>

      {selectedCompetitor && (
        <Suspense fallback={<div className="flex justify-center items-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div>}>
          <CompetitorSidePanel
            competitor={selectedCompetitor}
            onClose={() => setSelectedCompetitor(null)}
          />
        </Suspense>
      )}
    </>
  );
}