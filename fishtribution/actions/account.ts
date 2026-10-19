// ROOT/actions/account.ts
'use server'

import { deleteUser, deleteUserSettings, insertNewUser, insertUserSettings, unlinkCatchesFromUser } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { authServer } from "@/lib/auth/guard";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function handleAccountCreation() {
  const session = await authServer();
  
  // 1. Guard: Ensure the request is coming from an authenticated Better Auth user
  if (!session?.user) {
    throw new Error("Unauthorized: No active session found.");
  }

  try {
    await insertNewUser(session, session.user.email, session.user.email);
    await insertUserSettings(session);
  } catch (error) {
    console.error("Failed to populate app tables on creation:", error);
    throw new Error("Account initialization failed.");
  }

  redirect("/home");
}

export async function handleAccountDeletion() {
  const session = await authServer(true);
  if (!session) { return };

  try {
    
    await unlinkCatchesFromUser(session);
    await deleteUserSettings(session);
    await deleteUser(session);
    await auth.deleteUser();
    await auth.revokeSession(session.session);
    
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete account data:", error);
    throw new Error("Could not complete account deletion.");
  }
  
  redirect("/");
}
