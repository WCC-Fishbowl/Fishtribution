import { redirect} from "next/navigation";
import { authServer } from "@/lib/auth/guard"

export default async function SplashPage() {
  const session = await authServer(true);
  redirect("home/");

  return (
    <h1>Splash!</h1>
  )
}
