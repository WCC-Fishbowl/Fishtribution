'use client'

import { useState } from 'react';
import Link from 'next/link';
import CatchRow from '@/components/CatchCard';
import { CatchTile } from '@/components/CatchCard';
import { Fish } from '@/types/Fish';
import { Catch } from '@/types/Catch';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const filters = ['User', 'Local', 'Global']

const description = 'Brook trout are Michigan’s state fish, known for their vivid coloring and preference for cold, clean streams and rivers across the state.'

const placeholderImage = '/betta.jpg'

const fish1: Fish = { id: 'striped-fantail-darter', name: 'Striped Fantail Darter', scientific_name: 'Etheostoma flabellare lineolatum', description, image: placeholderImage }
const fish2: Fish = { id: 'brook-trout', name: 'Brook Trout', scientific_name: 'Salvelinus fontinalis', description, image: placeholderImage }

const catches: Catch[] = [
    { id: '1', fish: fish1, images: ['/betta.jpg'], date: '10/19/26', username: 'xXx_betta_fish_xXx'},
    { id: '2', fish: fish2, images: [
        '/betta.jpg',
        '/betta.jpg'
    ], date: '7/4/25', username: 'br00k_tr0ut_9000'}
]

export default function HomePage() {
  const [selected, setSelected] = useState('User')
  const router = useRouter();

  return (
    <div className="flex flex-col p-6 pb-24 font-sans">
      {/* Header */}
      <header className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex justify-self-start">
          <button
            type="button"
            aria-label="Back"
            className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
            onClick={() => router.back()}
          ><ArrowLeftIcon className="h-full w-full" /></button>
        </div>

        <h1 className="justify-self-center font-title text-2xl font-bold">
          {selected === 'User' ? 'Home' : 'Explore'}
        </h1>

        <div className="flex items-center justify-self-end gap-2">
          <button
            type="button"
            aria-label="First action"
            className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
            onClick={() => console.log("Search/Filter")}
          ><MagnifyingGlassIcon className="h-full w-full" /></button>

        <button
            type="button"
            aria-label="Second action"
            className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
            onClick={() => router.push('/log-catch')}
        ><PlusIcon className="h-full w-full" /></button>

        <Link
            href="/profile"
            aria-label="Profile"
            className="h-9 w-9 rounded-full border border-red-300 p-0.5"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/betta.jpg"
                alt=""
                className="h-full w-full rounded-full object-cover"
            />
        </Link>
    </div>
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
        <CatchRow
          catchRecord={catches[0]}
          showUser={selected !== 'User'}
          imageSide="left"
          onClick={() => router.push(`/catch/${catches[0].id}`)}
        />
        <div className="grid grid-cols-2 gap-4">
          <CatchTile
            catchRecord={catches[1]}
            showUser={selected !== 'User'}
            imagePosition="top"
            onClick={() => router.push(`/catch/${catches[1].id}`)}
          />
          <CatchTile
            catchRecord={catches[0]}
            showUser={selected !== 'User'}
            imagePosition="bottom"
            onClick={() => router.push(`/catch/${catches[0].id}`)}
          />
        </div>
        <CatchRow
          catchRecord={catches[1]}
          showUser={selected !== 'User'}
          imageSide="right"
          onClick={() => router.push(`/catch/${catches[1].id}`)}
        />
      </div>
    </div>
  )
}