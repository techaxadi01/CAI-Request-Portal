import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import CampusBadge from '../components/CampusBadge';
import EmailWarningBanner from '../components/EmailWarningBanner';

export default function RequesterDashboard({ setCurrentView, setSelectedRequestId }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const fetchMyRequests = async () => {
    setLoading(true);
    const res = await api.getRequests({
      role: 'requester',
      userId: user?.id,
      userEmail: user?.email,
      status: filterStatus !== 'All' ? filterStatus : undefined,
      search: search.trim() || undefined,
    });
    if (res.success) {
      setRequests(res.requests || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMyRequests();
    }
  }, [user, filterStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMyRequests();
  };

  const handleConfirmClosure = async (requestId, e) => {
    e.stopPropagation();
    if (window.confirm('Do you confirm you have seen the decision outcome? This will formally close the request.')) {
      const res = await api.confirmClosure(requestId, {
        requesterName: user?.name,
        confirmationNote: `Confirmed by applicant ${user?.name} on ${new Date().toLocaleDateString('en-IN')}`,
      });
      if (res.success) {
        fetchMyRequests();
      } else {
        alert(res.message || 'Failed to confirm closure');
      }
    }
  };

  // Metrics
  const activeCount = requests.filter((r) => r.status !== 'Completed').length;
  const changesCount = requests.filter((r) => r.status === 'Changes Requested').length;
  const decisionCount = requests.filter((r) => r.status === 'Decision Made').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Applicant Portal</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              {user?.campus || 'Christ University Central Campus'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Logged in as {user?.name} ({user?.email}) • {user?.department}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchMyRequests}
            title="Refresh requests"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('new-request')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 dark:bg-christ-800 dark:hover:bg-christ-700 text-white font-bold text-xs shadow-md hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise New Request</span>
          </button>
        </div>
      </div>

      <EmailWarningBanner email={user?.email} />

      {/* Actionable Alerts if Changes Requested or Decision Ready */}
      {changesCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 flex-1">
            <span className="font-bold text-sm">Action Needed: Corrections Requested on {changesCount} request(s)</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              The coordinator checked your file and requested additional documentation or clarification. Please view the request to submit fixes.
            </p>
          </div>
        </div>
      )}

      {decisionCount > 0 && (
        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 flex-1">
            <span className="font-bold text-sm">Decision Finalized: Confirmation Needed on {decisionCount} request(s)</span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              "When a decision is made, you confirm you have seen it, and only then is the request closed." Please review and confirm below.
            </p>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Requests</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Needs Fixes</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{changesCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all shadow-xs">
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Awaiting Confirmation</span>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{decisionCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-all shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Completed / Closed</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Submitted', 'Changes Requested', 'Under Specialist Review', 'Decision Made', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-blue-600 dark:bg-christ-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-christ-500"
          />
        </form>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Loading your requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no requests matching this filter. Click below to submit your first application.
          </p>
          <button
            onClick={() => setCurrentView('new-request')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-christ-800 hover:bg-christ-700 text-white font-semibold text-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise New Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req._id}
              onClick={() => {
                setSelectedRequestId(req._id);
                setCurrentView('request-detail');
              }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-christ-500 hover:shadow-lg transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {req.trackingId}
                  </span>
                  <CampusBadge campus={req.campus} />
                  <span className="text-xs text-slate-500 font-medium">{req.category}</span>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {req.shortTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {req.shortDescription}
                </p>
              </div>

              {/* Remarks highlight */}
              {req.status === 'Changes Requested' && req.coordinatorRemarks && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Coordinator's Correction Note:</span>
                  </div>
                  <p>{req.coordinatorRemarks}</p>
                </div>
              )}

              {req.status === 'Decision Made' && req.finalDecision?.outcome && (
                <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold">Sanctioned Outcome: {req.finalDecision.outcome}</span>
                    <p className="text-[11px] text-sky-800 dark:text-sky-300 mt-0.5">
                      {req.finalDecision.decisionNotes}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleConfirmClosure(req._id, e)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
                  >
                    Confirm & Close Request
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>Amount: <strong className="text-slate-800 dark:text-slate-200">Rs. {Number(req.amount || 0).toLocaleString('en-IN')}</strong></span>
                  <span>•</span>
                  <span>Documents: <strong className="text-slate-800 dark:text-slate-200">{req.documents?.length || 0} attached</strong></span>
                </div>

                <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                  <span>View Details & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
