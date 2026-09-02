import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="py-16 px-6 text-center rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
        <p className="text-[13px] sm:text-sm text-zinc-400 font-normal leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold uppercase tracking-wide transition-all cursor-pointer shadow-lg shadow-red-950/60 leading-tight"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
