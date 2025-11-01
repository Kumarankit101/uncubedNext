'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { PublicMarketResearchAgentResult } from '@/app/components/StartupResults/PublicMarketResearchAgentResult';
import { PublicCompetitorFinderAgentResult } from '@/app/components/StartupResults/PublicCompetitorFinderAgentResult';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { apiClient } from '@/lib/api';
import { Navigation } from '@/app/components/landing/Navigation';
import { Footer } from '@/app/components/landing/Footer';
import { useThemeStore } from '@/lib/store/themeStore';
import BackgroundRays from '@/app/components/BackgroundRays';
import type { Competitor } from '@/app/components/StartupResults/CompetitorFinderAgentResult';

const CompetitorSidePanel = React.lazy(() => import('@/app/components/StartupResults/CompetitorSidePanel').then(module => ({ default: module.CompetitorSidePanel })));

import type { SharedResultData } from '@/lib/api';

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export default function SharedResult({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { type, id } = resolvedParams;
  const [data, setData] = useState<SharedResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Detect system theme and set in store
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  useEffect(() => {
    if (!id) {
      setError('Invalid result ID');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        let result;

        // Determine which API to call based on the type parameter
        if (type === 'competitor-finder') {
          result = await apiClient.getPublicCompetitors(id);
        } else {
          // Default to market research for backward compatibility
          result = await apiClient.getPublicResult(id);
        }

        setData(result);

        // Set page title for SEO
        document.title = `${result.title} - Uncubed AI Results`;
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('404') || err.message.includes('not found')) {
            setError('Result not found');
          } else if (err.message.includes('403') || err.message.includes('not available')) {
            setError('This result is not available for sharing');
          } else if (err.message.includes('429') || err.message.includes('Too Many Requests')) {
            setError('Too many requests. Please try again later.');
          } else {
            setError(err.message);
          }
        } else {
          setError('An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, type]);

  if (loading) {
    return (
      <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-light-50 text-black'}`}>
        <BackgroundRays />
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className={`animate-spin rounded-full h-12 w-12 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-light-50 text-black'}`}>
        <BackgroundRays />
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <div className={`flex items-start gap-4 p-6 rounded-lg border ${
            theme === 'dark'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-red-50 border-red-200'
          }`}>
            <AlertCircle className={`w-6 h-6 flex-shrink-0 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
            <div>
              <h2 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>Error Loading Result</h2>
              <p className={theme === 'dark' ? 'text-red-300/80' : 'text-red-600/80'}>{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-light-50 text-black'}`}>
        <BackgroundRays />
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <div className={`flex items-start gap-4 p-6 rounded-lg border ${
            theme === 'dark'
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <AlertCircle className={`w-6 h-6 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <div>
              <h2 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>No Data Available</h2>
              <p className={theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-600/80'}>The requested result could not be loaded.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-light-50 text-black'}`}>
      <BackgroundRays />
      <Navigation />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8 space-y-8 relative z-10">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>{data.title}</h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
          }`}>{data.agentName}</p>
        </div>

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
      </div>
      <Footer />
    </div>
  );
}
