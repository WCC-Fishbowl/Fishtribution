'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
    Bars3Icon,
    Cog8ToothIcon,
    MapPinIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline'

export type Profile = {
    username: string
    email: string
    location: string | null
    avatar_url: string | null
}

// Placeholder cards until real data is added
const cards = [
    { id: 1, image: '/betta.jpg', label: 'Log Catch History', href: '/log-catch' },
    { id: 2, image: '/betta.jpg', label: 'Settings', href: '/settings' },
    { id: 3, image: '/betta.jpg', label: 'Log Catch History', href: '/history' },
]

export default function ProfileView({ profile }: { profile: Profile }) {
    const fileInput = useRef<HTMLInputElement>(null)
    const [avatar, setAvatar] = useState(profile.avatar_url ?? '/betta.jpg')

    const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatar(URL.createObjectURL(file)) // preview only; not saved yet
    }

    return (
        <div className="mx-auto flex w-full max-w-lg flex-col p-4 pb-24 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between">
                <button aria-label="Menu" className="p-2.5">
                    <Bars3Icon className="h-6 w-6 text-sky-950" />
                </button>
                <h1 className="font-title text-2xl font-bold text-black">My Profile</h1>
                <Link href="/settings" aria-label="Settings" className="p-2.5">
                    <Cog8ToothIcon className="h-6 w-6 text-sky-950" />
                </Link>
            </header>

            <div className="my-2 border-b border-zinc-200" />

            {/* Profile info */}
            <section className="flex items-center gap-4 p-2.5">
                <button
                    onClick={() => fileInput.current?.click()}
                    aria-label="Change profile photo"
                    className="h-16 w-16 shrink-0 rounded-full border border-rose-300 p-0.5"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
                </button>
                <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    onChange={onPickImage}
                    className="hidden"
                />

                <div className="flex min-w-0 flex-col">
                    <p className="truncate font-title text-xl font-medium text-black">{profile.username}</p>
                    <p className="truncate text-xs text-zinc-300">{profile.email}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-[10px] text-black">
                        <Link href="/profile/edit" className="flex items-center gap-1">
                            Edit Profile
                            <PencilSquareIcon className="h-3 w-3 text-[#FFBCA3]" />
                        </Link>
                        <p className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4 text-sky-950" />
                            {profile.location ?? 'Location not set'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Cards */}
            <ul className="mt-12 flex flex-col gap-8">
                {cards.map((card) => (
                    <li key={card.id}>
                        <Link
                            href={card.href}
                            className="flex h-24 overflow-hidden rounded-md shadow-[5px_5px_4px_0px_rgba(0,0,0,0.25)]"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={card.image} alt="" className="h-24 w-32 shrink-0 object-cover" />

                            <div className="flex flex-1 items-center justify-center bg-white px-2">
                                <span className="text-center text-lg font-light text-black">{card.label}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}