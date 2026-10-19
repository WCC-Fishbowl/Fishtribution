import { authServer } from "@/lib/auth/guard";

export default async function ProfilePage() {
  const session = await authServer();

  return <p className="text-3xl font-bold p-4">Profile</p>
}