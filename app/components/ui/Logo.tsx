import React from 'react';
import Image from 'next/image';
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
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={logoUrl}
        alt="Uncubed"
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};