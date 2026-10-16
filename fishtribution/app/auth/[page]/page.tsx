import { AuthClientView } from './client';
import { authViewPaths } from "@neondatabase/auth-ui/server";

export const dynamicParams = false;

// Pre-builds pages for sign-in, sign-up, forgot-password, etc.
export function generateStaticParams() {
  return Object.values(authViewPaths).map((page) => ({ page }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      {/* Feed the page dynamic param into your Client-Isolated View */}
      <AuthClientView page={page} />
    </main>
  );
}
