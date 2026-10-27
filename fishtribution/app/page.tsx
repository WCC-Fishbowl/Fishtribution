import { redirect } from "next/navigation"

export default function SplashPage() {
  let user = null;
  if ( user == null ) {
    redirect("/login");
  }
  return (
    <div
      className={`flex h-screen items-center justify-center bg-white transition-opacity duration-700 ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-animation.gif" alt="Fishtribution logo" className="w-64 h-64" />
    </div>
  )
}