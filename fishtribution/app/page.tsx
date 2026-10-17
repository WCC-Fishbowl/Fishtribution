import { redirect} from "next/navigation";
import { requireServerAuth } from "@/lib/auth/guard"

export default async function SplashPage() {
  const session = await requireServerAuth();
  redirect("home/");

  return (
    <h1>Splash!</h1>
  )
}
