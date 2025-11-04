import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Header } from '@/app/components/layout/Header';
import { AuthSync } from '@/app/components/AuthSync';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <>
      <AuthSync />
      <Header />
      <main className="pt-24 px-6 pb-16">{children}</main>
    </>
  );
}
