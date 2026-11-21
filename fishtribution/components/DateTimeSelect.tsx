import React from 'react';

const SIZES = {
    sm: 'px-1.5 py-1.5 text-xs rounded-lg',
    md: 'px-2 py-2 text-sm rounded-lg',
    lg: 'px-2.5 py-2.5 text-base rounded-lg',
};

interface DateTimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    size?: keyof typeof SIZES,
    fullWidth?: boolean,
    isError?: boolean,
}

export default function DateTimeInput({
    size = 'md',
    fullWidth = false,
    isError = false,
    className = '',
    ...props
}: DateTimeInputProps) {

    const baseClasses =
    'border bg-white text-slate-900 focus focus focus focus disabled disabled transition-all duration-200';

    const combinedClasses = `
        ${baseClasses}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isError ? 'border-red-500 border-2' : 'border-slate-300'}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <input
            type="datetime-local"
            className={combinedClasses}
            onClick={(e) => e.currentTarget.showPicker()}
            {...props}
        />
    );
}