import React from 'react';
import { loadPlans } from '@/app/(protected)/loaders';
import { BillingPricingClient } from '@/app/components/billing/BillingPricingClient';

export const revalidate = 60; // short window with tag invalidation on changes

export default async function Billing() {
  const plans = await loadPlans();
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 -mt-24">
        <BillingPricingClient plans={plans} />
      </div>
    </div>
  );
}

