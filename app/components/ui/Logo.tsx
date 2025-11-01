import React from 'react';
import { useThemeStore } from '@/lib/store/themeStore';
import LogoLight from '@/app/assets/Logo.svg';
import LogoDark from '@/app/assets/darkLogo.svg';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  const { theme } = useThemeStore();

  const logoSrc = theme === 'dark' ? LogoLight : LogoDark;
  const logoUrl = typeof logoSrc === 'string' ? logoSrc : logoSrc.src;

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