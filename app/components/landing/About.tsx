'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Lightbulb, Rocket } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We believe every great company starts with a bold idea. Our mission is to help turn those ideas into reality.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Users,
    title: 'Democratizing Entrepreneurship',
    description: 'Making world-class business tools accessible to everyone, regardless of background or resources.',
    color: 'from-orange-500 to-yellow-500'
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'Every feature we build is designed to help you make better decisions and achieve real business outcomes.',
    color: 'from-yellow-500 to-red-500'
  },
  {
    icon: Heart,
    title: 'Community-Focused',
    description: 'Building a supportive ecosystem where entrepreneurs can learn, grow, and succeed together.',
    color: 'from-pink-500 to-red-500'
  }
];



export const About: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <section id="about" className="py-32 px-6 relative">
      {/* Clean background that starts and ends with black */}
      <div className="absolute inset-0">
        {/* Start with black from pricing */}
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
          theme === 'dark' ? 'from-black' : 'from-light-50'
        } to-transparent`} />

        {/* Main about background */}
        <div className={`absolute inset-0 ${
          theme === 'dark' ? 'bg-black' : 'bg-light-50'
        }`} />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, rgba(16,185,129,${theme === 'dark' ? 0.1 : 0.15}), transparent 70%)`
          }}
        />
        
        {/* End with black for contact transition */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent ${
          theme === 'dark' ? 'to-black' : 'to-light-50'
        }`} />
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-light-900'
          }`}>
            Empowering the next
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              generation of builders
            </span>
          </h2>

        </motion.div>

        {/* Mission and Values Split Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          viewport={{ once: true }}
          className="px-8 md:px-16 py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0">
            {/* Left Column: Mission */}
            <div className="space-y-6 md:px-12">
              <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <Rocket className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                  </div>
                <h3 className={`text-xl md:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-light-900'
                }`}>Our Mission</h3>
              </div>
              <p className={`text-xl md:text-2xl font-light leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-light-700'
              }`}>
                "To empower every entrepreneur with AI-driven insights and tools that were once only available
                to well-funded startups and Fortune 500 companies. We're leveling the playing field and making
                startup success accessible to all."
              </p>
            </div>

            {/* Right Column: Values */}
             <div className={`space-y-8 md:border-l md:px-12 ${
               theme === 'dark' ? 'border-green-400/70' : 'border-green-500/90'
             }`}>
              <h3 className={`text-xl md:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>Our Values</h3>
              <div className="grid grid-cols-2 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="space-y-3"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                        </div>
                      <h4 className={`text-base font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-light-900'
                      }`}>{value.title}</h4>
                      <p className={`text-sm leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-light-600'
                      }`}>{value.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};