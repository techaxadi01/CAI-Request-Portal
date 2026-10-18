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
              <button
                onClick={() => setCurrentView('login')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all text-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In with Institutional ID</span>
              </button>
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

      {/* The 3 Roles Workflow Visualizer (Pure Role Descriptions) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-sky-400">
            Three-Role Separation
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            How Requests Travel Through the System
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Each role accesses dedicated interfaces with strict boundary controls and audit tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1: Requesters */}
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
            </div>
            <div className="text-xs text-slate-500 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span><strong>Faculty:</strong> Institutional research & lab grants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span><strong>Students:</strong> Innovation & IEEE travel funding</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Mandatory closure confirmation required</span>
              </div>
            </div>
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
            </div>
            <div className="text-xs text-slate-500 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span><strong>Intake SLA:</strong> 2 working days turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Campus-wise tabs eliminate Excel chaos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Mediates all specialist communication</span>
              </div>
            </div>
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
                External technical consultant. Designed with extreme WhatsApp-clean simplicity: large high-contrast cards, zero jargon, privacy-masked applicant details, and clear recommendation options.
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span><strong>Review SLA:</strong> Up to 7 working days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span><strong>Direct contact:</strong> Strictly prohibited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>1-click recommendations: Recommend / Revise / Decline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated 1-Click Interactive Demo Sandbox Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 rounded-3xl p-6 sm:p-8 border border-blue-200/80 dark:border-slate-800 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-blue-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-sky-400">
                Fast Evaluator Sandbox
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Instant Demo Account Logins
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Select any pre-configured persona below to launch their authenticated dashboard in 1 click.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-auto shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Default Password: <code className="font-mono text-blue-600 dark:text-sky-400 font-bold">password123</code></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Demo 1: Faculty Requester */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    Faculty
                  </span>
                  <span className="text-[10px] text-slate-400">Central Campus</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Dr. Anita Sharma
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title="anita.sharma@christuniversity.in">
                  anita.sharma@christuniversity.in
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  AI GPU workstation proposal under technical review.
                </p>
              </div>
              <button
                onClick={() => {
                  switchDemoUser('anita.sharma@christuniversity.in');
                  setCurrentView('dashboard');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 dark:bg-slate-700 dark:hover:bg-blue-600 dark:text-blue-200 text-xs font-bold border border-blue-200 dark:border-slate-600 transition-all hover:scale-[1.02] shadow-xs"
              >
                Log in as Requester 1 (Faculty)
              </button>
            </div>

            {/* Demo 2: Student Requester */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
                    Student
                  </span>
                  <span className="text-[10px] text-slate-400">BGR Campus</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Priya Sundaram
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title="priya.s@mca.christuniversity.in">
                  priya.s@mca.christuniversity.in
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  IEEE conference travel grant with requested corrections.
                </p>
              </div>
              <button
                onClick={() => {
                  switchDemoUser('priya.s@mca.christuniversity.in');
                  setCurrentView('dashboard');
                }}
                className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 dark:bg-slate-700 dark:hover:bg-sky-600 dark:text-sky-200 text-xs font-bold border border-sky-200 dark:border-slate-600 transition-all hover:scale-[1.02] shadow-xs"
              >
                Log in as Requester 2 (Student)
              </button>
            </div>

            {/* Demo 3: Coordinator */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border-2 border-blue-400/50 dark:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                    Coordinator
                  </span>
                  <span className="text-[10px] text-slate-400">Central Office</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Prof. Rajesh Nair
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title="coordinator@christuniversity.in">
                  coordinator@christuniversity.in
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Full intake pipeline, campus filtering & sanctioning desk.
                </p>
              </div>
              <button
                onClick={() => {
                  switchDemoUser('coordinator@christuniversity.in');
                  setCurrentView('dashboard');
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02]"
              >
                Log in as Coordinator Demo
              </button>
            </div>

            {/* Demo 4: Specialist */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    Specialist
                  </span>
                  <span className="text-[10px] text-slate-400">Advisory Panel</span>
                </div>
                <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Dr. K. S. Ramanathan
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title="specialist@christuniversity.in">
                  specialist@christuniversity.in
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  WhatsApp-clean technical assessment & recommendations.
                </p>
              </div>
              <button
                onClick={() => {
                  switchDemoUser('specialist@christuniversity.in');
                  setCurrentView('dashboard');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 dark:bg-slate-700 dark:hover:bg-blue-600 dark:text-blue-200 text-xs font-bold border border-blue-200 dark:border-slate-600 transition-all hover:scale-[1.02] shadow-xs"
              >
                Log in as Specialist Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
