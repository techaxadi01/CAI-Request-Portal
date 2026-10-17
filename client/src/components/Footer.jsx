import React from 'react';
import { Phone, Clock, MapPin, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
            <div className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-christ-700 text-white flex items-center justify-center text-xs font-black">
                CAI
              </span>
              <span>Requests Office</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Centre for Artificial Intelligence<br />
              Christ University Central Campus institutional portal for research, equipment, and conference assistance.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-christ-400" />
              University Campuses
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• Bangalore Central Campus (Hosur Rd)</li>
              <li>• Bannerghatta Rd (BGR) & Kengeri</li>
              <li>• Yeshwanthpur, Delhi NCR & Pune Lavasa</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Office Hours & Turnaround
            </h4>
            <p className="text-slate-400">
              Monday to Friday: <span className="text-slate-200 font-medium">9:30 AM – 4:30 PM</span>
            </p>
            <p className="text-slate-400">Closed on public holidays & university vacations.</p>
            <p className="text-slate-400 text-[11px] pt-1">
              • Initial office check: <span className="text-sky-400">Within 2 working days</span><br />
              • Expert technical review: <span className="text-indigo-400">Up to 7 working days</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              Applicant Helpline
            </h4>
            <p className="text-white font-mono font-bold text-sm">080 0000 0000</p>
            <p className="text-slate-400 text-[11px]">
              For physical assistance, visit the Central Requests Office during working hours.
            </p>
            <p className="text-[11px] text-slate-500 italic pt-1">
              Note: Requesters never deal with external specialists directly; all communications are mediated by the Coordinator.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 Centre for Artificial Intelligence, Christ University. All rights reserved.</p>
          <p className="text-slate-500">Deemed to be University • Bengaluru, Karnataka</p>
        </div>
      </div>
    </footer>
  );
}
