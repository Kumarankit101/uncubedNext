import React, { useState } from 'react';
import { useApiClient } from '@/lib/useApiClient';
import { Button } from '@/app/components/ui/Button';

type Props = { planId: string };


export default function SubscribeButton({ planId }: Props) {
  const { callApi } = useApiClient();
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true);
    try {
      // create subscription if not existing
      const subRes = (await callApi('/subscriptions/create', {
        method: 'POST',
        body: JSON.stringify({ planId, billingCycle: 'monthly' })
      })) as { id: string };
      const subscriptionId = subRes.id;
      const { link } = (await callApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ subscriptionId })
      })) as { link: string };
      window.open(link, '_blank');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={planId !== 'plan-free' ? handlePayment : undefined}
      variant="primary"
      size="md"
      loading={loading}
      disabled={planId === 'plan-free' || loading}
      className="w-full"
    >
      {planId === 'plan-free' ? 'Your current plan' : 'Subscribe Now'}
    </Button>
  );
}
