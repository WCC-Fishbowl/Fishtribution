export async function requireServerAuth() {
  // Dynamically import to keep database drivers out of client bundle
  const { auth } = await import("./server");
  const { redirect } = await import("next/navigation");

  const { data: session } = await auth.getSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function checkClientAuth() {
  if (typeof window === "undefined") return null;

  const { authClient } = await import("./client");
  const { data: session } = await authClient.getSession();
  
  return session;
}
