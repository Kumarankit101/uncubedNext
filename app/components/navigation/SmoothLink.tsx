'use client';

import React, { useState, useEffect } from 'react';
import Link, { LinkProps } from 'next/link';

type Props = LinkProps & React.PropsWithChildren<{
  className?: string;
  prefetch?: boolean;
  style?: React.CSSProperties;
}>;

export default function SmoothLink({ href, prefetch = true, className, children, ...rest }: Props) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const handleDone = () => setPending(false);
    // Fallback clear in case route finishes without explicit event
    const t = setTimeout(handleDone, 800);
    return () => clearTimeout(t);
  }, [pending]);

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      aria-busy={pending}
      data-pending={pending ? '' : undefined}
      onClick={(e) => {
        setPending(true);
        if (typeof rest.onClick === 'function') (rest as any).onClick(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
