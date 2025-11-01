import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, BarChart3 } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';

interface FeatureInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface FeatureOutput {
  name: string;
  type: string;
  description: string;
}

interface DetailedDescription {
  overview: string;
  requirements: string[];
  inputs: FeatureInput[];
  outputs: FeatureOutput[];
  notes?: string;
}

interface PrioritizedFeature {
  featureName: string;
  priority: number;
  reasoning?: string;
  mustHave: boolean;
  detailedDescription: DetailedDescription;
  prompt?: string;
}

interface CompetitorFeatureAnalysis {
  featureName: string;
  count: number;
}

interface FeaturePrioritizerData {
  startupName?: string;
  startupIdea?: string;
  problem?: string;
  solution?: string;
  totalCompetitors?: number;
  prioritizedFeatures: PrioritizedFeature[];
  competitorFeatureAnalysis: CompetitorFeatureAnalysis[];
}

export interface FeaturePrioritizerResultProps {
  content: string;
  status: 'completed' | 'running' | 'failed';
}

export const FeaturePrioritizerResult = React.memo<FeaturePrioritizerResultProps>(({
  content,
  status,
}) => {
  const { theme } = useThemeStore();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [inputsCollapsed, setInputsCollapsed] = useState<Set<string>>(new Set());
  const [outputsCollapsed, setOutputsCollapsed] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFeaturePrompt, setSelectedFeaturePrompt] = useState<string>('');

  let data: FeaturePrioritizerData | null = null;
  try {
    const parsed = JSON.parse(content);
    // Handle nested structure where data is under 'output' key
    data = parsed.output || parsed;
    // Normalize prioritizedFeatures to array
    if (data && data.prioritizedFeatures && !Array.isArray(data.prioritizedFeatures)) {
      data.prioritizedFeatures = Object.values(data.prioritizedFeatures);
    }
  } catch (error) {
    console.error('Error parsing feature prioritizer data:', error);
  }

  if (!data || status !== 'completed') {
    return (
      <div className={`p-8 rounded-xl shadow-md ${
        theme === 'dark'
          ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
          : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
      }`}>
        <div className="text-center">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
          }`}>
            {status === 'running' ? 'Analyzing features...' : 'Feature prioritization data not available'}
          </p>
        </div>
      </div>
    );
  }

  const toggleFeatureExpansion = (featureName: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureName)) {
      newExpanded.delete(featureName);
    } else {
      newExpanded.add(featureName);
    }
    setExpandedFeatures(newExpanded);
  };

  const toggleInputsCollapse = (featureName: string) => {
    const newCollapsed = new Set(inputsCollapsed);
    if (newCollapsed.has(featureName)) {
      newCollapsed.delete(featureName);
    } else {
      newCollapsed.add(featureName);
    }
    setInputsCollapsed(newCollapsed);
  };

  const toggleOutputsCollapse = (featureName: string) => {
    const newCollapsed = new Set(outputsCollapsed);
    if (newCollapsed.has(featureName)) {
      newCollapsed.delete(featureName);
    } else {
      newCollapsed.add(featureName);
    }
    setOutputsCollapsed(newCollapsed);
  };

  const sortedFeatures = [...data.prioritizedFeatures].sort((a, b) => a.priority - b.priority);

  const filteredFeatures = sortedFeatures;

  const totalCompetitors = data.totalCompetitors || Math.max(...data.competitorFeatureAnalysis.map(c => c.count));

  return (
    <>
      <div className="space-y-8">
        {/* Features Section */}
        <div className={`p-6 rounded-xl shadow-md ${
          theme === 'dark'
            ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
            : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
        }`}>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>
              Prioritized Features
            </h3>
          </div>

          <div className="space-y-4">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.featureName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-white/[0.02] border-white/[0.05]'
                    : 'bg-gray-50/50 border-gray-200'
                } overflow-hidden`}
              >
                <div
                  className={`p-4 cursor-pointer transition-colors ${
                    theme === 'dark' ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-100/50'
                  }`}
                  onClick={() => toggleFeatureExpansion(feature.featureName)}
                >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                         feature.priority <= 2
                           ? 'bg-red-500 text-white'
                           : feature.priority <= 4
                             ? 'bg-orange-500 text-white'
                             : 'bg-yellow-500 text-white'
                       }`}>
                         {feature.priority}
                       </div>
                       <h4 className={`font-medium ${
                         theme === 'dark' ? 'text-white' : 'text-light-900'
                       }`}>
                         {feature.featureName}
                       </h4>
                       {feature.mustHave && (
                         <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                           <Star className="w-3 h-3 text-green-400 fill-current" />
                           <span className="text-xs text-green-400 font-medium">Must-Have</span>
                         </div>
                       )}
                     </div>
                     <div className="flex items-center gap-2">
                       {feature.prompt && (
                         <div
                           onClick={(e: React.MouseEvent) => {
                             e.stopPropagation();
                             setSelectedFeaturePrompt(feature.prompt || '');
                             setIsModalOpen(true);
                           }}
                         >
                           <Button variant="glass" size="sm">
                             View Prompt
                           </Button>
                         </div>
                       )}
                       <div className={`transition-transform duration-200 ${
                         expandedFeatures.has(feature.featureName) ? 'rotate-180' : ''
                       }`}>
                         <ChevronDown className={`w-5 h-5 ${
                           theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                         }`} />
                       </div>
                     </div>
                   </div>
                </div>

                <AnimatePresence>
                  {expandedFeatures.has(feature.featureName) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`px-4 pb-4 ${
                        theme === 'dark' ? 'border-t border-white/[0.05]' : 'border-t border-gray-200'
                      }`}
                    >
                       <div className="pt-4 space-y-4">
                         <div>
                          <h5 className={`text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                          }`}>
                            Overview
                          </h5>
                          <p className={`text-sm leading-relaxed ${
                            theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                          }`}>
                            {feature.detailedDescription.overview}
                          </p>
                        </div>

                        {feature.detailedDescription.requirements.length > 0 && (
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                            }`}>
                              Requirements
                            </h5>
                             <ul className="list-disc list-inside space-y-1">
                               {feature.detailedDescription.requirements.map((req: string, idx: number) => (
                                 <li key={idx} className={`text-sm ${
                                   theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                 }`}>
                                   {req}
                                 </li>
                               ))}
                             </ul>
                          </div>
                        )}

                        {feature.detailedDescription.inputs.length > 0 && (
                          <div>
                            <div
                              className="flex items-center justify-between cursor-pointer mb-2"
                              onClick={() => toggleInputsCollapse(feature.featureName)}
                            >
                              <h5 className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                              }`}>
                                Inputs
                              </h5>
                              <div className={`transition-transform duration-200 ${
                                inputsCollapsed.has(feature.featureName) ? '' : 'rotate-180'
                              }`}>
                                <ChevronUp className={`w-4 h-4 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                }`} />
                              </div>
                            </div>
                            <AnimatePresence>
                              {!inputsCollapsed.has(feature.featureName) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className={`overflow-x-auto rounded-lg border ${
                                    theme === 'dark'
                                      ? 'border-white/[0.05] bg-white/[0.02]'
                                      : 'border-gray-200 bg-gray-50/50'
                                  }`}>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className={`${
                                          theme === 'dark' ? 'border-white/[0.05]' : 'border-gray-200'
                                        }`}>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Name</th>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Type</th>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Description</th>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Required</th>
                                        </tr>
                                      </thead>
                                       <tbody>
                                         {feature.detailedDescription.inputs.map((input: FeatureInput, idx: number) => (
                                          <tr key={idx} className={`${
                                            theme === 'dark'
                                              ? 'border-t border-white/[0.02] hover:bg-white/[0.01]'
                                              : 'border-t border-gray-100 hover:bg-gray-50/50'
                                          }`}>
                                            <td className={`p-3 font-medium ${
                                              theme === 'dark' ? 'text-white' : 'text-light-900'
                                            }`}>{input.name}</td>
                                            <td className={`p-3 ${
                                              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                            }`}>{input.type}</td>
                                            <td className={`p-3 ${
                                              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                            }`}>{input.description}</td>
                                            <td className="p-3">
                                              {input.required ? (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                  Required
                                                </span>
                                              ) : (
                                                <span className={`text-xs ${
                                                  theme === 'dark' ? 'text-gray-500' : 'text-light-500'
                                                }`}>
                                                  Optional
                                                </span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                        {feature.detailedDescription.outputs.length > 0 && (
                          <div>
                            <div
                              className="flex items-center justify-between cursor-pointer mb-2"
                              onClick={() => toggleOutputsCollapse(feature.featureName)}
                            >
                              <h5 className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                              }`}>
                                Outputs
                              </h5>
                              <div className={`transition-transform duration-200 ${
                                outputsCollapsed.has(feature.featureName) ? '' : 'rotate-180'
                              }`}>
                                <ChevronUp className={`w-4 h-4 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                }`} />
                              </div>
                            </div>
                            <AnimatePresence>
                              {!outputsCollapsed.has(feature.featureName) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className={`overflow-x-auto rounded-lg border ${
                                    theme === 'dark'
                                      ? 'border-white/[0.05] bg-white/[0.02]'
                                      : 'border-gray-200 bg-gray-50/50'
                                  }`}>
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className={`${
                                          theme === 'dark' ? 'border-white/[0.05]' : 'border-gray-200'
                                        }`}>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Name</th>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Type</th>
                                          <th className={`p-3 text-left font-medium ${
                                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                          }`}>Description</th>
                                        </tr>
                                      </thead>
                                       <tbody>
                                         {feature.detailedDescription.outputs.map((output: FeatureOutput, idx: number) => (
                                          <tr key={idx} className={`${
                                            theme === 'dark'
                                              ? 'border-t border-white/[0.02] hover:bg-white/[0.01]'
                                              : 'border-t border-gray-100 hover:bg-gray-50/50'
                                          }`}>
                                            <td className={`p-3 font-medium ${
                                              theme === 'dark' ? 'text-white' : 'text-light-900'
                                            }`}>{output.name}</td>
                                            <td className={`p-3 ${
                                              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                                            }`}>{output.type}</td>
                                            <td className={`p-3 ${
                                              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                                            }`}>{output.description}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}

                         {feature.detailedDescription.notes && (
                           <div>
                             <h5 className={`text-sm font-medium mb-2 ${
                               theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                             }`}>
                               Notes
                             </h5>
                             <p className={`text-sm leading-relaxed ${
                               theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                             }`}>
                               {feature.detailedDescription.notes}
                             </p>
                           </div>
                         )}
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Competitor Feature Analysis Section */}
        <div className={`p-6 rounded-xl shadow-md ${
          theme === 'dark'
            ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
            : 'bg-white/80 backdrop-blur-md border border-gray-400/70'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className={`w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`} />
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>
              Competitor Feature Analysis
            </h3>
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>
              ({totalCompetitors} competitors analyzed)
            </span>
          </div>

          <div className={`overflow-x-auto rounded-lg border ${
            theme === 'dark'
              ? 'border-white/[0.05] bg-white/[0.02]'
              : 'border-gray-200 bg-gray-50/50'
          }`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={`${
                  theme === 'dark' ? 'border-white/[0.05]' : 'border-gray-200'
                }`}>
                  <th className={`p-4 text-left font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                  }`}>Feature Name</th>
                  <th className={`p-4 text-left font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                  }`}>Competitor Count</th>
                  <th className={`p-4 text-left font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                  }`}>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {data.competitorFeatureAnalysis.map((analysis, idx) => (
                  <tr key={idx} className={`${
                    theme === 'dark'
                      ? 'border-t border-white/[0.02] hover:bg-white/[0.01]'
                      : 'border-t border-gray-100 hover:bg-gray-50/50'
                  }`}>
                    <td className={`p-4 font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-light-900'
                    }`}>{analysis.featureName}</td>
                    <td className={`p-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                    }`}>{analysis.count}</td>
                     <td className="p-4">
                       <div className="flex items-center gap-2">
                         <div className={`h-2 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 rounded-full`} style={{ width: `${(analysis.count / totalCompetitors) * 100}%` }}></div>
                         <span className={`text-xs ${
                           theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                         }`}>
                           {Math.round((analysis.count / totalCompetitors) * 100)}%
                         </span>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedFeaturePrompt && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Implementation Prompt"
          size="xl"
          actionButton={
            <Button
              variant="glass"
              size="sm"
              onClick={() => navigator.clipboard.writeText(selectedFeaturePrompt)}
            >
              Copy
            </Button>
          }
        >
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{selectedFeaturePrompt}</pre>
        </Modal>
      )}
    </>
  );
});