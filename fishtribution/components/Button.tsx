import React from 'react';

const VARIANTS = {
  primary: 'bg-brand-primary hover:bg-brand-primary-light text-white shadow-md focus:ring-brand-primary-light',
  accent: 'bg-brand-accent hover:bg-brand-accent-light text-white shadow-md focus:ring-brand-accent-light',
  gray: 'bg-gray-200 hover:bg-gray-100 text-white shadow-md focus:ring-gray-100',
  outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-medium',
  md: 'px-4 py-2 text-sm font-semibold',
  lg: 'px-5 py-2.5 text-base font-semibold',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS,
  size?: keyof typeof SIZES,
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  
  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const combinedClasses = `
    ${baseClasses} 
    ${VARIANTS[variant]} 
    ${SIZES[size]} 
    ${fullWidth ? 'w-full' : ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
