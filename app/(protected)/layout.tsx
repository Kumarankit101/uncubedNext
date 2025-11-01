'use client';

import React from 'react';
import { Header } from '@/app/components/layout/Header';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-24 px-6 pb-16">
        {children}
      </main>
    </>
  );
}
