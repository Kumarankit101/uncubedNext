import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Crown, Rocket, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import SubscribeButton from '@/app/components/SubscribeButton';
import { useThemeStore } from '@/lib/store/themeStore';

import { Plan } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface PricingProps { subscribe?: boolean; }
export const Pricing: React.FC<PricingProps> = ({ subscribe = false }) => {
  const { theme } = useThemeStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    apiClient.getPlans().then(data => setPlans((data as { plans: Plan[] }).plans));
  }, []);
  const router = useRouter();

const floatingElements = [
  { icon: Star, delay: 0, duration: 4, x: '10%', y: '20%' },
  { icon: Sparkles, delay: 0.5, duration: 5, x: '80%', y: '15%' },
  { icon: Zap, delay: 1, duration: 4.5, x: '15%', y: '70%' },
  { icon: Rocket, delay: 1.5, duration: 5.5, x: '85%', y: '75%' },
];
  const planIcons = [ Rocket, Star,Crown,];

  return (
    <section id="pricing" className="py-32 px-6 relative">
      {/* Clean background that starts and ends with black - matching CTA section */}
      <div className="absolute inset-0">
        {/* Start with black from features */}
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
          theme === 'dark' ? 'from-black' : 'from-light-50'
        } to-transparent`} />

        {/* Main pricing background - pure black like CTA */}
        <div className={`absolute inset-0 ${
          theme === 'dark' ? 'bg-black' : 'bg-light-50'
        }`} />

        {/* End with black for about transition */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent ${
          theme === 'dark' ? 'to-black' : 'to-light-50'
        }`} />
      </div>

      {/* Floating animated elements - matching CTA section */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className="absolute"
              style={{ left: element.x, top: element.y }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut"
              }}
            >
              <div className={`w-8 h-8 backdrop-blur-sm rounded-xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-light-200/30 border border-light-300/30'
              }`}>
                <Icon className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-white/40' : 'text-light-600/60'
                }`} />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Header - Reduced text sizes to match CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >

          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>
            Choose your
            <br />
            <span className={`bg-clip-text text-transparent transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-white to-gray-300'
                : 'bg-gradient-to-r from-light-900 to-light-600'
            }`}>
              startup journey
            </span>
          </h2>

        </motion.div>

        {/* Main Pricing Card - matching CTA section style with black theme */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative mb-20"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-3xl blur opacity-20" />
           <div className={`relative backdrop-blur-md rounded-3xl p-12 ${
             theme === 'dark'
               ? 'bg-white/[0.03] border border-white/[0.08]'
               : 'bg-white/70 border border-gray-200/40'
           }`}>
            <p className={`text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-light-700'
            }`}>
              "Select the perfect plan to accelerate your startup journey. All plans include access to our complete AI toolkit with no hidden fees."
            </p>

            {/* Plans grid - matching CTA section style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {plans.map((plan, index) => {
                const Icon = planIcons[index] || Zap;
                const currentPrice = plan.monthlyPrice;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                      className={`flex flex-col p-6 backdrop-blur-sm transition-all duration-300 group relative overflow-hidden rounded-[30px] hover:rounded-none transition-border-radius duration-300 ease-in-out hover:scale-105 ${
                         theme === 'dark'
                          ? 'bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] shadow-lg hover:shadow-white/10 hover:shadow-2xl hover:shadow-blue-500/20'
                          : 'bg-white/[0.15] border-gray-300/90 hover:bg-white/[0.2] hover:border-gray-400/90 shadow-xl hover:shadow-gray-300/40 hover:shadow-2xl hover:shadow-blue-500/20'
                      }`}
                  >

                    
                    <div className="text-center mb-4">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 ${
                         theme === 'dark' ? 'bg-white/10' : 'bg-light-300/60'
                       }`}>
                          <Icon className={`w-5 h-5 ${
                            theme === 'dark' ? 'text-white' : 'text-light-700'
                          }`} />
                      </div>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-light-900'
                      }`}>{plan.name}</h4>
                      <p className={`text-sm mb-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{plan.description}</p>
                      
                       <div className="flex items-center justify-center gap-2 mb-2">
                         <span className={`text-3xl font-bold ${
                           theme === 'dark' ? 'text-white' : 'text-light-900'
                         }`}> ${currentPrice}</span>
                         <span className={`text-base ${
                           theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                         }`}>/mo</span>
                       </div>
                      
                      <div className={`text-sm mb-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>
                        {plan.monthlyCredits} AI credits included
                      </div>
                    </div>

                    {/* Features - simplified */}
                    <div className="space-y-2 mb-6 flex-grow">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                           <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                             <CheckCircle  className="w-3 h-3 text-green-400 flex-shrink-0" />
                           </div>
                          <span className={`text-sm leading-relaxed ${
                            theme === 'dark' ? 'text-gray-300' : 'text-light-700'
                          }`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button - use SubscribeButton on billing page */}
                    <div className="mt-auto">
                      {subscribe ? (
                        <SubscribeButton planId={plan.id} />
                      ) : (
                          <Button
                            variant="primary"
                            size="md"
                            className={`w-full transition-all duration-200 ${
                              theme === 'dark'
                                ? ''
                                : 'bg-black text-white border-black hover:bg-gray-900 hover:border-gray-900'
                            }`} onClick={() => router.push('/signup')}
                          >
                          {currentPrice === 0 ? 'Get Started Free' : 'Get Started'}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};