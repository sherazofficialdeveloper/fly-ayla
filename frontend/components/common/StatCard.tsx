import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: 'red' | 'emerald' | 'blue' | 'amber' | 'neutral';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  accent = 'neutral',
  onClick,
  className = ''
}) => {
  const accentStyles = {
    red: 'border-l-2 border-l-red-500 hover:border-red-500/40',
    emerald: 'border-l-2 border-l-emerald-500 hover:border-emerald-500/40',
    blue: 'border-l-2 border-l-blue-500 hover:border-blue-500/40',
    amber: 'border-l-2 border-l-amber-500 hover:border-amber-500/40',
    neutral: 'hover:border-white/20'
  };

  const iconColors = {
    red: 'text-red-400 bg-red-950/40 border-red-500/30',
    emerald: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    blue: 'text-blue-400 bg-blue-950/40 border-blue-500/30',
    amber: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    neutral: 'text-zinc-300 bg-zinc-900 border-white/10'
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-[8px] bg-[#0c0d12] border border-white/10 text-left transition-all duration-200 hover:-translate-y-0.5 ${accentStyles[accent]} ${
        onClick ? 'cursor-pointer hover:bg-[#12131a] shadow-lg' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-[6px] border shrink-0 ${iconColors[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          {subtext && <span className="font-normal leading-normal">{subtext}</span>}
          {trend && (
            <span className={`font-medium ml-auto ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend.positive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
