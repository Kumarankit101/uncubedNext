'use client';


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/themeStore';
import { Button } from '@/app/components/ui/Button';
import { ThemeToggle } from '@/app/components/ui/ThemeToggle';

export default function Settings() {
  const { theme } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-2xl"
    >
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Settings</h1>
        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>Manage your account preferences and settings</p>
      </div>

      <div className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-semibold mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-light-900'
            }`}>Theme</h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-light-600'
            }`}>Choose between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${
        theme === 'dark'
          ? 'bg-white/[0.03] border-white/[0.08]'
          : 'bg-white/[0.12] border-gray-400/70'
      }`}>
        <h3 className={`font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-light-900'
        }`}>Account</h3>
        <p className={`text-sm mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>Manage your account information and preferences</p>
        <Button variant="glass">Manage Account</Button>
      </div>
    </motion.div>
  );
}
