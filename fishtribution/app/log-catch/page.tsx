'use client';

import {
    ArrowUpOnSquareIcon,
    ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import {
    CameraIcon,
} from '@heroicons/react/24/solid';

import { useRouter } from 'next/navigation';

import Button from "../../components/Button"
import TextArea from "../../components/TextArea"
import DropdownSelect from "../../components/DropdownSelect"
import DateTimeSelect from "../../components/DateTimeSelect"
import CatchPhotoScroller from "../../components/CatchPhotoScroller"
import Link from 'next/dist/client/link';

export default function LogCatchPage() {
    const router = useRouter();

    return <div className="flex flex-col pt-6 pb-8 px-6 font-sans">
        {/* Header */}
        <header className="flex items-center justify-between">
            <button
                type="button"
                aria-label="Back"
                className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
                onClick={() => router.back()}
            >
                <ArrowLeftIcon className="h-full w-full"/>
            </button>

            <h1 className="font-title text-2xl font-bold">Log Catch</h1>

            <Link href="/profile" aria-label="Profile" className="h-9 w-9 rounded-full border border-red-300 p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/betta.jpg" alt="" className="h-full w-full rounded-full object-cover" />
            </Link>
        </header>

        <div className="my-4 border-b border-zinc-200" />

        <CatchPhotoScroller className="my-4 justify-center"/>
        <div className="flex items-center justify-center gap-24">
            <button
                type="button"
                aria-label="Take Photo"
                className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
                onClick={() => console.log("Take Photo")}
            >
                <CameraIcon className="h-full w-full"/>
            </button>
            <button
                type="button"
                aria-label="Upload Photo"
                className="h-9 w-9 text-brand-primary hover:text-brand-primary-light"
                onClick={() => console.log("Upload Photo")}
            >
                <ArrowUpOnSquareIcon className="h-full w-full"/>
            </button>
        </div>
        <div className="my-4 w-full border-t border-gray-300"/>
        <h3 className="font-title text font-medium">
            Identification
        </h3>
        <Button fullWidth
            size="lg"
            className="mb-2"
            onClick={() => router.push("/identify")}
        >Unknown</Button>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h3 className="font-title text font-medium">
                    Date & Time
                </h3>
                <DateTimeSelect fullWidth className="mb-2"/>
                <h3 className="font-title text font-medium">
                    Lure
                </h3>
                <DropdownSelect fullWidth
                    name="lure"
                    defaultValue="unknown"
                    className="mb-2"
                >
                    <option value="unknown">None/Unknown</option>
                    <option value="fly">Fly</option>
                    <option value="hard-bait">Hard Bait/Crankbait</option>
                    <option value="jig">Jig</option>
                    <option value="soft-bait">Soft Bait</option>
                    <option value="spinner">Spinner</option>
                    <option value="spoon">Spoon</option>
                    <option value="other">Other</option>
                </DropdownSelect>
                <h3 className="font-title text font-medium">
                    Rod & Reel
                </h3>
                <DropdownSelect fullWidth
                    name="rod-reel"
                    defaultValue="unknown"
                    className="mb-2"
                >
                    <option value="unknown">Unknown</option>
                    <option value="casting">Casting</option>
                    <option value="fly-rod">Fly Rod</option>
                    <option value="ice-fishing">Ice Fishing</option>
                    <option value="spinning">Spinning</option>
                    <option value="trolling">Trolling</option>
                    <option value="other">Mixed/Other</option>
                </DropdownSelect>
            </div>
            <div>
                <h3 className="font-title text font-medium">
                    Location
                </h3>
                <Button fullWidth
                    variant="outline"
                    className="mb-2"
                >-.----, -.----</Button>
                <h3 className="font-title text font-medium">
                    Bait
                </h3>
                <DropdownSelect fullWidth
                    name="bait"
                    defaultValue="unknown"
                    className="mb-2"
                >
                    <option value="unknown">None/Unknown</option>
                    <option value="worm">Worm/Leech</option>
                    <option value="fish">Fish</option>
                    <option value="insect">Insect/Larva</option>
                    <option value="eggs">Eggs/Spawn</option>
                    <option value="processed">Processed Bait</option>
                    <option value="other">Other</option>
                </DropdownSelect>
                <h3 className="font-title text font-medium">
                    Technique
                </h3>
                <DropdownSelect fullWidth
                    name="technique"
                    defaultValue="unknown"
                    className="mb-2"
                >
                    <option value="unknown">Unknown</option>
                    <option value="cast-retrieve">Cast & Retrieve</option>
                    <option value="still-fishing">Still Fishing</option>
                    <option value="fly-fishing">Fly Fishing</option>
                    <option value="ice-fishing">Ice Fishing</option>
                    <option value="jigging">Jigging</option>
                    <option value="trolling">Trolling</option>
                    <option value="other">Other</option>
                </DropdownSelect>
            </div>
        </div>
        <h3 className="font-title text font-medium">
            Notes
        </h3>
        <TextArea fullWidth
            rows={5}
            placeholder="Type here..."
            name="notes"
            className="mb-4"
        />
        <div className="flex gap-4">
            <Button
                className="flex-1"
                variant="outline"
            >
                Cancel
            </Button>
            <Button className="flex-1">
                Submit
            </Button>
        </div>
    </div>
}