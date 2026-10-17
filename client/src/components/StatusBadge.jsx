import React from 'react';
import { Clock, AlertCircle, FileSearch, CheckCircle2, Award, CheckCheck } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const configs = {
    'Submitted': {
      label: 'Intake Review (2-Day SLA)',
      icon: Clock,
      style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    },
    'Changes Requested': {
      label: 'Corrections Required',
      icon: AlertCircle,
      style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    },
    'Under Specialist Review': {
      label: '7-Day Expert Review',
      icon: FileSearch,
      style: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    },
    'Specialist Feedback Received': {
      label: 'Specialist Feedback In',
      icon: CheckCircle2,
      style: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    },
    'Decision Made': {
      label: 'Decision Finalized',
      icon: Award,
      style: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
    },
    'Completed': {
      label: 'Confirmed & Closed',
      icon: CheckCheck,
      style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    },
  };

  const config = configs[status] || {
    label: status,
    icon: Clock,
    style: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-xs ${config.style} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
