import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/app/components/landing/Navigation';
import { Footer } from '@/app/components/landing/Footer';
import BackgroundRays from '@/app/components/BackgroundRays';
import { SharedResultClient } from './client';

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export const runtime = 'edge';
export const revalidate = 300;
export const dynamicParams = true;

async function fetchResult(type: string, id: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (type === 'competitor-finder') {
    const res = await fetch(`${baseUrl}/competitors/public/${id}`, {
      next: { revalidate: 300, tags: ['public-competitor', id] }
    });
    if (!res.ok) throw new Error(res.status === 404 ? 'Result not found' : 'Failed to fetch');
    return res.json();
  } else {
    const res = await fetch(`${baseUrl}/outputs/public/${id}`, {
      next: { revalidate: 300, tags: ['public-result', id] }
    });
    if (!res.ok) throw new Error(res.status === 404 ? 'Result not found' : 'Failed to fetch');
    return res.json();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const { type, id } = resolved;
  try {
    const data = await fetchResult(type, id);
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: `View ${data.agentName} results for ${data.title}`,
      author: {
        '@type': 'Organization',
        name: 'Uncubed',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Uncubed',
      },
      datePublished: new Date().toISOString(),
    };
    return {
      title: `${data.title} - Uncubed AI Results`,
      description: `View ${data.agentName} results for ${data.title}`,
      openGraph: {
        title: `${data.title} - Uncubed AI Results`,
        description: `View ${data.agentName} results for ${data.title}`,
        type: 'article',
      },
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch {
    return {
      title: 'Result Not Found - Uncubed',
    };
  }
}

export default async function SharedResult({ params }: PageProps) {
  const resolved = await params;
  const { type, id } = resolved;
  let data;
  try {
    data = await fetchResult(type, id);
  } catch (err) {
    notFound();
  }

  return (
    <div className="min-h-screen relative bg-light-50 text-black">
      <BackgroundRays />
      <Navigation />
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-8 space-y-8 relative z-10">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-light-900">{data.title}</h1>
          <p className="text-lg text-light-600">{data.agentName}</p>
        </div>
        <SharedResultClient data={data} type={type} />
      </div>
      <Footer />
    </div>
  );
}


