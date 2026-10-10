import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNav from '@/components/BottomNav'
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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