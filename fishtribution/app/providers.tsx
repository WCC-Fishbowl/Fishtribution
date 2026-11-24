'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NeonAuthUIProvider } from '@neondatabase/auth-ui';
import { authClient } from '@/lib/auth/client';
import { runOnFirstLoginCheck } from '@/actions/account';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // TODO: Hacky, try to replace. Intended solution is webhooks but they won't work for preview branches (no stable url).
  const checkFirstLogin = async () => {
    const _ = await runOnFirstLoginCheck();    
  }
  const navigateWithCallback = (href: string) => {
    void checkFirstLogin();
    router.push(href);
  };

  return (
    <NeonAuthUIProvider 
      authClient={authClient} 
      emailOTP 
      navigate={navigateWithCallback}
      Link={Link}
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
