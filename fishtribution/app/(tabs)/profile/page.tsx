import { requireServerAuth } from "@/lib/auth/guard";

export default async function ProfilePage() {
  const session = await requireServerAuth();

  return <p className="text-3xl font-bold p-4">Profile</p>
}