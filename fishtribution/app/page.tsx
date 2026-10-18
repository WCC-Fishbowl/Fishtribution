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