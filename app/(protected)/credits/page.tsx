'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/themeStore';
import useCredits from '@/lib/hooks/useCredits';

export default function Credits() {
  const { theme } = useThemeStore();
  const credits = useCredits();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Credits</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>Manage and track your AI credits usage</p>
      </div>

      <div className={`p-8 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <h2 className={`text-2xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Available Credits</h2>
        <p className={`text-4xl font-bold ${
          theme === 'dark' ? 'text-[#EBB207]' : 'text-black'
        }`}>{credits || 0}</p>
      </div>
    </motion.div>
  );
}
