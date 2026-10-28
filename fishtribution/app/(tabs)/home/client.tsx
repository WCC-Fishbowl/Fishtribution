'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CatchRow from '@/components/CatchCard';
import { CatchTile } from '@/components/CatchCard';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CatchWithRelations, CatchWithRelationsSearch, defaultCatchWithRelationsSearch } from '@/types/CatchWithRelations';
import { searchCatches } from '@/actions/catch';

export type FeedType = "User" | "Local" | "Global";

export function useSearchCatches() {
  const [filters, setFilters] =
    useState(defaultCatchWithRelationsSearch);

    async function search(feed: FeedType) {
      return searchCatches(feed, filters);
    }

    return { filters, setFilters, search };
}

const feeds: FeedType[] = ['User', 'Local', 'Global'];

type HomeClientProps = {
    catchesParam: CatchWithRelations[];
};

export default function HomeClient({ catchesParam }: HomeClientProps) {
  const [selectedFeed, setSelectedFeed] = useState<"User" | "Local" | "Global">('User')
  const [catches, setCatches] = useState(catchesParam);
  const { filters, setFilters, search } = useSearchCatches();
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
          {selectedFeed === 'User' ? 'Home' : 'Explore'}
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
        {feeds.map((feed) => (
          <button
            key={feed}
            onClick={async () => {
              setSelectedFeed(feed);
              const results = await search(feed);
              setCatches(results);
            }}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold ${
              selectedFeed === feed ? 'bg-white text-neutral-800' : 'text-zinc-500'
            }`}
          >
            {feed}
          </button>
        ))}
      </div>

      {/* Fish list */}
      <div className="mt-6 flex flex-col gap-6">
        <CatchRow
          catchRecord={catches[0]}
          showUser={selectedFeed !== 'User'}
          imageSide="left"
          onClick={() => router.push(`/catch/${catches[0].catchRecord.catch_id}`)}
        />
        <div className="grid grid-cols-2 gap-4">
          <CatchTile
            catchRecord={catches[1]}
            showUser={selectedFeed !== 'User'}
            imagePosition="top"
            onClick={() => router.push(`/catch/${catches[1].catchRecord.catch_id}`)}
          />
          <CatchTile
            catchRecord={catches[2]}
            showUser={selectedFeed !== 'User'}
            imagePosition="bottom"
            onClick={() => router.push(`/catch/${catches[2].catchRecord.catch_id}`)}
          />
        </div>
        <CatchRow
          catchRecord={catches[3]}
          showUser={selectedFeed !== 'User'}
          imageSide="right"
          onClick={() => router.push(`/catch/${catches[3].catchRecord.catch_id}`)}
        />
      </div>
    </div>
  )
}