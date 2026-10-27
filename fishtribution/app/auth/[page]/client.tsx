'use client';

import dynamic from 'next/dynamic';

// 1. Dynamically import AuthView with SSR disabled
const DynamicAuthView = dynamic(
  () => import('@neondatabase/auth-ui').then((mod) => mod.AuthView),
  { 
    ssr: false, 
    loading: () => <p className="text-sm text-gray-500">Loading auth interface...</p> 
  }
);

interface AuthClientViewProps {
  page: string;
}

export function AuthClientView({ page }: AuthClientViewProps) {
  // Pass your current route's page string down into the Neon component
  return <DynamicAuthView path={page} />;
}
