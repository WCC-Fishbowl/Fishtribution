import React from 'react';
import { CheckCircleIcon as CheckCircleOutline } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size: keyof typeof SIZES;
}

export default function RadioButton({
  size,
  className = '',
  checked = false,
  ...props
}: RadioButtonProps) {
  const baseClasses = 'sr-only';

  const combinedClasses = `
    ${baseClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <label className="inline-flex cursor-pointer">
      <input
        type="radio"
        className={combinedClasses}
        checked={checked}
        {...props}
      />
      {checked ? (
        <CheckCircleSolid className={`${SIZES[size]} text-brand-primary`} />
      ) : (
        <CheckCircleOutline className={`${SIZES[size]} text-white`} />
      )}
    </label>
  );
}