import React from 'react';

const SIZES = {
    sm: 'px-1.5 py-1.5 text-xs rounded-lg',
    md: 'px-2 py-2 text-sm rounded-lg',
    lg: 'px-2.5 py-2.5 text-base rounded-lg',
};

interface DateTimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    size?: keyof typeof SIZES;
    fullWidth?: boolean;
}

export default function DateTimeInput({
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: DateTimeInputProps) {

    const baseClasses =
    'border border-slate-300 bg-white text-slate-900 focus focus focus focus disabled disabled transition-all duration-200';

    const combinedClasses = `
        ${baseClasses}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
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