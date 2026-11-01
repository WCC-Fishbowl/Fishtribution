import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const SIZES = {
    sm: 'px-1.5 py-1.5 text-xs rounded-lg',
    md: 'px-2 py-2 text-sm rounded-lg',
    lg: 'px-2.5 py-2.5 text-base rounded-lg',
};

interface DropdownSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: keyof typeof SIZES;
    fullWidth?: boolean;
}

export default function DropdownSelect({
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
}: DropdownSelectProps) {

    const baseClasses =
        'appearance-none border border-slate-300 bg-white text-slate-900 focus focus focus focus disabled disabled transition-all duration-200 cursor-pointer';

    const combinedClasses = `
        ${baseClasses}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
    <div className={`relative inline-flex items-center ${fullWidth ? 'w-full' : ''}`}>
    <select className={combinedClasses} {...props}>
    {children}
    </select>

  <ChevronDownIcon className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
    );
}