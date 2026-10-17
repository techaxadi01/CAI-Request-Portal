import React from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  Send,
  Users,
  CheckCircle2,
  Building,
  UploadCloud,
  ArrowRight,
  PhoneCall,
  UserCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ setCurrentView }) {
  const { user, switchDemoUser } = useAuth();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-christ-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-blue-100 backdrop-blur-xs shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Official Requests & Procurement Dispatch Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            CENTRE FOR ARTIFICIAL INTELLIGENCE
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 dark:text-christ-200 font-medium max-w-3xl mx-auto leading-relaxed">
            Requests Office Portal for Christ University Central Campus
          </p>

          <p className="text-sm text-slate-200 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A structured workflow replacing campus-wise spreadsheets and disjointed messaging with end-to-end audit tracking, coordinator mediation, and specialist assessments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all text-sm"
              >
                <span>Go to Your {user.role.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('login')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all text-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In with Institutional ID</span>
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('anita.sharma@christuniversity.in');
                    setCurrentView('dashboard');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30 text-sm backdrop-blur-xs hover:scale-105 transition-all"
                >
                  <span>Explore as Applicant (Demo)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Official Mandatory Information Box (Verbatim Document Compliance) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Requests Office: Information for Applicants
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official guidelines published by the Centre for Artificial Intelligence
              </p>
            </div>
          </div>

          {/* Verbatim quote box */}
          <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 dark:bg-slate-800/60 border border-blue-200/70 dark:border-slate-700 font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "Anyone with an organisation email can raise a request, from the main, north or city campus. You will need your name, campus, department, a short title, the category, names of other people involved, and the amount if any. Attach a signed covering letter, a short description, and any quotations or invoices. Files must be readable and under 10 MB. The office checks your request within 2 working days and may ask you to correct things more than once. Some requests go for expert review, which takes up to 7 working days. You never deal with the expert directly. When a decision is made, you confirm you have seen it, and only then is the request closed. The office is open Monday to Friday, 9:30 AM to 4:30 PM, closed on public holidays. For help, visit or call 080 0000 0000."
          </div>

          {/* Structured Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                <Building className="w-4 h-4" />
                <span>Eligible Campuses</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Open to <strong className="text-slate-900 dark:text-slate-100">Christ University Central Campus</strong> (Main, North, or City campus) members using institutional emails.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
                <UploadCloud className="w-4 h-4" />
                <span>Mandatory Documents</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Signed covering letter, short description, and any quotations/invoices. <strong className="text-slate-900 dark:text-slate-100">Under 10 MB each</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>2-Day Office Turnaround</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The coordinator checks submissions within <strong className="text-slate-900 dark:text-slate-100">2 working days</strong> and may ask for corrections.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Expert Review (Up to 7 Days)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Technical requests undergo external specialist review. <strong className="text-slate-900 dark:text-slate-100">You never deal with the expert directly</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mandatory Closure Confirmation</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When a decision is made, <strong className="text-slate-900 dark:text-slate-100">you confirm seeing it</strong>; only then is the request closed.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-md transition-all space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
                <PhoneCall className="w-4 h-4" />
                <span>Hours & Helpline</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Monday–Friday <strong className="text-slate-900 dark:text-slate-100">9:30 AM – 4:30 PM</strong> (closed holidays). Call <span className="font-mono font-bold">080 0000 0000</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Roles Workflow Visualizer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-sky-400">
            Three-Role Separation
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            How Requests Travel Through the System
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Each role accesses dedicated interfaces with strict boundary controls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1: Requester */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 dark:bg-slate-800 dark:text-blue-300 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Requesters (Faculty & Students)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit requests with details and documents &lt; 10 MB. Track live progress across all stages, upload requested corrections, and formally confirm decisions before closure.
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>• Demo 1: <span className="font-medium text-slate-800 dark:text-slate-200">Dr. Anita Sharma</span> (Faculty - Central Campus)</div>
                <div>• Demo 2: <span className="font-medium text-slate-800 dark:text-slate-200">Priya Sundaram</span> (Student - Central Campus)</div>
              </div>
            </div>
            <button
              onClick={() => {
                switchDemoUser('anita.sharma@christuniversity.in');
                setCurrentView('dashboard');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-slate-700 transition-all hover:scale-[1.02]"
            >
              Login as Requester Demo
            </button>
          </div>

          {/* Role 2: Coordinator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-blue-500/40 dark:border-blue-600/40 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-blue-600 text-white shadow-xs">
              Central Hub
            </span>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-300 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Coordinator (Prof. Rajesh Nair)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The central office anchor who verifies documents within 2 working days, filters requests by campus (preventing mix-ups), requests fixes from requesters, routes files to the specialist, and sanctions outcomes.
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>• Email: <span className="font-mono text-slate-700 dark:text-slate-300">coordinator@christuniversity.in</span></div>
                <div>• Solves the chaos of disjointed Excel and WhatsApp</div>
              </div>
            </div>
            <button
              onClick={() => {
                switchDemoUser('coordinator@christuniversity.in');
                setCurrentView('dashboard');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              Login as Coordinator Demo
            </button>
          </div>

          {/* Role 3: Specialist */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Specialist (Dr. K. S. Ramanathan)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                External technical consultant (~50 yrs old). Designed with extreme WhatsApp-clean simplicity: large high-contrast cards, zero jargon, privacy-masked applicant details, and clear recommendation options.
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>• Turnaround: <span className="font-medium text-slate-800 dark:text-slate-200">Up to 7 working days</span></div>
                <div>• Direct applicant contact: <span className="text-rose-500 font-bold">Never directly</span></div>
              </div>
            </div>
            <button
              onClick={() => {
                switchDemoUser('specialist@christuniversity.in');
                setCurrentView('dashboard');
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-slate-700 transition-all hover:scale-[1.02]"
            >
              Login as Specialist Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
