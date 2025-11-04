'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function PendingButton({ href, children, className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <Button
      className={className}
      loading={loading}
      onClick={() => {
        setLoading(true);
        router.push(href);
      }}
    >
      {children}
    </Button>
  );
}
