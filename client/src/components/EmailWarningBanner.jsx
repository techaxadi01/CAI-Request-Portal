import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { evaluateEmailDomain } from '../utils/emailValidator';

export default function EmailWarningBanner({ email, showSuccess = false, className = '' }) {
  if (!email) return null;

  const info = evaluateEmailDomain(email);

  if (info.isValidChrist) {
    if (!showSuccess) return null;
    return (
      <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${info.badgeClass} ${className}`}>
        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-semibold">{info.typeLabel}:</span> Verified institutional Christ University address.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-lg border bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/70 dark:border-amber-800 dark:text-amber-200 flex items-start gap-3 shadow-xs ${className}`}>
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="text-xs space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <span>Non-Christ University Domain Detected</span>
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-200/80 dark:bg-amber-800/80 font-mono">Notice</span>
        </div>
        <p className="leading-relaxed">
          The Requests Office strictly expects institutional credentials:
          <span className="font-medium underline ml-1">xxx@christuniversity.in</span> (Faculty) or 
          <span className="font-medium underline ml-1">xxx@&lt;course&gt;.christuniversity.in</span> (Students).
        </p>
        <p className="text-[11px] opacity-90 text-amber-800 dark:text-amber-300">
          • You may continue in demo mode, but please use an official university ID for production requests.
        </p>
      </div>
    </div>
  );
}
