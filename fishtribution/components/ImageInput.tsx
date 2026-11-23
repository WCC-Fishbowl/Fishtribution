import React, { useRef } from 'react';

import { CameraIcon } from '@heroicons/react/24/solid';
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

interface ImageInputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    source?: 'camera' | 'gallery';
}

export default function ImageInput({
    source = 'gallery',
    className = '',
    ...props
}: ImageInputProps) {
  
    const baseClasses = 'relative inline-flex items-center h-9 w-9 text-brand-primary hover:text-brand-primary-light';

    const combinedClasses = `
        ${baseClasses}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const Icon = source === 'camera' ? CameraIcon : ArrowUpOnSquareIcon;

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                {...(source === 'gallery' ? { multiple: true } : { capture: 'environment' })}
            />
            <button
                type="button"
                className={combinedClasses}
                {...props}
                onClick={() => fileInputRef.current?.click()}
            >
                <Icon className="h-full w-full" />
            </button>
        </>
    );
}
