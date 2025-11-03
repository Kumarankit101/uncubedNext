import type { Metadata } from 'next';
import { Navigation } from '@/app/components/landing/Navigation';
import { Hero } from '@/app/components/landing/Hero';
import { Features } from '@/app/components/landing/Features';
import { Pricing } from '@/app/components/landing/Pricing';
import { About } from '@/app/components/landing/About';
import { Contact } from '@/app/components/landing/Contact';
import { Footer } from '@/app/components/landing/Footer';

export const runtime = 'edge';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Uncubed - AI-powered startup co-pilot',
  description: 'Transform your startup ideas into reality with AI-powered analysis, market research, and strategic guidance.',
};

export default function Home() {
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
