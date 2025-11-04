'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/themeStore';
import BackgroundRays from '@/app/components/BackgroundRays';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const features = [
  {
    imageIndex: 2,
    title: 'AI App Builder',
    description: 'Transform your ideas into fully functional apps using AI. No coding skills needed just describe your vision and watch it come to life.',
  },
  {
    imageIndex: 3,
    title: 'Competitor Analysis',
    description: 'Conduct thorough competitor analysis, identifying direct and indirect rivals, and gathering essential insights about each.',
  },
  {
    imageIndex: 4,
    title: 'Feature Prioritization',
    description: 'Prioritize features based on their potential impact and implementation feasibility to build the most effective startup.',
  },
  {
    imageIndex: 5,
    title: 'Market Research',
    description: 'Dive deep into market research to understand the landscape, trends, and opportunities for your startup idea.',
  },
  {
    imageIndex: 6,
    title: 'Pitch Deck Generator',
    description: 'Create professional pitch decks that captivate investors with compelling narratives and stunning visuals.',
  },
];

export const Features: React.FC = () => {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  return (
    <section id="features" className="py-32 px-6 relative">
      {/* Background matching Hero section colors */}
      <div className="absolute inset-0">
        {/* Start with black from hero */}
        <div
          className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
            theme === 'dark' ? 'from-black' : 'from-light-50'
          } to-transparent`}
        />

        {/* Main features background - same as Hero */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark' ? 'bg-black' : 'bg-light-50'
          }`}
        />

        {/* Single dim red glowing light in background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(239,68,68,0.08),transparent_70%)]" />

        {/* End with black for pricing transition */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent ${
            theme === 'dark' ? 'to-black' : 'to-light-50'
          }`}
        />
      </div>

      {/* Background Rays */}
      <div className="absolute inset-0 features-rays">
        <style>{`
          .features-rays .rayContainer {
            position: absolute !important;
            inset: 0 !important;
          }
          .features-rays .ray1 { bottom: auto !important; top: -500px !important; left: -120px !important; }
          .features-rays .ray2 { bottom: auto !important; top: -300px !important; left: 180px !important; }
          .features-rays .ray3 { bottom: auto !important; top: -320px !important; left: 480px !important; }
          .features-rays .ray4 { bottom: auto !important; top: -350px !important; left: 780px !important; }
          .features-rays .ray5 { bottom: auto !important; top: -250px !important; left: 980px !important; }
          .features-rays .ray6 { bottom: auto !important; top: -400px !important; left: 580px !important; }
          .features-rays .ray7 { bottom: auto !important; top: -450px !important; left: 330px !important; }
          .features-rays .ray8 { bottom: auto !important; top: -380px !important; left: 730px !important; }
        `}</style>
        <BackgroundRays />
      </div>

       <div className="max-w-7xl mx-auto relative space-y-20">
            <video
              src="/demo_1080.mp4"
              controls
              className="max-w-4xl w-full aspect-video rounded-2xl border-none mx-auto"
              preload="metadata"
            >
             Your browser does not support the video tag.
           </video>
         {/* Hero Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="text-center md:text-left">
            <motion.h1
              className=" leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(28px, 3vw, 60px)', marginTop: '80px' }}
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
            >
              <span className={`block ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Turn thoughts into things
              </span>
            </motion.h1>
            <p
              className={`text-lg mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-light-600'
              }`}
            >
              Tell Uncubed your idea, and see it come to life as a full-scale startup researched, designed, and ready to launch.
            </p>
             <Button className="px-6 py-3 text-lg" onClick={handleSignUp}>Start Building</Button>
          </div>

         {/* Sample app visual */}
         <div className="flex justify-center md:justify-end">
           <motion.div className={`rounded-xl border ${theme === 'dark' ? 'border-white' : 'border-black'} w-full max-w-2xl relative overflow-hidden`} style={{ height: '400px' }}>
             <Image
               src={theme === 'dark' ? `/images/black/feature-1.webp` : `/images/white/feature-1.webp`}
               alt="Sample App Interface"
               fill
               className="object-contain"
               sizes="(max-width: 768px) 100vw, 50vw"
             />
           </motion.div>
         </div>
      </motion.div>
        
  

        {/* Features list */}
        {features.map((feature, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
                {!isEven && (
                  <div className="flex justify-center">
                    <motion.div className={`rounded-xl border ${theme === 'dark' ? 'border-white' : 'border-black'} w-full max-w-2xl relative overflow-hidden`} style={{ height: '400px' }}>
                      <Image
                        src={
                          theme === 'dark'
                            ? `/images/black/feature-${feature.imageIndex}.webp`
                            : `/images/white/feature-${feature.imageIndex}.webp`
                        }
                        alt={feature.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </motion.div>
                  </div>
                )}
              <div
                className={`text-center md:text-left ${
                  !isEven ? 'md:pl-8' : 'md:pr-8'
                }`}
              >
                 <motion.h3
                   className=" leading-[1.1] mb-6"
                   style={{ fontSize: 'clamp(24px, 2.5vw, 52px)' }}
                   initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
                 >
                   <span className={`block ${
                     theme === 'dark' ? 'text-white' : 'text-black'
                   }`}>
                     {feature.title}
                   </span>
                 </motion.h3>
                 <p
                   className={`text-lg leading-relaxed ${
                     theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                   }`}
                 >
                   {feature.description}
                 </p>
              </div>
                 {isEven && (
                   <div className="flex justify-center">
                     <motion.div className={`rounded-xl border ${theme === 'dark' ? 'border-white' : 'border-black'} w-full max-w-2xl relative overflow-hidden`} style={{ height: '400px' }}>
                       <Image
                         src={
                           theme === 'dark'
                             ? `/images/black/feature-${feature.imageIndex}.webp`
                             : `/images/white/feature-${feature.imageIndex}.webp`
                         }
                         alt={feature.title}
                         fill
                         className="object-contain"
                         sizes="(max-width: 768px) 100vw, 50vw"
                       />
                     </motion.div>
                   </div>
                 )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};