import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  helperText,
  error,
  className = '',
  children
}) => {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label className="block text-[13px] sm:text-sm font-medium tracking-wide text-zinc-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-[13px] text-zinc-400 font-normal leading-normal">{helperText}</p>
      )}
      {error && (
        <p className="text-[13px] text-rose-400 font-medium leading-normal">{error}</p>
      )}
    </div>
  );
};
