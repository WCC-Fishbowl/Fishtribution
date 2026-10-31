'use client';

import React, { useRef, useEffect } from "react";
import DropdownSelect from "@/components/DropdownSelect";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { XMarkIcon } from "@heroicons/react/24/outline";

type FilterPopoverProps = React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
};

export default function FilterPopover({
    isOpen,
    onClose,
    className = '',
    children,
    ...props
}: FilterPopoverProps) {
    const baseClasses = 'absolute right-0 top-full w-53 z-50 mt-2 mr-2 bg-white border-1 border-gray-400 rounded-md p-2 drop-shadow-md'
    const combinedClasses = `
        ${baseClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node))
                onClose();
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={popoverRef}
            className={combinedClasses}
            {...props}
        >
            <div className="flex flex-col gap-2">
                {/* Row 1: Title and close */}
                <div className="relative flex items-center justify-center">
                    <h2 className="text-lg font-title font-bold">Filters</h2>
                    <button
                        className="absolute right-0"
                        onClick={onClose}
                    ><XMarkIcon className="size-6 text-red-600" /></button>
                </div>
                
                {/* Row 2: Search */}
                <div className="flex flex-col w-full">
                    <p className="text-[8px] ml-1"><span className="text-[11px] font-bold font-title">Search</span> (tuna|user:john_s|taxon:Salmo)</p>
                    <TextInput className="w-full h-8" placeholder="Search..."/>
                </div>

                {/* Row 3: Bait / Lure */}
                <div className="flex flex-col w-full">
                    <p className="text-[11px] font-bold font-title ml-1">Bait or Lure</p>
                    <DropdownSelect
                        fullWidth
                        name="bait_lure"
                        className="h-8 text-[11px]"
                        defaultValue="unknown"
                    >
                        <option value="unknown">None/Unknown</option>
                        <option value="fly">Fly</option>
                        <option value="hard-bait">Hard Bait/Crankbait</option>
                        <option value="jig">Jig</option>
                        <option value="soft-bait">Soft Bait</option>
                        <option value="spinner">Spinner</option>
                        <option value="spoon">Spoon</option>
                        <option value="worm">Worm/Leech</option>
                        <option value="fish">Fish</option>
                        <option value="insect">Insect/Larva</option>
                        <option value="eggs">Eggs/Spawn</option>
                        <option value="processed">Processed Bait</option>
                        <option value="other">Other</option>
                    </DropdownSelect>
                </div>

                {/* Row 4: Date */}
                <div className="flex flex-col w-full">
                    <p className="text-[11px] font-bold font-title ml-1">Before:</p>
                    <div className="w-full h-8 border-1 border-gray-400 hover:bg-gray-100 rounded-md items-center p-1">
                        <input type="date" className="w-full self-center appearance-none text-[11px]" />
                    </div>
                </div>

                {/* Row 5: Time range */}
                <div className="flex w-full items-center gap-1 border-1 border-gray-400 rounded-md p-1">
                    <div className="flex flex-col w-full">
                        <p className="text-[11px] font-bold font-title ml-1">From:</p>
                        <input type="time" className="min-w-0 h-6 flex-1 text-xs border-gray-400 border-1 hover:bg-gray-100 rounded-sm" />
                    </div>
                    <p className="text-md">:</p>
                    <div className="flex flex-col w-full">
                        <p className="text-[11px] font-bold font-title ml-1">To:</p>
                        <input type="time" className="min-w-0 h-6 flex-1 text-xs border-gray-400 border-1 hover:bg-gray-100 rounded-sm" />
                    </div>
                </div>

                {/* Row 6: Submit */}
                <div className="flex justify-center"><Button>Apply Filters</Button></div>
            </div>
        </div>
    );
}