import React from 'react';
import { loadCredits } from '@/app/(protected)/loaders';
import CreditsClient from './CreditsClient';

export const revalidate = 60;

export default async function Credits() {
  const credits = await loadCredits();
  return <CreditsClient initialCredits={credits} />;
}
