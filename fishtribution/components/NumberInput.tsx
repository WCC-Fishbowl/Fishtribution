import React from 'react';

const SIZES = {
  sm: 'py-1.5 text-xs rounded-lg',
  md: 'py-2 text-sm rounded-lg',
  lg: 'py-2.5 text-base rounded-lg',
};

const STEPS = {
  halves: '0.5',
  quarters: '0.25',
  tenths: '0.1',
  hundredths: '0.01',
};

const UNITS = {
  //Add support for imperial units when settings are implemented
  length: 'cm',
  weight: 'kg'
};

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: keyof typeof SIZES,
  step?: keyof typeof STEPS,
  unit?: keyof typeof UNITS,
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function NumberInput({
  size = 'md',
  step = 'tenths',
  unit = 'length',
  fullWidth = false,
  className = '',
  icon,
  ...props
}: NumberInputProps) {
  
  const baseClasses = 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-50 disabled:bg-slate-50 transition-all duration-200 flex-1 min-w-0 text-center';
  const paddingXClasses = icon ? 'pl-10 pr-4' : 'px-4';

  const combinedClasses = `
    ${baseClasses} 
    ${SIZES[size]} 
    ${paddingXClasses}
    ${fullWidth ? 'w-full' : ''} 
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`relative inline-flex items-center ${fullWidth ? 'w-full' : ''} gap-2`}>
      {icon && (
        <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input
        type="number"
        step={STEPS[step]}
        placeholder={step === 'halves' || step === 'tenths' ? '-.-' : '-.--'}
        className={combinedClasses} {...props}
      />
      <span className="text-right whitespace-nowrap font-title text font-medium">{UNITS[unit]}</span>
    </div>
  );
}
