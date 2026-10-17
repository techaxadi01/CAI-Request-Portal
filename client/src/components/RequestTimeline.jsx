import React from 'react';
import { CheckCircle2, Clock, MessageSquare, Send, Award, FileQuestion } from 'lucide-react';

export default function RequestTimeline({ timeline = [], className = '' }) {
  if (!timeline || timeline.length === 0) {
    return <div className="text-xs text-slate-500 italic">No timeline recorded yet.</div>;
  }

  const getStepIcon = (role, action) => {
    if (action.includes('Approved') || action.includes('Closed') || action.includes('Confirmed')) {
      return <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
    if (action.includes('Corrections') || action.includes('Changes')) {
      return <FileQuestion className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
    if (role === 'Specialist') {
      return <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
    if (role === 'Coordinator') {
      return <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
    return <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {timeline.map((event, idx) => {
          const isLast = idx === timeline.length - 1;
          const formattedDate = new Date(event.timestamp).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li key={idx}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center ring-4 ring-white dark:ring-slate-900 shadow-xs">
                      {getStepIcon(event.byRole, event.action)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {event.action}
                      </p>
                      <time className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formattedDate}
                      </time>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{event.byName}</span>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {event.byRole}
                      </span>
                    </div>
                    {event.notes && (
                      <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 leading-relaxed font-sans">
                        {event.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
