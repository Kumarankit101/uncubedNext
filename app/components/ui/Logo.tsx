import React from 'react';
import { useThemeStore } from '@/lib/store/themeStore';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  const { theme } = useThemeStore();

  // Use public folder SVGs for reliable loading
  const logoUrl = theme === 'dark' ? '/Logo.svg' : '/darkLogo.svg';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={logoUrl}
        alt="Uncubed"
        style={{ width: size, height: size }}
        loading="lazy"
        sizes={`${size}px`}
      />
    </div>
  );
};