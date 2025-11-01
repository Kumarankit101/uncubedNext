'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/app/components/landing/Navigation';
import { Hero } from '@/app/components/landing/Hero';
import { Features } from '@/app/components/landing/Features';
import { Pricing } from '@/app/components/landing/Pricing';
import { About } from '@/app/components/landing/About';
import { Contact } from '@/app/components/landing/Contact';
import { Footer } from '@/app/components/landing/Footer';

export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle hash-based navigation for smooth scrolling to sections
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="relative">
      <Navigation />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
