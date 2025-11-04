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

// Add feature-1 for the hero section
const allFeatures = [
  {
    imageIndex: 1,
    title: 'Turn thoughts into things',
    description: 'Tell Uncubed your idea, and see it come to life as a full-scale startup researched, designed, and ready to launch.',
  },
  ...features,
];

export const Features: React.FC = () => {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

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
            {/* Video Section with Arrow */}
            <div className="relative flex justify-center items-center">
              {/* Arrow and Text on Left - Positioned Absolutely */}
              <motion.div
                className="hidden md:flex flex-col items-center gap-4 absolute left-0 top-1/3 -translate-y-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3
                  className={`text-base lg:text-lg font-semibold whitespace-nowrap ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  uncubed in 1 minute
                </h3>
                <Image
                  src="/arrow.svg"
                  alt="Arrow pointing to video"
                  width={120}
                  height={80}
                  className={`${theme === 'dark' ? 'invert' : ''}`}
                />
              </motion.div>

              {/* Text for Mobile - Above Video */}
              <motion.div
                className="md:hidden mb-6"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3
                  className={`text-xl text-center font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}
                >
                  uncubed in 1 minute
                </h3>
              </motion.div>

              {/* YouTube Video - Centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`w-full max-w-4xl border rounded-3xl p-4 ${
                  theme === 'dark' ? 'border-white/20' : 'border-black/20'
                }`}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/At8lvPFbYIo"
                  className="w-full aspect-video rounded-2xl border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Uncubed Demo"
                />
              </motion.div>
            </div>

        {/* Gap between video and features */}
        <div className="h-32" />

        {/* Scroll-linked Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
          {/* Left side - Scrolling text content */}
          <div className="space-y-32">
            {allFeatures.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                onViewportEnter={() => setActiveFeatureIndex(idx)}
                transition={{ duration: 0.5 }}
                viewport={{ once: false, amount: 0.5 }}
                className="min-h-[400px] flex flex-col justify-center"
              >
                <motion.h2
                  className="leading-[1.1] mb-6"
                  style={{ fontSize: 'clamp(28px, 3vw, 52px)' }}
                >
                  <span className={`block ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {feature.title}
                  </span>
                </motion.h2>
                <p
                  className={`text-lg leading-relaxed mb-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                  }`}
                >
                  {feature.description}
                </p>
                {idx === 0 && (
                  <Button className="px-6 py-3 text-lg w-fit" onClick={handleSignUp}>
                    Start Building
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right side - Sticky image frame */}
          <div className="hidden md:block">
            <div className="sticky top-32 h-[500px]">
              <motion.div
                key={activeFeatureIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl border ${
                  theme === 'dark' ? 'border-white' : 'border-black'
                } w-full h-full relative overflow-hidden`}
              >
                <Image
                  src={
                    theme === 'dark'
                      ? `/images/black/feature-${allFeatures[activeFeatureIndex].imageIndex}.webp`
                      : `/images/white/feature-${allFeatures[activeFeatureIndex].imageIndex}.webp`
                  }
                  alt={allFeatures[activeFeatureIndex].title}
                  fill
                  className="object-contain"
                  sizes="50vw"
                />
              </motion.div>
            </div>
          </div>

          {/* Mobile view - Show images inline */}
          <div className="md:hidden space-y-16">
            {allFeatures.map((feature) => (
              <motion.div
                key={`mobile-${feature.title}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`rounded-xl border ${
                  theme === 'dark' ? 'border-white' : 'border-black'
                } w-full h-[300px] relative overflow-hidden`}
              >
                <Image
                  src={
                    theme === 'dark'
                      ? `/images/black/feature-${feature.imageIndex}.webp`
                      : `/images/white/feature-${feature.imageIndex}.webp`
                  }
                  alt={feature.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};