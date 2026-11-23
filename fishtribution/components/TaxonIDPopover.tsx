//!!!!! THIS IS A TEMPORARY FILE !!!!!
import { useRef, useEffect } from "react";
import Button from "./Button";
import { FishTaxon } from "@/types/FishTaxon";

type TaxonIDPopoverProps = React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean;
    onClose: () => void;
    setSelectedTaxon: (taxon: FishTaxon | null) => void;
};

export default function TaxonIDPopover({
    isOpen,
    onClose,
    setSelectedTaxon,
    className='',
    children,
    ...props
}: TaxonIDPopoverProps) {
    const baseClasses = 'fixed inset-20 z-50 flex flex-col gap-2 items-center justify-evenly mt-2 mr-2 bg-white border-1 border-gray-400 rounded-md p-2 drop-shadow-md';
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
            <h1 className="font-title text-[30px] font-bold">
                Select Taxon
            </h1>
            <Button
                fullWidth
                onClick={() => {
                    setSelectedTaxon({
                        taxon_id: 'ddc37442-0fc0-49bf-9629-8acf088013e8',
                        common_name: "Black Crappie",
                        scientific_name: "Pomoxis nigromaculatus",
                        family: "Centrarchidae",
                        genus: "Pomoxis",
                        description: "The black crappie (Pomoxis nigromaculatus) is a freshwater fish in the sunfish family (Centrarchidae). It is endemic to North America, one of the two types of crappies. It is very similar to the white crappie (P. annularis) in size, shape, and habits, except that it is darker, with a pattern of black spots.",
                        created_at: new Date(2026, 9, 25, 12, 47, 26),
                    });
                    onClose();
                }}
                size='lg'
            >Black Crappie</Button>
            <Button
                fullWidth
                onClick={() => {
                    setSelectedTaxon({
                        taxon_id: 'f41d1f38-cbf6-4237-a1e7-a1a6aedfaae5',
                        common_name: "Bluegill",
                        scientific_name: "Lepomis macrochirus",
                        family: "Centrarchidae",
                        genus: "Lepomis",
                        description: "The bluegill (Lepomis macrochirus), sometimes referred to as \"bream\", \"brim\", \"sunny\", or, in Texas, \"copper nose\", is a species of North American freshwater fish, native to and commonly found in streams, rivers, lakes, ponds and wetlands east of the Rocky Mountains. It is from the family Centrarchidae (sunfishes, crappies and black basses) in the order Centrarchiformes.",
                        created_at: new Date(2026, 9, 25, 12, 47, 26),
                    });
                    onClose();
                }}
                size='lg'
            >Bluegill</Button>
            <Button
                fullWidth
                onClick={() => {
                    setSelectedTaxon({
                        taxon_id: '9431db05-18d5-466f-971f-1f483a81cb9c',
                        common_name: "Brook Trout",
                        scientific_name: "Salvelinus fontinalis",
                        family: "Salmonidae",
                        genus: "Salvelinus",
                        description: "The brook trout (Salvelinus fontinalis) is a species of freshwater fish in the char genus Salvelinus of the salmon family Salmonidae native to Eastern North America in the United States and Canada. the brook trout is characterized by its distinctive olive-green body with yellow and blue-rimmed red spots, white and black edged orange fins, and dorsal vermiculation.",
                        created_at: new Date(2026, 9, 25, 12, 47, 26),
                    });
                    onClose();
                }}
                size='lg'
            >Brook Trout</Button>
            <Button
                fullWidth
                onClick={() => {
                    setSelectedTaxon({
                        taxon_id: '66a37a49-da94-4f0c-964c-b3626e397267',
                        common_name: "Brown Trout",
                        scientific_name: "Salmo trutta",
                        family: "Salmonidae",
                        genus: "Salmo",
                        description: "The brown trout (Salmo trutta) is a species of carnivorous ray-finned fish and the most widely distributed species of the salmonid genus Salmo, endemic to most of Europe, West Asia and parts of North Africa, and has been widely introduced globally as a game fish, even becoming one of the world's worst invasive species outside of its native range.",
                        created_at: new Date(2026, 9, 25, 12, 47, 26),
                    });
                    onClose();
                }}
                size='lg'
            >Brown Trout</Button>
            <div
                className="w-full flex flex-row gap-2"
            >
                <Button
                    fullWidth
                    onClick={() => {
                        onClose();
                    }}
                    variant='outline'
                    size='lg'
                >Cancel</Button>
                <Button
                    fullWidth
                    onClick={() => {
                        setSelectedTaxon(null);
                        onClose();
                    }}
                    variant='gray'
                    size='lg'
                >Clear Selection</Button>
            </div>
        </div>
    );
}