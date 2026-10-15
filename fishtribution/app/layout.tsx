import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Merriweather } from "next/font/google";
import localFont from "next/font/local";
import BottomNav from '@/components/BottomNav'
import './globals.css'

const plexMono = IBM_Plex_Mono ({
  weight: "400",
  style: "normal",
  variable: "--font-plex-mono",
  subsets: ["latin"],
});

const inter = Inter ({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

const merriweatherSerif = Merriweather ({
  variable: "--font-merriweather-serif",
  subsets: ["latin"],
});

const clashDisplay = localFont({
  src: "../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display"
})

export const metadata: Metadata = {
  title: "Fishtribution",
  description: "Log, track, and explore fish.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweatherSerif.variable} ${plexMono.variable} ${clashDisplay.variable}`}>
      <body className="min-h-dvh pb-17.5 overflow-hidden">
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}