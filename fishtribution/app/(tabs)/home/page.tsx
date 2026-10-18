'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FishRow, FishTile, type Fish } from '@/components/FishCard'

const filters = ['Recent', 'Local', 'Finished']

const description =
  'Brook trout are Michigan’s state fish, known for their vivid coloring and preference for cold, clean streams and rivers across the state.'

  const placeholderImage = '/betta.jpg'

  const fishes: Fish[] = [
    { id: 'brook-trout-1', name: 'Brook Trout', description, image: placeholderImage },
    { id: 'brook-trout-2', name: 'Brook Trout', description, image: placeholderImage },
    { id: 'brook-trout-3', name: 'Brook Trout', description, image: placeholderImage },
    { id: 'brook-trout-4', name: 'Brook Trout', description, image: placeholderImage },
  ]

export default function HomePage() {
  const [selected, setSelected] = useState('Finished')

  return (
    <div className="flex flex-col p-6 pb-24 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="h-9 w-9" /> {/* spacer keeps the title centered */}

        <h1 className="font-title text-2xl font-bold">Explore</h1>

        <Link href="/profile" aria-label="Profile" className="h-9 w-9 rounded-full border border-red-300 p-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/betta.jpg" alt="" className="h-full w-full rounded-full object-cover" />
        </Link>
      </header>

      <div className="my-4 border-b border-zinc-200" />

      {/* Segmented control */}
      <div className="flex items-center rounded-2xl bg-slate-50 p-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelected(filter)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold ${
              selected === filter ? 'bg-white text-neutral-800' : 'text-zinc-500'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Fish list */}
      <div className="mt-6 flex flex-col gap-6">
        <FishRow fish={fishes[0]} imageSide="left" />
        <div className="grid grid-cols-2 gap-4">
          <FishTile fish={fishes[1]} imagePosition="top" />
          <FishTile fish={fishes[2]} imagePosition="bottom" />
        </div>
        <FishRow fish={fishes[3]} imageSide="right" />
      </div>
    </div>
  )
}