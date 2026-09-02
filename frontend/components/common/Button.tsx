import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[6px] hover:-translate-y-[1px] active:translate-y-0 leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50';

  const variants = {
    primary: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-md shadow-red-950/60 border border-red-500/30',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 shadow-sm',
    dark: 'bg-[#121218] hover:bg-[#181822] text-zinc-200 hover:text-white border border-white/10 hover:border-white/20',
    outline: 'bg-transparent hover:bg-white/5 text-zinc-300 hover:text-white border border-white/20 hover:border-white/40',
    ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent',
    danger: 'bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-600/50 shadow-md'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3 text-xs sm:text-sm gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};
