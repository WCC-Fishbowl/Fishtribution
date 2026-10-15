import type { Metadata } from "next";
import { 
  IBM_Plex_Mono, 
  IBM_Plex_Sans, 
  IBM_Plex_Serif,
} from "next/font/google";
import localFont from "next/font/local";
import BottomNav from '@/components/BottomNav'
import './globals.css'

const plexMono = IBM_Plex_Mono ({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-mono",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans ({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const plexSerif = IBM_Plex_Serif ({
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
    <html lang="en">
      <body className="bg-gray-50 min-h-screen pb-[70px]">
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}