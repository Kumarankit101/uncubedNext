import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '@/lib/store/themeStore';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  style,
  onClick,
  type = 'button',
  title
}) => {
  const { theme } = useThemeStore();
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border touch-manipulation';

  const getVariants = () => {
    if (theme === 'dark') {
      return {
        primary: 'bg-white text-black border-white hover:bg-gray-100 hover:border-gray-100 shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600 active:scale-95',
        glass: 'bg-white/10 text-white border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-sm active:scale-95',
        outline: 'bg-transparent text-white border-white/30 hover:bg-white/5 hover:border-white/50 active:scale-95'
      };
    } else {
      return {
        primary: 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:border-gray-800 shadow-sm hover:shadow-md active:scale-95',
        secondary: 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200 hover:border-gray-400 active:scale-95',
         glass: 'bg-white/80 text-gray-900 border-gray-300 hover:bg-white/90 hover:border-gray-400 backdrop-blur-sm active:scale-95',
        outline: 'bg-transparent text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95'
      };
    }
  };

  const variants = getVariants();

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-2.5 text-sm min-h-[44px]',
    lg: 'px-8 py-3 text-base min-h-[48px]'
  };

  const combinedStyle = {
    WebkitTapHighlightColor: 'transparent',
    ...style
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      style={combinedStyle}
      onClick={onClick}
      type={type}
      title={title}
    >
      {loading && <Loader2 className={`w-4 h-4 animate-spin ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />}
      {children}
    </motion.button>
  );
};