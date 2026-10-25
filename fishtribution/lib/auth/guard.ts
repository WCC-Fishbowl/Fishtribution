export async function authServer(redirect_on_fail = false) {
  // Dynamically import to keep database drivers out of client bundle
  const { auth } = await import("./server");
  const { redirect } = await import("next/navigation");

  const { data: session } = await auth.getSession();

  if (!session && redirect_on_fail) {
    redirect("/auth/sign-in");
  }

  return session;
}

export async function authClient(redirect_on_fail = false) {
  if (typeof window === "undefined") return null;

  const { authClient } = await import("./client");
  const { redirect } = await import("next/navigation");

  const { data: session } = await authClient.getSession();
  
  if (!session && redirect_on_fail) {
    redirect("/auth/sign-in");
  }

  return session;
}
