'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actionButton?: React.ReactNode;
  closeOnBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actionButton,
  closeOnBackdrop = true
}) => {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const contentHeights: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'max-h-[60vh]',
    md: 'max-h-[70vh]',
    lg: 'max-h-[75vh]',
    xl: 'max-h-[80vh]'
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 backdrop-blur-sm ${
              theme === 'dark' ? 'bg-black/60' : 'bg-black/40'
            }`}
            {...(closeOnBackdrop ? { onClick: onClose } : {})}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${sizes[size]} rounded-2xl shadow-2xl ${
              theme === 'dark'
                ? 'bg-black border border-white/20'
                : 'bg-white border border-gray-200'
            }`}
            style={{
              boxShadow: theme === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark'
                ? 'border-white/10'
                : 'border-gray-200'
            }`}>
              {title && <h2 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-light-900'
              }`}>{title}</h2>}
              <div className="flex items-center gap-2">
                {actionButton}
                <button
                  onClick={onClose}
                  className={`transition-colors p-1 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
             <div className={`p-6 overflow-y-auto ${contentHeights[size]} scrollbar-thin scroll-smooth`}>
               {children}
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};