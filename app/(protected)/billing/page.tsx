'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Crown, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import SubscribeButton from '@/app/components/SubscribeButton';
import { Plan } from '@/lib/types';
import { apiClient } from '@/lib/api';

const BillingPricing: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    apiClient.getPlans().then(data => setPlans((data as { plans: Plan[] }).plans));
  }, []);

  const floatingElements = [
    { icon: Star, delay: 0, duration: 4, x: '10%', y: '20%' },
    { icon: Sparkles, delay: 0.5, duration: 5, x: '80%', y: '15%' },
    { icon: Zap, delay: 1, duration: 4.5, x: '15%', y: '70%' },
    { icon: Rocket, delay: 1.5, duration: 5.5, x: '85%', y: '75%' },
  ];
  const planIcons = [ Rocket, Star, Crown ];

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
      </div>

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
              <div className="w-8 h-8 backdrop-blur-sm rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
                <Icon className="w-4 h-4 text-white/40" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
            Choose your
            <br />
            startup journey
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative mb-20"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-3xl blur opacity-20" />
          <div className="relative backdrop-blur-md rounded-3xl p-12 bg-white/[0.03] border border-white/[0.08]">
            <p className="text-lg leading-relaxed max-w-4xl mx-auto mb-8 text-center text-gray-300">
              "Select the perfect plan to accelerate your startup journey. All plans include access to our complete AI toolkit with no hidden fees."
            </p>

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
                    className="flex flex-col p-6 backdrop-blur-sm transition-all duration-300 group relative overflow-hidden rounded-[30px] hover:scale-105 bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] shadow-lg hover:shadow-white/10 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-white/10">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2 text-white">{plan.name}</h4>
                      <p className="text-sm mb-4 text-gray-400">{plan.description}</p>

                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl font-bold text-white"> ${currentPrice}</span>
                        <span className="text-base text-gray-400">/mo</span>
                      </div>

                      <div className="text-sm mb-4 text-gray-400">
                        {plan.monthlyCredits} AI credits included
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-grow">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          </div>
                          <span className="text-sm leading-relaxed text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <SubscribeButton planId={plan.id} />
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

export default function Billing() {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 -mt-24">
        <BillingPricing />
      </div>
    </div>
  );
}
