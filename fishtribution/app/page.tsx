<<<<<<<<< Temporary merge branch 1
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const SHOW_MS = 3900
const FADE_MS = 700

export default function SplashPage() {
  const router = useRouter()
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), SHOW_MS)
    const navTimer = setTimeout(() => router.replace('/login'), SHOW_MS + FADE_MS + 100)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(navTimer)
    }
  }, [router])

=========
import { redirect} from "next/navigation";
import { authServer } from "@/lib/auth/guard"

export default async function SplashPage() {
  const session = await authServer(true);
  redirect("home/");

>>>>>>>>> Temporary merge branch 2
  return (
    <h1>Splash!</h1>
  )
}
