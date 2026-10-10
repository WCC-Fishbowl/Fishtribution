// components/BottomNav.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolidIcon,
  MagnifyingGlassIcon as SearchSolidIcon,
  UserCircleIcon as UserSolidIcon,
  Cog6ToothIcon as SettingsSolidIcon,
} from '@heroicons/react/24/solid'

const TABS = [
  { href: '/home', label: 'Home', outlineIcon: HomeIcon, solidIcon: HomeSolidIcon },
  { href: '/search', label: 'Search', outlineIcon: MagnifyingGlassIcon, solidIcon: SearchSolidIcon },
  { href: '/profile', label: 'Profile', outlineIcon: UserCircleIcon, solidIcon: UserSolidIcon },
  { href: '/settings', label: 'Settings', outlineIcon: Cog6ToothIcon, solidIcon: SettingsSolidIcon },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-bg border-t border-nav-border shadow-sm pb-safe">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = isActive ? tab.solidIcon : tab.outlineIcon
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-3 transition-colors ${
                isActive 
                  ? 'text-text-active' 
                  : 'text-text-inactive hover:text-text-hover'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}