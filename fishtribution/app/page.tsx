import { redirect } from "next/navigation"

export default function SplashPage() {
  let user = null;
  if ( user == null ) {
    redirect("/login");
  }
  return (
    <h1>Splash!</h1>
  )
}
