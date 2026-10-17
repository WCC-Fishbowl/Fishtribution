import './globals.css'
import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Merriweather } from "next/font/google";
import localFont from "next/font/local";

const plexMono = IBM_Plex_Mono ({
  weight: "400",
  style: "normal",
  variable: "--font-plex-mono",
  subsets: ["latin"],
});

const inter = Inter ({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather ({
  variable: "--font-merriweather",
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
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${plexMono.variable} ${clashDisplay.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh overflow-y-auto">
        {children}
      </body>
    </html>
  )
}