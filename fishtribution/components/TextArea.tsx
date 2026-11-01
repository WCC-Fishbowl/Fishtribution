import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fullWidth?: boolean;
  rows?: number;
}

export default function TextArea({
  fullWidth = false,
  rows = 4,
  className = '',
  ...props
}: TextAreaProps) {
  const baseClasses = 'border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-50 disabled:bg-slate-50 transition-all duration-200 rounded-lg py-2 px-4 resize-y';

  const combinedClasses = `
    ${baseClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <textarea
      rows={rows}
      className={combinedClasses}
      {...props}
    />
  );
}
