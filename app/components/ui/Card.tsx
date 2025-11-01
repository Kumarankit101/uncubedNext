import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/lib/store/themeStore';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  gradient = false
}) => {
  const { theme } = useThemeStore();
  const baseClasses = gradient
    ? `rounded-2xl p-6 border ${
        theme === 'dark' ? 'border-white/10' : 'border-gray-200'
      }`
    : `rounded-2xl p-6 ${
        theme === 'dark'
          ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08]'
          : 'bg-white/80 backdrop-blur-md border border-gray-200/60'
      }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};