import React from 'react';

export type StatusType = 
  | 'Pending'
  | 'Processing'
  | 'Quoted'
  | 'Quote Ready'
  | 'Approved'
  | 'Rejected'
  | 'Booked'
  | 'Confirmed'
  | 'Dispatched'
  | 'In-Flight'
  | 'Completed'
  | 'Cancelled'
  | 'Paid'
  | 'Overdue'
  | 'Failed'
  | 'Active'
  | 'Inactive'
  | 'Available'
  | 'In Flight'
  | 'Maintenance'
  | 'Reserved'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'PASSED'
  | 'FLAGGED'
  | 'REVIEW REQUIRED'
  | 'CLEARED'
  | 'MONITORED'
  | 'BLOCKED'
  | 'SUCCESS'
  | 'WARNING'
  | 'ALERT'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const norm = (status || '').toUpperCase().trim();

  let style = 'bg-zinc-800/80 text-zinc-300 border-zinc-700/80';

  if (['APPROVED', 'CONFIRMED', 'PAID', 'CLEARED', 'PASSED', 'SUCCESS', 'AVAILABLE', 'COMPLETED', 'ACTIVE'].includes(norm)) {
    style = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
  } else if (['PROCESSING', 'IN-FLIGHT', 'IN FLIGHT', 'DISPATCHED', 'QUOTE READY', 'QUOTED'].includes(norm)) {
    style = 'bg-blue-950/70 text-blue-300 border-blue-500/40';
  } else if (['PENDING', 'SUBMITTED', 'MONITORED', 'REVIEW REQUIRED', 'MEDIUM', 'WARNING', 'RESERVED'].includes(norm)) {
    style = 'bg-amber-950/70 text-amber-300 border-amber-500/40';
  } else if (['REJECTED', 'CANCELLED', 'OVERDUE', 'FAILED', 'HIGH', 'CRITICAL', 'BLOCKED', 'ALERT', 'FLAGGED', 'MAINTENANCE'].includes(norm)) {
    style = 'bg-rose-950/70 text-rose-300 border-rose-500/40';
  } else if (['LOW'].includes(norm)) {
    style = 'bg-emerald-950/60 text-emerald-300 border-emerald-600/30';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold leading-tight',
    md: 'px-2.5 py-0.5 text-xs font-semibold leading-tight',
    lg: 'px-3 py-1 text-[13px] font-semibold leading-tight'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-wider uppercase ${sizeClasses[size]} ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${
        norm.includes('FAIL') || norm.includes('REJECT') || norm.includes('CRITICAL') || norm.includes('ALERT') || norm.includes('BLOCK')
          ? 'bg-rose-400'
          : norm.includes('APPROVED') || norm.includes('PAID') || norm.includes('CONFIRM') || norm.includes('CLEAR') || norm.includes('PASS') || norm.includes('LOW')
          ? 'bg-emerald-400'
          : norm.includes('PENDING') || norm.includes('WARN') || norm.includes('REVIEW')
          ? 'bg-amber-400'
          : 'bg-blue-400'
      }`} />
      <span>{status}</span>
    </span>
  );
};
