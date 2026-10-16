import { requireServerAuth } from "@/lib/auth/guard"

export default async function SplashPage() {
  const session = await requireServerAuth();

  return (
    <h1>Splash!</h1>
  )
}
