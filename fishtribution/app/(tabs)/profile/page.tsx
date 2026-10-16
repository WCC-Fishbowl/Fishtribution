import { redirect } from "next/navigation"

export default function ProfilePage() {
  let user = null;
  if ( user == null ) {
    redirect("/auth/login");
  }
  return <h1 className="text-3xl font-bold p-4">Profile</h1>
}