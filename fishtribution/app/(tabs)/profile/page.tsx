import { requireServerAuth } from "@/lib/auth/guard";

export default async function ProfilePage() {
  const session = await requireServerAuth();

  return <h1 className="text-3xl font-bold p-4">Profile</h1>
}