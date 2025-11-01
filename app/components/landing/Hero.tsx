import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Plus, CheckCircle } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { useAgents } from '@/lib/hooks/useAgents';
import { useThemeStore } from '@/lib/store/themeStore';
import BackgroundRays from '@/app/components/BackgroundRays';

// List of agent IDs to feature in Hero; add IDs here
const featuredAgentIds: string[] = ["f085caf3-d18e-4444-8d70-151c89b96922","c4d3f88a-7e9a-4c62-9c4f-1a72a3e3e8ab", "8eefadcc-648d-4434-b8eb-d9b709ffff4f"];

export const Hero = React.memo(() => {
  const { theme } = useThemeStore();
  const [idea, setIdea] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { agents } = useAgents();
  const landingAgents = useMemo(() => agents.filter(a => featuredAgentIds.includes(a.id)), [agents]);
  const prefersReducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleGetStarted = useCallback(() => {
    // Store both the idea text and selected agents in localStorage
    if (idea.trim()) {
      localStorage.setItem('pendingStartupIdea', idea.trim());
    }
    if (selectedAgents.length > 0) {
      localStorage.setItem('pendingSelectedAgents', JSON.stringify(selectedAgents));
    }
    router.push('/signup');
  }, [idea, selectedAgents, router]);

  const toggleAgent = useCallback((agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.max(60, Math.min(156, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > 156 ? 'auto' : 'hidden';
    }
  }, [idea]);

  const canGetStarted = idea.trim().length > 0;

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      {/* Clean Background */}
      <motion.div
        style={{ y, opacity, willChange: 'transform' }}
        className="absolute inset-0 z-0"
      >
        <div className={theme === 'dark' ? 'absolute inset-0 bg-black/80' : 'absolute inset-0 bg-light-50/80'} />



        {/* Fade to black at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent ${
          theme === 'dark' ? 'to-black/80' : 'to-light-50/80'
        }`} />
      </motion.div>

      {/* Background Rays */}
      <div className="absolute inset-0">
        <style>{`
          .rayContainer {
            position: absolute !important;
            inset: 0 !important;
          }
        `}</style>
        <BackgroundRays />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
  

        <motion.h1
          className=" leading-[1.1] mb-6"
          style={{ fontSize: 'clamp(46px, 6vw, 82px)', marginTop: '80px' }}
          initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
        >
          <span className={`block ${
            theme === 'dark' ? 'text-white' : 'text-black'
          }`}>
            Dream Big,{' '}

            Build Fast{" "}

          </span>
  
        </motion.h1>
        
        
        {/* Simple subheading */}
        <motion.p
          className={`text-lg md:text-lg max-w-4xl mx-auto leading-relaxed mb-12 ${
            theme === 'dark' ? 'text-gray-300' : 'text-light-600'
          }`}
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.6 }}
        >
          Uncubed empowers you to launch startups smarter, with{' '}
          <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold">AI agents for every step</span>.
        </motion.p>
    



        {/* Clean input section */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
            <div className="mx-auto" style={{ maxWidth: '720px' }}>
            <div className="relative">


               <div className={`relative p-8 border shadow-xl transition-all duration-200 ${
                 theme === 'dark'
                   ? 'bg-[#0A0A0A] backdrop-blur-sm border-white/20 focus-within:border-white shadow-black/20'
                   : 'bg-white/90 backdrop-blur-sm border-gray-200/60 focus-within:border-black shadow-gray-200/60'
               }`} style={{ height: '220px', borderRadius: '30px', boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : undefined }}>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="The more detailed your description, the better our AI can help "
                      className={`textarea-scroll w-full px-2 py-2 pr-20 bg-transparent text-base resize-none focus:outline-none leading-relaxed transition-colors ${
                        theme === 'dark'
                          ? 'text-white placeholder-gray-400 focus:text-white'
                          : 'text-gray-900 placeholder-gray-500 focus:text-gray-900'
                      }`}
                     style={{
                       height: '60px',
                       wordWrap: 'break-word',
                       whiteSpace: 'pre-wrap',
                       overflowY: 'auto'

                     }}
                    rows={8}
                  />
                  
                   {/* Simple submit button */}
                   <button
                     onClick={handleGetStarted}
                     disabled={!canGetStarted}
                     className={`absolute flex items-center justify-center transition-all duration-200 ${
                       canGetStarted
                         ? theme === 'dark'
                           ? 'bg-white text-black hover:bg-gray-200 hover:scale-110 shadow-lg'
                           : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-110 shadow-lg'
    : theme === 'dark'
    ? 'bg-[#848484] text-gray-400 cursor-not-allowed'
    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                     }`}
                       style={{
                         bottom: '7px',
                         right: '-3px',
                         width: '50px',
                         height: '50px',
                         borderRadius: '25px'
                       }}
                   >
                      <ArrowRight className={`w-8 h-8 transition-transform duration-200 ${
                        canGetStarted ? 'group-hover:translate-x-0.5' : 'text-[#0A0A0A]'
                      }`} />
                   </button>
                </div>

              </div>
            </div>

           </div>
         </motion.div>
         <style>{`
           .textarea-scroll::-webkit-scrollbar {
             width: 8px;
           }
           .textarea-scroll::-webkit-scrollbar-thumb {
             background: ${theme === 'dark' ? '#666' : '#ccc'};
             border-radius: 4px;
           }
           .textarea-scroll::-webkit-scrollbar-track {
             background: transparent;
           }
         `}</style>

                 {/* Agent Selection */}
                
                <motion.div
          initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.7 }}
          className="mb-8"
        >
          <div className="max-w-3xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {landingAgents.map((agent, index) => {
                 const isSelected = selectedAgents.includes(agent.id);
                
                return (
                  <motion.div
                    key={agent.id}
                    initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.8 + index * 0.1 }}
                     className={`relative p-3 rounded-3xl border transition-border-radius duration-300 ease-in-out group hover:rounded-none ${
                       !agent.isActive
                         ? 'opacity-50 cursor-not-allowed bg-gray-800/30 border-gray-700/50'
                         : isSelected
                         ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/40 cursor-pointer shadow-lg'
                          : theme === 'dark'
                          ? 'bg-transparent hover:bg-gray-700/50 border-gray-600/50 hover:border-gray-500/70 cursor-pointer hover:shadow-md'
                          : 'bg-white/60 hover:bg-gray-50/80 border-gray-300/50 hover:border-gray-400/70 cursor-pointer hover:shadow-md'
                     }`}
                    onClick={() => agent.isActive && toggleAgent(agent.id)}
                  >
                     <div className="flex items-center justify-center gap-2">
                       {isSelected ? (
                         <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                       ) : (
                         <Plus className={`w-4 h-4 flex-shrink-0 ${
                           theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                         }`} />
                       )}
                       <h5 className={`font-semibold text-base leading-normal ${
                         theme === 'dark' ? 'text-white' : 'text-gray-900'
                       }`}>{agent.name}</h5>
                     </div>
                  </motion.div>
                );
              })}
            </div>
            
            
          </div>
                </motion.div>

       
      </div>
    </section>
  );
});