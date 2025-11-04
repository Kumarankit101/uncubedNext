'use client';

import React from 'react';
import { useThemeStore } from '@/lib/store/themeStore';

type Variant = 'text' | 'title' | 'avatar' | 'button' | 'card' | 'chip';

interface SkeletonProps {
  variant?: Variant;
  shimmer?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ variant = 'text', shimmer = false, className = '', style }: SkeletonProps) {
  const { theme } = useThemeStore();
  const base = theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-gray-200 border border-gray-300/30';
  const shimmerCls = shimmer ? 'relative overflow-hidden before:content-[""] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[shimmer_1.2s_infinite]' : '';

  const shape: Record<Variant, string> = {
    text: 'h-4 rounded-md',
    title: 'h-6 rounded-md',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 rounded-xl',
    card: 'h-24 rounded-2xl',
    chip: 'h-6 rounded-full',
  };

  return (
    <div className={`${base} ${shape[variant]} ${shimmerCls} ${className}`} style={style} />
  );
}

// keyframes for shimmer (scoped via inline utility above)
// @keyframes shimmer { 100% { transform: translateX(100%); } }
