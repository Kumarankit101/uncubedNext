import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/app/components/../components/ui/Card';
import { Button } from '@/app/components/../components/ui/Button';
import { useApiClient } from '@/lib/useApiClient';
import { useThemeStore } from '@/lib/store/themeStore';
import { ExternalLink, Users, Globe, Info, Rocket } from 'lucide-react';

export interface Directory {
  id: string;
  url: string;
  iconurl: string;
  name: string;
  domain: string;
  shortdescription: string;
  domainrating: number;
  monthlytraffic: string;
  submissionpricing: string;
  providedofollowbacklink: string;
  website: string;
  upvotes: number;
  backlink: string;
  description: string;
  review: string;
  howtolaunch: any;
  faqs: any;
  createdat: string;
  updatedat: string;
}

interface DirectoryIconProps {
  iconurl: string | null;
  name: string;
  theme: string;
}

export const DirectoryIcon: React.FC<DirectoryIconProps> = ({ iconurl, name, theme }) => {
  const [imageError, setImageError] = useState(false);
  const [proxyError, setProxyError] = useState(false);

  if (iconurl && !imageError) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const proxyUrl = `${apiBaseUrl}/directories/proxy-image?url=${encodeURIComponent(iconurl)}`;

    return (
      <div className="w-10 h-10 rounded overflow-hidden flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxyError ? iconurl : proxyUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => {
            if (!proxyError) {
              // Try direct URL if proxy fails
              setProxyError(true);
            } else {
              // Both proxy and direct failed, show fallback
              setImageError(true);
            }
          }}
          onLoad={() => {
            // Reset proxy error if it loads successfully
            setProxyError(false);
          }}
        />
      </div>
    );
  }

  return (
    <Globe className={`w-6 h-6 ${theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
      }`} />
  );
};

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface LaunchDirectoryProps {
  onOpenModal?: (directory: Directory) => void;
}

export const LaunchDirectory: React.FC<LaunchDirectoryProps> = ({ onOpenModal }) => {
  const { theme } = useThemeStore();
  const { callApi } = useApiClient();
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        setLoading(true);
        const response = await callApi(`/directories?page=1&limit=9`) as any;
        setDirectories(response.directories || []);
        setPagination(response.pagination);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to fetch directories:', err);
        setError('Failed to load startup directories');
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, [callApi]);

  const loadMoreDirectories = async () => {
    if (!pagination || !pagination.hasNextPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await callApi(`/directories?page=${nextPage}&limit=9`) as any;
      setDirectories(prev => [...prev, ...(response.directories || [])]);
      setPagination(response.pagination);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Failed to load more directories:', err);
      setError('Failed to load more startup directories');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`animate-spin rounded-full h-12 w-12 border-2 border-t-transparent ${theme === 'dark' ? 'border-[#EBB207]' : 'border-black'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className={`text-center ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto py-6 px-0 space-y-8">
     

       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {directories.map((directory, index) => (
          <motion.div
            key={directory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
             <Card hover className="h-full relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                   <DirectoryIcon
                     iconurl={directory.iconurl}
                     name={directory.name}
                     theme={theme}
                   />
                </div>
                <div className="flex flex-col items-end">
                  <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>{directory.name}</h3>
                  <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                    }`}>
                    {directory.domain}
                  </div>
                </div>
              </div>
              <p className={`text-sm mb-4 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                }`}>{directory.shortdescription}</p>

              <div className={`flex items-center justify-between text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                }`}>
                 {directory.domainrating && (
                   <div className="flex items-center">
                     <span className={`text-xs mr-1 ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>
                       Domain Rating:
                     </span>
                     <span className="font-medium">{directory.domainrating}</span>
                   </div>
                 )}
                 {directory.monthlytraffic && (
                   <div className="flex items-center">
                     <Users className="w-3 h-3 mr-1" />
                     {directory.monthlytraffic}
                   </div>
                 )}
              </div>

               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">

                    <Info
                      className={`w-4 h-4 cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}
                      onClick={() => onOpenModal?.(directory)}
                    />
                   <ExternalLink
                     className={`w-4 h-4 cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-colors`}
                     onClick={() => window.open(directory.url, '_blank')}
                   />
                 </div>

                 <Button
                   variant="primary"
                   size="sm"
                   className="gap-2"
                   onClick={() => alert('Agent Coming Soon')}
                 >
                   <Rocket className="w-4 h-4" />
                   Launch
                 </Button>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Show More Button */}
      {pagination && pagination.hasNextPage && (
        <div className="flex items-center justify-center mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={loadMoreDirectories}
            disabled={loadingMore}
            className="px-8 py-3"
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Show More'
            )}
          </Button>
        </div>
      )}

      {directories.length === 0 && (
        <div className="text-center py-12">
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>
            No directories available at the moment.
          </p>
        </div>
      )}


    </div>
  );
};