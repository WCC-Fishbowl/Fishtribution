'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import DropdownSelect from "../../components/DropdownSelect";
import DateTimeSelect from "../../components/DateTimeSelect";
import CatchPhotoScroller from "../../components/CatchPhotoScroller";
import Link from 'next/dist/client/link';
import NumberInput from '../../components/NumberInput';
import ImageInput from '@/components/ImageInput';
import TaxonIDPopover from '@/components/TaxonIDPopover';
import { FishTaxon } from '@/types/FishTaxon';
import { Point } from 'geojson';
import MapSelectPopover from '@/components/MapSelectPopover';
import { Catch } from '@/types/Catch';
import { createCatch } from '@/actions/catch';

type LogCatchClientProps = {
    user_id: string | null;
}

export default function LogCatchClient({ user_id }: LogCatchClientProps) {
    const router = useRouter();

    const [taxonPopoverOpen, setTaxonPopoverOpen] = useState(false);
    const [mapSelectPopoverOpen, setMapSelectPopoverOpen] = useState(false);
    const [selectedTaxon, setSelectedTaxon] = useState<FishTaxon | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Point | null>(null);
    const [length, setLength] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [baitOrLure, setBaitOrLure] = useState<string | null>(null);
    const [caughtAt, setCaughtAt] = useState<string>('');
    const [notes, setNotes] = useState<string | null>(null);

    const [submissionErrMsg, setSubmissionErrMsg] = useState<string | null>(null);
    const [taxonErr, setTaxonErr] = useState<boolean>(false);
    const [caughtAtErr, setCaughtAtErr] = useState<boolean>(false);

    return (
        <div className="flex flex-col pt-6 pb-8 px-6 font-sans">
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

            <TaxonIDPopover
                isOpen={taxonPopoverOpen}
                onClose={() => setTaxonPopoverOpen(false)}
                setSelectedTaxon = {setSelectedTaxon}
            />

            <MapSelectPopover
                isOpen={mapSelectPopoverOpen}
                onClose={() => setMapSelectPopoverOpen(false)}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
            />

            {submissionErrMsg && (
                <div className="w-full rounded-md border-2 border-red-500 bg-red-100 p-3 text-red-800">
                    {submissionErrMsg}
                </div>
            )}

            <CatchPhotoScroller className="my-4 justify-center"/>
            <div className="flex items-center justify-center gap-24">
                <ImageInput source="camera" />
                <ImageInput source="gallery" />
            </div>
            <div className="my-4 w-full border-t border-gray-300"/>
            <h3 className="font-title text font-medium">
                Identification
            </h3>
            <Button fullWidth
                size="lg"
                className="mb-2"
                onClick={() => setTaxonPopoverOpen(true)}
                isError={taxonErr ? true : false}
            >{selectedTaxon ? selectedTaxon.scientific_name : "Unknown"}</Button>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-title text font-medium">
                        Date & Time
                    </h3>
                    <DateTimeSelect
                        fullWidth
                        className="mb-2"
                        value={caughtAt}
                        onChange={(date) => setCaughtAt(date.target.value)}
                        isError={caughtAtErr ? true : false}
                    />
                    <h3 className="font-title text font-medium">
                        Length
                    </h3>
                    <NumberInput
                        name="length"
                        fullWidth
                        className="mb-2"
                        unit="length"
                        step="tenths"
                        value={length ? length : undefined}
                        onChange={(e) => setLength(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                </div>
                <div>
                    <h3 className="font-title text font-medium">
                        Location
                    </h3>
                    <Button fullWidth
                        variant="outline"
                        className="mb-2"
                        onClick={() => setMapSelectPopoverOpen(true)}
                    >{selectedLocation ? `${selectedLocation.coordinates[1].toFixed(4)}°, ${selectedLocation.coordinates[0].toFixed(4)}°` : '-.----, -.----'}</Button>
                    <h3 className="font-title text font-medium">
                        Weight
                    </h3>
                    <NumberInput
                        name="weight"
                        fullWidth
                        className="mb-2"
                        unit="weight"
                        step="hundredths"
                        value={weight ? weight : undefined}
                        onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : null)}
                    />
                </div>
            </div>
            <h3 className="font-title text font-medium">
                Bait or Lure
            </h3>
            <DropdownSelect fullWidth
                name="bait-or-lure"
                className="mb-2"
                value={baitOrLure ? baitOrLure : "unknown"}
                onChange={(e) => setBaitOrLure(e.target.value)}
            >
                <option value="unknown">None/Unknown</option>
                <option value="eggs">Eggs/Spawn</option>
                <option value="fish">Fish</option>
                <option value="fly">Fly Lure</option>
                <option value="hard-bait">Hard Bait</option>
                <option value="insect">Insect/Larva</option>
                <option value="jig">Jig</option>
                <option value="processed">Processed Bait</option>
                <option value="soft-bait">Soft Bait</option>
                <option value="spinner">Spinner</option>
                <option value="spoon">Spoon</option>
                <option value="worm">Worm/Leech</option>
                <option value="other">Other</option>
            </DropdownSelect>
            <h3 className="font-title text font-medium">
                Notes
            </h3>
            <TextArea fullWidth
                rows={5}
                placeholder="Type here..."
                name="notes"
                className="mb-4"
                value={notes ? notes : ""}
                onChange={(e) => setNotes(e.target.value ? e.target.value : null)}
            />
            <div className="flex gap-4">
                <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    className="flex-1"
                    type="submit"
                    onClick={async () => {
                        setSubmissionErrMsg(selectedTaxon ? caughtAt ? null : "Date & Time Required" : caughtAt ? "Identification Required" : "Identification and Date & Time Required");
                        setTaxonErr(!selectedTaxon);
                        setCaughtAtErr(!caughtAt);
                        
                        if (selectedTaxon && caughtAt) {
                            const submission: Catch = {
                                catch_id: crypto.randomUUID(),
                                taxon_id: selectedTaxon.taxon_id,
                                user_id: user_id ? user_id : "00000000-0000-0000-0000-000000000000",
                                pos: selectedLocation,
                                length_cm: length,
                                weight_kg: weight,
                                bait_or_lure: baitOrLure,
                                notes: notes,
                                caught_at: new Date(caughtAt),
                                created_at: new Date(),
                                updated_at: new Date(),
                                deleted_at: null,
                            }

                            await createCatch(submission);
                        }
                    }}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}