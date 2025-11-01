import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, Globe, ExternalLink, Rocket } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { DirectoryIcon, Directory } from '@/app/components/StartupResults/LaunchDirectory';

interface DirectoryModalProps {
  directory: Directory;
  onClose: () => void;
  theme: string;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({ directory, onClose, theme }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 backdrop-blur-sm ${theme === 'dark' ? 'bg-black/60' : 'bg-black/40'}`}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl ${theme === 'dark'
            ? 'bg-black border border-white/20'
            : 'bg-white border border-gray-200'
          }`}
        style={{
          boxShadow: theme === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark'
            ? 'border-white/10'
            : 'border-gray-200'
          }`}>
          <div className="flex items-center gap-4">
             <DirectoryIcon
               iconurl={directory.iconurl}
               name={directory.name}
               theme={theme}
             />
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                {directory.name}
              </h2>
               <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-light-600'}`}>
                 {directory.description || directory.shortdescription}
               </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`transition-colors p-1 ${theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-thin scroll-smooth">
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {directory.domainrating && (
                 <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                   <div className="flex items-center justify-center gap-2">
                     <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                       Domain Rating: {directory.domainrating}
                     </span>
                   </div>
                 </div>
               )}

               {directory.monthlytraffic && (
                 <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                   <div className="flex items-center justify-center gap-2">
                     <Users className="w-4 h-4" />
                     <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                       Monthly Traffic: {directory.monthlytraffic}
                     </span>
                   </div>
                 </div>
               )}

              {directory.submissionpricing && (
                <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                    Manual submission Pricing: {directory.submissionpricing}
                  </span>
                </div>
              )}
              {directory.website && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="w-4 h-4" />
                    <a
                      href={directory.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      {directory.website}
                    </a>
                  </div>
                </div>
              )}


             </div>

             {directory.review && (
               <div>
                 <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                 Description
                 </h3>
                 <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                   {directory.review}
                 </p>
               </div>
             )}

             {directory.providedofollowbacklink && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                  Backlink Info
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                  {directory.providedofollowbacklink}
                </p>
              </div>
            )}



            {directory.howtolaunch && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                Launch manualy
                </h3>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                  {(() => {
                    if (typeof directory.howtolaunch === 'string') {
                      return (
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                          {directory.howtolaunch}
                        </p>
                      );
                    } else if (Array.isArray(directory.howtolaunch)) {
                      return (
                        <div className="space-y-3">
                          {directory.howtolaunch.map((step: any, index: number) => (
                            <div key={index} className="flex gap-3">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${theme === 'dark'
                                  ? 'bg-[#EBB207] text-black'
                                  : 'bg-yellow-400 text-black'
                                }`}>
                                {index + 1}
                              </div>
                              <div>
                                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                                  {step.title}
                                </h4>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <pre className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                          {JSON.stringify(directory.howtolaunch, null, 2)}
                        </pre>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            {directory.faqs && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                  FAQs
                </h3>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-white/[0.05]' : 'bg-gray-50'}`}>
                  {(() => {
                    if (typeof directory.faqs === 'string') {
                      return (
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                          {directory.faqs}
                        </p>
                      );
                    } else if (Array.isArray(directory.faqs)) {
                      return (
                        <div className="space-y-4">
                          {directory.faqs.map((faq: any, index: number) => (
                            <div key={index} className={`border-b pb-3 last:border-b-0 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                              }`}>
                              <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-light-900'}`}>
                                {faq.question}
                              </h4>
                              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                                {faq.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <pre className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-light-700'}`}>
                          {JSON.stringify(directory.faqs, null, 2)}
                        </pre>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

             <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
               <Button
                 variant="outline"
                 onClick={() => window.open(directory.url, '_blank')}
                 className="gap-2"
               >
                 <ExternalLink className="w-4 h-4" />
                 Visit Directory
               </Button>
               <Button
                 variant="primary"
                 onClick={() => alert('Agent Coming Soon')}
                 className="gap-2"
               >
                 <Rocket className="w-4 h-4" />
                 Launch
               </Button>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};