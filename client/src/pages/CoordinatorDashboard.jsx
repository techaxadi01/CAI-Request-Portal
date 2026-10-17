import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Send,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  Building,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import CampusBadge from '../components/CampusBadge';

export default function CoordinatorDashboard({ setCurrentView, setSelectedRequestId }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campusTab, setCampusTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Action Modal State
  const [activeModal, setActiveModal] = useState(null); // 'forward' | 'correction' | 'decision'
  const [targetRequest, setTargetRequest] = useState(null);
  const [modalInput, setModalInput] = useState({
    remarks: '',
    specialistId: '',
    specialistName: 'Dr. K. S. Ramanathan',
    noteToSpecialist: '',
    decisionOutcome: 'Approved',
    decisionNotes: '',
  });
  const [processing, setProcessing] = useState(false);

  const fetchCoordinatorRequests = async () => {
    setLoading(true);
    const res = await api.getRequests({
      role: 'coordinator',
      campus: campusTab !== 'All' ? campusTab : undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search: search.trim() || undefined,
    });
    if (res.success) {
      setRequests(res.requests || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoordinatorRequests();
  }, [campusTab, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCoordinatorRequests();
  };

  const openActionModal = (reqItem, modalType, e) => {
    e.stopPropagation();
    setTargetRequest(reqItem);
    setActiveModal(modalType);
    setModalInput({
      remarks: '',
      specialistId: '',
      specialistName: 'Dr. K. S. Ramanathan',
      noteToSpecialist: '',
      decisionOutcome: 'Approved',
      decisionNotes: '',
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!targetRequest) return;
    setProcessing(true);

    let payload = {
      action: '',
      coordinatorName: user?.name || 'Prof. Rajesh Nair (Coordinator)',
    };

    if (activeModal === 'forward') {
      payload.action = 'forward_to_specialist';
      payload.specialistName = modalInput.specialistName;
      payload.noteToSpecialist = modalInput.noteToSpecialist;
      payload.remarks = modalInput.noteToSpecialist || 'Assigned for expert review.';
    } else if (activeModal === 'correction') {
      payload.action = 'request_corrections';
      payload.remarks = modalInput.remarks;
    } else if (activeModal === 'decision') {
      payload.action = 'make_decision';
      payload.decisionOutcome = modalInput.decisionOutcome;
      payload.decisionNotes = modalInput.decisionNotes;
      payload.remarks = modalInput.decisionNotes;
    }

    const res = await api.coordinatorAction(targetRequest._id, payload);
    setProcessing(false);

    if (res.success) {
      setActiveModal(null);
      setTargetRequest(null);
      fetchCoordinatorRequests();
    } else {
      alert(res.message || 'Action failed.');
    }
  };

  // Metrics
  const intakeCount = requests.filter((r) => r.status === 'Submitted').length;
  const specialistCount = requests.filter(
    (r) => r.status === 'Under Specialist Review' || r.status === 'Specialist Feedback Received'
  ).length;
  const correctionCount = requests.filter((r) => r.status === 'Changes Requested').length;
  const decisionCount = requests.filter((r) => r.status === 'Decision Made').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Coordinator Central Control</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Prof. Rajesh Nair
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Centre for Artificial Intelligence • Unified Request Intake, Verification & Mediation Hub
          </p>
        </div>

        <button
          onClick={fetchCoordinatorRequests}
          title="Refresh All Records"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Pipeline</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            2-Day SLA Intake
          </span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{intakeCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Specialist Review
          </span>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{specialistCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Changes Requested
          </span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{correctionCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3" />
            Decision Made
          </span>
          <div className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{decisionCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Closed / Completed
          </span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Campus Selector Bar (Solves the "Recorded under wrong campus" excel sheet chaos) */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 flex items-center gap-1">
            <Building className="w-3.5 h-3.5" />
            Campus Filter:
          </span>
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {[
              { id: 'All', label: 'All Campuses' },
              { id: 'Christ University Central Campus', label: 'Central Campus' },
              { id: 'Bannerghatta Road Campus (BGR)', label: 'BGR Campus' },
              { id: 'Kengeri Campus', label: 'Kengeri' },
              { id: 'Yeshwanthpur Campus', label: 'Yeshwanthpur' },
              { id: 'Delhi NCR Campus', label: 'Delhi NCR' },
              { id: 'Pune Lavasa Campus', label: 'Pune Lavasa' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCampusTab(c.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  campusTab === c.id
                    ? 'bg-blue-600 dark:bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, ID, or applicant..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Status Pipeline Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold text-slate-500 text-[11px] mr-1">Status:</span>
        {[
          'All',
          'Submitted',
          'Changes Requested',
          'Under Specialist Review',
          'Specialist Feedback Received',
          'Decision Made',
          'Completed',
        ].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 dark:bg-christ-800 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Requests Table / Card View */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Updating coordinator dispatch queue...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pipeline Clear</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No requests currently match the selected campus and status filter.
          </p>
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
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {req.requesterName}
                  </span>
                  <span className="text-xs text-slate-400">({req.department})</span>
                </div>

                <StatusBadge status={req.status} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {req.shortTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {req.shortDescription}
                </p>
              </div>

              {/* Status context bar */}
              {req.status === 'Submitted' && (
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Intake Check Required within 2 working days.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => openActionModal(req, 'forward', e)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                    >
                      Forward to Specialist
                    </button>
                    <button
                      onClick={(e) => openActionModal(req, 'correction', e)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors"
                    >
                      Request Corrections
                    </button>
                    <button
                      onClick={(e) => openActionModal(req, 'decision', e)}
                      className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
                    >
                      Direct Decision
                    </button>
                  </div>
                </div>
              )}

              {req.status === 'Specialist Feedback Received' && (
                <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold">Specialist Assessed: {req.specialistReview?.recommendation}</span>
                    <p className="text-[11px] opacity-90">{req.specialistReview?.feedback}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => openActionModal(req, 'decision', e)}
                      className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                    >
                      Sanction Decision
                    </button>
                    <button
                      onClick={(e) => openActionModal(req, 'correction', e)}
                      className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs"
                    >
                      Relay Clarification to Requester
                    </button>
                  </div>
                </div>
              )}

              {req.status === 'Under Specialist Review' && (
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 text-xs flex items-center justify-between">
                  <span>Assigned to {req.specialistAssignedName || 'Dr. K. S. Ramanathan'} (7-Day Expert Review Window)</span>
                  <span className="text-[11px] font-mono opacity-80">Pending specialist response</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>Category: <strong className="text-slate-800 dark:text-slate-200">{req.category}</strong></span>
                  <span>•</span>
                  <span>Amount: <strong className="text-slate-800 dark:text-slate-200">Rs. {Number(req.amount || 0).toLocaleString('en-IN')}</strong></span>
                  <span>•</span>
                  <span>Documents: <strong className="text-slate-800 dark:text-slate-200">{req.documents?.length || 0} files</strong></span>
                </div>

                <div className="flex items-center gap-1 font-semibold text-christ-600 dark:text-christ-400">
                  <span>Inspect Audit File</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal (Forward to Specialist / Request Corrections / Sanction Decision) */}
      {activeModal && targetRequest && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-slate-400">{targetRequest.trackingId}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeModal === 'forward' && 'Forward Request to External Specialist'}
                {activeModal === 'correction' && 'Request Corrections from Applicant'}
                {activeModal === 'decision' && 'Sanction Coordinator Decision'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{targetRequest.shortTitle}</p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {activeModal === 'forward' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      External Specialist
                    </label>
                    <input
                      type="text"
                      value="Dr. K. S. Ramanathan (Technical Advisor)"
                      disabled
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      • Specialist will see documents and project brief via their simplified interface without direct applicant contact details.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Technical Question or Instruction for Specialist
                    </label>
                    <textarea
                      rows={3}
                      value={modalInput.noteToSpecialist}
                      onChange={(e) => setModalInput({ ...modalInput, noteToSpecialist: e.target.value })}
                      placeholder="e.g. Kindly verify compatibility of vendor GPU specifications with server room power load..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-christ-500"
                      required
                    />
                  </div>
                </>
              )}

              {activeModal === 'correction' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deficiencies Identified / Instructions for Applicant
                  </label>
                  <textarea
                    rows={4}
                    value={modalInput.remarks}
                    onChange={(e) => setModalInput({ ...modalInput, remarks: e.target.value })}
                    placeholder="e.g. The flight airfare quotation is missing the official university travel desk endorsement. Please re-upload as a PDF under 10 MB."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-christ-500"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    • Request status will switch to "Changes Requested" and notify applicant to upload revised attachments.
                  </p>
                </div>
              )}

              {activeModal === 'decision' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Final Sanction Outcome
                    </label>
                    <select
                      value={modalInput.decisionOutcome}
                      onChange={(e) => setModalInput({ ...modalInput, decisionOutcome: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-christ-500"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Sanction Notes & Budget Allocation
                    </label>
                    <textarea
                      rows={3}
                      value={modalInput.decisionNotes}
                      onChange={(e) => setModalInput({ ...modalInput, decisionNotes: e.target.value })}
                      placeholder="e.g. Sanctioned Rs. 1,85,000 under CAI Hardware Infrastructure Grant 2026. Requester must confirm receipt to complete closure."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-christ-500"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      • When decision is recorded, the applicant confirms seeing it, and only then is the request closed.
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-1.5 rounded-lg bg-christ-800 hover:bg-christ-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
