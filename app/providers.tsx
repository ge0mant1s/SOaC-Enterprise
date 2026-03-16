'use client';

import { SessionProvider } from 'next-auth/react';
import { useState, useEffect, type ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <div style={mounted ? undefined : { visibility: 'hidden' }}>
        {children}
      </div>
    </SessionProvider>
  );
}
