'use client';

import React from 'react';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import { authClient } from '@/lib/auth/client';
import '@neondatabase/auth-ui/css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider 
      authClient={authClient} 
      emailOTP 
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
