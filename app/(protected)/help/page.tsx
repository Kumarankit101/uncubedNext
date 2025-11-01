'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/themeStore';
import { Button } from '@/app/components/ui/Button';
import { Mail, MessageSquare, FileText } from 'lucide-react';

export default function Help() {
  const { theme } = useThemeStore();

  const faqs = [
    { question: 'How do I get started?', answer: 'Create a new project and select AI agents to analyze your startup idea.' },
    { question: 'What are credits used for?', answer: 'Credits are consumed when running AI agents to generate insights and analysis.' },
    { question: 'Can I downgrade my plan?', answer: 'Yes, you can change your plan anytime from the billing page.' },
    { question: 'How long do results stay available?', answer: 'All your project results and agent outputs are stored indefinitely.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl"
    >
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Help & Support</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>Find answers to common questions and get support</p>
      </div>

      <div className={`p-8 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className={`p-4 rounded-lg border cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05]'
                  : 'bg-white/[0.08] border-gray-300/30 hover:bg-white/[0.12]'
              }`}
            >
              <summary className={`font-medium ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>
                {faq.question}
              </summary>
              <p className={`mt-3 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-light-600'
              }`}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <div className={`p-8 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Need more help?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="mailto:support@uncubed.ai" className="block">
            <Button variant="glass" className="w-full gap-2 justify-center">
              <Mail className="w-4 h-4" />
              Email Support
            </Button>
          </a>
          <Button variant="glass" className="gap-2 justify-center">
            <MessageSquare className="w-4 h-4" />
            Live Chat
          </Button>
        </div>
      </div>

      <div className={`p-8 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <h3 className={`text-lg font-semibold mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Resources</h3>
        <div className="space-y-2">
          <a href="#" className={`flex items-center gap-2 ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            <FileText className="w-4 h-4" />
            Documentation
          </a>
          <a href="#" className={`flex items-center gap-2 ${
            theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            <FileText className="w-4 h-4" />
            API Reference
          </a>
        </div>
      </div>
    </motion.div>
  );
}
