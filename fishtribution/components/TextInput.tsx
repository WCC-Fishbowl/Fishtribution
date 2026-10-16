import React from 'react';

const SIZES = {
  sm: 'py-1.5 text-xs rounded-lg',
  md: 'py-2 text-sm rounded-lg',
  lg: 'py-2.5 text-base rounded-lg',
};

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: keyof typeof SIZES,
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function TextInput({
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  ...props
}: TextInputProps) {
  
  const baseClasses = 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-50 disabled:bg-slate-50 transition-all duration-200';
  const paddingXClasses = icon ? 'pl-10 pr-4' : 'px-4';

  const combinedClasses = `
    ${baseClasses} 
    ${SIZES[size]} 
    ${paddingXClasses}
    ${fullWidth ? 'w-full' : ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`relative inline-flex items-center ${fullWidth ? 'w-full' : ''}`}>
      {icon && (
        <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input type="text" className={combinedClasses} {...props} />
    </div>
  );
}
