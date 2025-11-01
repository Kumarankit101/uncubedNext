import React, { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/Button';
import { Competitor } from '@/app/components/StartupResults/CompetitorFinderAgentResult';
import { useThemeStore } from '@/lib/store/themeStore';

export interface CompetitorSidePanelProps {
  competitor: Competitor;
  onClose: () => void;
}

export const CompetitorSidePanel: React.FC<CompetitorSidePanelProps> = ({
  competitor,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => onClose(), 300);
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'} ${
          theme === 'dark' ? 'bg-black/50' : 'bg-black/30'
        }`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-0 right-0 w-full md:w-2/5 h-screen shadow-lg flex flex-col p-6 transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${
          theme === 'dark'
            ? 'bg-black border-l border-white/[0.08]'
            : 'bg-light-50 border-l border-gray-400/70'
        }`}
      >

         {/* Full competitor details */}
         <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
          {/* Header Section */}
            <div className={`p-4 rounded-xl ${
              theme === 'dark'
                ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
            }`}>
              <h2 className={`text-2xl font-bold mb-1 ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>{competitor.companyName}</h2>
             {competitor.companyWebsite && (
               <a href={competitor.companyWebsite} target="_blank" rel="noreferrer" className={`text-sm ${
                 theme === 'dark'
                   ? 'text-blue-400 hover:text-blue-300'
                   : 'text-blue-600 hover:text-blue-700'
               }`}>
                 {competitor.companyWebsite}
               </a>
             )}
              <div className="flex gap-2 mt-3">
                {competitor.fundingStatus && competitor.fundingStatus !== '0' && (
                  <span className={`px-3 py-1 text-xs rounded-full ${
                      theme === 'dark'
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-gray-100 text-gray-900 border border-gray-400/70'
                  }`}>{competitor.fundingStatus}</span>
                )}
                {competitor.moneyRaised && competitor.moneyRaised !== '0' && (
                  <span className={`px-3 py-1 text-xs rounded-full ${
                     theme === 'dark'
                       ? 'bg-transparent text-white border border-white/30'
                       : 'bg-transparent text-gray-900 border border-gray-400/70'
                  }`}>{competitor.moneyRaised}</span>
                )}
              </div>
           </div>
           {/* Overview */}
             <div className={`p-4 rounded-xl ${
               theme === 'dark'
                 ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                 : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
             }`}>
               <h3 className={`uppercase text-xs mb-2 ${
                 theme === 'dark' ? 'text-gray-400' : 'text-light-600'
               }`}>Overview</h3>
              <div className={`space-y-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-light-700'
              }`}>
                {competitor.yearFounded && competitor.yearFounded !== '0' && <div><strong>Year Founded:</strong> {competitor.yearFounded}</div>}
               {competitor.offices && competitor.offices.length > 0 && (
                 <div><strong>Offices:</strong> {competitor.offices.map(o => o.city).join(', ')}</div>
               )}
               {competitor.ceo && competitor.ceo.length > 0 && (
                 <div><strong>CEO:</strong> {competitor.ceo.map(p => p.name).join(', ')}</div>
               )}
               {competitor.founders && competitor.founders.length > 0 && (
                 <div><strong>Founders:</strong> {competitor.founders.map(p => p.name).join(', ')}</div>
               )}
               {competitor.keyPeople && competitor.keyPeople.length > 0 && (
                 <div>
                   <strong>Key People:</strong>
                   <ul className="list-disc list-inside ml-4 mt-1">
                     {competitor.keyPeople.map((p, i) => (
                       <li key={i}><strong>{p.role}:</strong> {p.name}</li>
                     ))}
                   </ul>
                 </div>
               )}
                {competitor.employees && competitor.employees.length > 0 && <div><strong>Employees:</strong> {competitor.employees.length}</div>}
             </div>
           </div>

            {/* Customers */}
            {competitor.customers && competitor.customers.length > 0 && (
                <div className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                    : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
                }`}>
                  <h3 className={`uppercase text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>Customers</h3>
                <div className="flex flex-wrap gap-2">
                  {competitor.customers.map((c, i) => (
                    <a key={i} href={c.url} target="_blank" rel="noreferrer" className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                       theme === 'dark'
                         ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
                         : 'bg-gray-100 text-gray-900 border border-gray-400/70 hover:bg-gray-200'
                    }`}>
                      {c.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Articles */}
            {competitor.latestArticles && competitor.latestArticles.length > 0 && (
                <div className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                    : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
                }`}>
                  <h3 className={`uppercase text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>Latest Articles</h3>
                <div className="space-y-2">
                  {competitor.latestArticles.map((a, i) => (
                     <div key={i} className={`p-3 rounded-lg ${
                       theme === 'dark'
                         ? 'bg-white/[0.05] border border-white/[0.05]'
                         : 'bg-gray-50 border border-gray-400/70'
                     }`}>
                      <a href={a.url} target="_blank" rel="noreferrer" className={`text-sm font-semibold mb-1 block ${
                        theme === 'dark'
                          ? 'text-blue-400 hover:text-blue-300'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}>{a.title}</a>
                      <p className={`text-xs mb-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{a.snippet}</p>
                      <span className={`text-[10px] ${
                        theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                      }`}>{a.publishedDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {competitor.features && competitor.features.length > 0 && (
               <div className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                    : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
                }`}>
                  <h3 className={`uppercase text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>Features</h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className={`p-3 text-left ${
                        theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                      }`}>Feature</th>
                      <th className={`p-3 text-left ${
                        theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                      }`}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitor.features.map((f, i) => (
                       <tr key={i} className={
                         theme === 'dark'
                           ? (i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.04]')
                           : (i % 2 === 0 ? 'bg-gray-100/70' : 'bg-gray-200/60')
                       }>
                        <td className={`p-3 ${
                          theme === 'dark' ? 'text-white' : 'text-light-900'
                        }`}><strong>{f.name}</strong></td>
                        <td className={`p-3 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                        }`}>{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

           {/* Technology & Tools */}
           {competitor.technologyUsed && competitor.technologyUsed.length > 0 && (
              <div className={`p-4 rounded-xl ${
               theme === 'dark'
                 ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                 : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
              }`}>
                <h3 className={`uppercase text-xs mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                }`}>Technology & Tools</h3>
               <div className="flex flex-wrap gap-2">
                 {competitor.technologyUsed.map((t, i) => (
                   <span key={i} className={`text-xs rounded-full px-2 py-1 ${
                     theme === 'dark'
                       ? 'bg-white/10 text-white border border-white/20'
                       : 'bg-gray-100 text-gray-900 border border-gray-400/70'
                   }`}>{t.name}</span>
                 ))}
               </div>
             </div>
           )}

            {/* Reviews & Mentions */}
             <div className={`p-4 rounded-xl ${
               theme === 'dark'
                 ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                 : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
             }`}>
               <h3 className={`uppercase text-xs mb-2 ${
                 theme === 'dark' ? 'text-gray-400' : 'text-light-600'
               }`}>Reviews & Mentions</h3>
               <div className={`grid grid-cols-3 gap-2 text-center text-sm ${
                 theme === 'dark' ? 'text-gray-300' : 'text-light-700'
               }`}>
                 <div>
                   <strong className={`${
                     theme === 'dark' ? 'text-white' : 'text-light-900'
                   }`}>{competitor.numberOfReviews && competitor.numberOfReviews !== 0 ? competitor.numberOfReviews : '-'}</strong>
                   <div className={`text-xs ${
                     theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                   }`}>Reviews</div>
                 </div>
                 <div>
                   <strong className={`${
                     theme === 'dark' ? 'text-white' : 'text-light-900'
                   }`}>{competitor.positiveMentionsPercent && competitor.positiveMentionsPercent !== '0' ? competitor.positiveMentionsPercent : '-'}</strong>
                   <div className={`text-xs ${
                     theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                   }`}>Positive</div>
                 </div>
                 <div>
                   <strong className={`${
                     theme === 'dark' ? 'text-white' : 'text-light-900'
                   }`}>{competitor.negativeMentionsPercent && competitor.negativeMentionsPercent !== '0' ? competitor.negativeMentionsPercent : '-'}</strong>
                   <div className={`text-xs ${
                     theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                   }`}>Negative</div>
                 </div>
               </div>
            </div>

            {/* Market Presence */}
            {(competitor.topCountries?.length || competitor.topSocialMediaPlatforms?.length) && (
                <div className={`p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
                    : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
                }`}>
                  <h3 className={`uppercase text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}>Market Presence</h3>
                <div className="flex flex-col gap-2">
                  {competitor.topCountries && competitor.topCountries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       {competitor.topCountries.map((c, i) => (
                         <span key={i} className={`text-xs rounded-full px-2 py-1 ${
                           theme === 'dark'
                             ? 'bg-white/10 text-white border border-white/20'
                             : 'bg-gray-100 text-gray-900 border border-gray-400/70'
                         }`}>{c}</span>
                       ))}
                    </div>
                  )}
                  {competitor.topCountries && competitor.topCountries.length > 0 && competitor.topSocialMediaPlatforms && competitor.topSocialMediaPlatforms.length > 0 && (
                     <hr className={`border-t ${
                       theme === 'dark' ? 'border-white/[0.08]' : 'border-gray-400/70'
                     }`} />
                  )}
                  {competitor.topSocialMediaPlatforms && competitor.topSocialMediaPlatforms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                       {competitor.topSocialMediaPlatforms.map((s, i) => (
                         <span key={i} className={`text-xs rounded-full px-2 py-1 ${
                           theme === 'dark'
                             ? 'bg-white/10 text-white border border-white/20'
                             : 'bg-gray-100 text-gray-900 border border-gray-400/70'
                         }`}>{s}</span>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            )}
         </div>
          <div className={`p-4 backdrop-blur-md ${
            theme === 'dark' ? 'bg-black/30' : 'bg-light-100/30'
          }`}>
            <Button variant="glass" size="sm" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
      </div>
    </>
  );
};