'use client';

import RadioButton from './RadioButton';
import {
    useState,
} from 'react';
import {
    TrashIcon,
} from '@heroicons/react/24/solid';

const placeholderPhotos = [
    { id: 1, url:'https://tropicalfishco.co.uk/editorial/care-guides/betta-splendens-siamese-fighting-fish.webp' },
    { id: 2, url:'https://tropicalfishco.co.uk/editorial/care-guides/betta-splendens-siamese-fighting-fish.webp' },
    { id: 3, url:'https://tropicalfishco.co.uk/editorial/care-guides/betta-splendens-siamese-fighting-fish.webp' },
    { id: 4, url:'https://tropicalfishco.co.uk/editorial/care-guides/betta-splendens-siamese-fighting-fish.webp' },
];

export default function CatchPhotoScroller(
    { className } : { className: string }
) {
    const baseClasses = 'relative w-full overflow-hidden';
    const scrollerClasses = 'flex gap-3 overflow-x-auto px-3';
    
    const combinedBaseClasses = `
        ${baseClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(
        placeholderPhotos.length > 0 ? placeholderPhotos[0].id : null
    );
    
    return (
        <div className={combinedBaseClasses}>
            <div className={scrollerClasses}>
                {placeholderPhotos.map((photo) => (
                    <div key={photo.id} className="relative w-40 shrink-0">
                        <img
                            src={photo.url}
                            alt={'Catch Photo'}
                            className="h-40 w-full rounded-lg object-cover"
                        />
                        <div className="absolute left-2 top-2">
                            <RadioButton
                                size="md"
                                name="selectedPhoto"
                                value={photo.id}
                                checked={selectedPhotoId === photo.id}
                                onChange={() => setSelectedPhotoId(photo.id)}
                            />
                        </div>
                        <div className="absolute right-2 top-2">
                            <button
                                type="button"
                                aria-label="Delete photo"
                                className="h-6 w-6 text-red-600 hover:text-red-400"
                                onClick={() => console.log("Delete Photo")}
                            >
                                <TrashIcon className="h-full w-full" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
        </div>
    );
}