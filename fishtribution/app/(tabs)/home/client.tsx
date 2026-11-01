'use client'

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CatchRow, { CatchTile } from '@/components/CatchCard';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CatchWithRelations, defaultCatchWithRelationsSearch } from '@/types/CatchWithRelations';
import { searchCatches } from '@/actions/catch';
import { useLocationStore } from '@/stores/LocationStore';
import FilterPopover from '@/components/FilterPopover';

export type FeedType = "User" | "Local" | "Global";

export function useSearchCatches() {
  const [filters, setFilters] =
    useState(defaultCatchWithRelationsSearch);

    async function search(feed: FeedType) {
      const user_loc = await useLocationStore.getState().getLocation();
      return searchCatches(feed, user_loc, filters);
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
  const [isLoading, setIsLoading] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { filters, setFilters, search } = useSearchCatches();
  const router = useRouter();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (filters.offset === 0) return;

    async function fetchMore() {
      const newCatches = await search(selectedFeed);
      setHasMore(newCatches.length === 20);
      setCatches((prev) => [...prev, ...newCatches]);
    }

    fetchMore();
  }, [filters.offset]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setFilters((prev) => ({
          ...prev,
          offset: prev.offset + 20,
        }));
      }
    });

    if (bottom.current) {
      observer.observe(bottom.current);
    }

    return () => observer.disconnect();
  }, [hasMore]);

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
            aria-label="Search/Filter"
            className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
            onClick={() => setFilterMenuOpen((open) => !open)}
          ><MagnifyingGlassIcon className="h-full w-full" /></button>

          <span className="relative">
            <button
              type="button"
              aria-label="Add catch"
              className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
              onClick={() => router.push('/log-catch')}
            ><PlusIcon className="h-full w-full" /></button>

            <FilterPopover
              isOpen={filterMenuOpen}
              onClose={() => setFilterMenuOpen(false)}
              filters={filters}
              setFilters={setFilters}
              submit={async () => {
                setIsLoading(true);
                try {
                  const results = await search(selectedFeed);
                  setCatches(results);
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          </span>
        </div>
      </header>
      <div className="my-4 border-b border-zinc-200" />

      {/* Segmented control */}
      <div className="flex items-center rounded-2xl bg-slate-50 p-1">
        {feeds.map((feed) => (
          <button
            key={feed}
            onClick={async () => {
              setIsLoading(true);
              try {
                setSelectedFeed(feed);
                const results = await search(feed);
                setCatches(results);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold ${
              selectedFeed === feed ? 'bg-white text-neutral-800' : 'text-zinc-500'
            }`}
          >{feed}</button>
        ))}
      </div>

      {/* Fish list */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {catches.map((catchRecord) => (
          <CatchTile
            key={catchRecord.catchRecord.catch_id}
            catchRecord={catchRecord}
            showUser={selectedFeed !== 'User'}
            imagePosition="top"
            isLoading={isLoading}
            onClick={() => router.push(`/catch/${catchRecord.catchRecord.catch_id}`)}
          />
        ))}
      </div>
      <div ref={bottom} />
    </div>
  )
}