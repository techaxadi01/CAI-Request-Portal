import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Eye,
  Download,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import CampusBadge from '../components/CampusBadge';

export default function SpecialistDashboard({ setCurrentView, setSelectedRequestId }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review interaction state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [recommendation, setRecommendation] = useState('Recommended');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAssignedRequests = async () => {
    setLoading(true);
    const res = await api.getRequests({
      role: 'specialist',
      userId: user?.id,
    });
    if (res.success) {
      setRequests(res.requests || []);
      if (res.requests && res.requests.length > 0 && !selectedRequest) {
        setSelectedRequest(res.requests[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignedRequests();
  }, [user]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!feedback.trim()) {
      alert('Please provide your expert feedback notes.');
      return;
    }

    setSubmitting(true);
    const res = await api.specialistReview(selectedRequest._id, {
      recommendation,
      feedback,
      specialistName: user?.name || 'Dr. K. S. Ramanathan (Specialist)',
    });
    setSubmitting(false);

    if (res.success) {
      setSuccessMessage(`Assessment recorded successfully for ${selectedRequest.trackingId}. Returned to Coordinator.`);
      setFeedback('');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchAssignedRequests();
    } else {
      alert(res.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Specialist Header (WhatsApp-clean, high clarity) */}
      <div className="bg-gradient-to-r from-christ-900 via-christ-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-christ-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-christ-800 text-sky-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>External Technical Advisory Panel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Specialist Review Desk: {user?.name || 'Dr. K. S. Ramanathan'}
          </h1>
          <p className="text-xs text-sky-200">
            External Systems & Hardware Specialist • Simple Direct Review Feed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block text-xs text-sky-200">
            <span className="block font-bold text-white">7-Day Turnaround Window</span>
            <span>All applicant details mediated through Coordinator</span>
          </div>
          <button
            onClick={fetchAssignedRequests}
            title="Refresh Feed"
            className="p-2.5 rounded-xl bg-christ-700 hover:bg-christ-600 text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mediation Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Institutional Privacy Rule Active:</strong> You evaluate technical files and specifications without direct requester contact. Your advice is returned directly to the Coordinator (Prof. Rajesh Nair).
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Review Workplace */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">Loading specialist queue...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-blue-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">All Assigned Requests Evaluated</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have no pending requests assigned by the Coordinator at this moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Assigned Request Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Requests Assigned to You ({requests.length})
            </h2>

            {requests.map((req) => {
              const isSelected = selectedRequest?._id === req._id;
              const hasReviewed = req.status === 'Specialist Feedback Received';

              return (
                <div
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {req.trackingId}
                    </span>
                    <CampusBadge campus={req.campus} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {req.shortTitle}
                  </h3>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{req.category}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Rs. {Number(req.amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {hasReviewed ? (
                    <div className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 p-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Feedback Submitted: {req.specialistReview?.recommendation}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending Your Expert Assessment</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: High-Clarity Review & Assessment Panel */}
          {selectedRequest && (
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {selectedRequest.trackingId}
                    </span>
                    <CampusBadge campus={selectedRequest.campus} />
                  </div>
                  <StatusBadge status={selectedRequest.status} />
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedRequest.shortTitle}
                </h2>
                <div className="text-xs text-slate-500">
                  Department: <strong className="text-slate-700 dark:text-slate-300">{selectedRequest.department}</strong> • Budget Request: <strong className="text-slate-700 dark:text-slate-300">Rs. {Number(selectedRequest.amount || 0).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Coordinator's Question / Note */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  Coordinator's Directive to You (Prof. Rajesh Nair):
                </span>
                <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed font-sans">
                  {selectedRequest.coordinatorNoteToSpecialist ||
                    selectedRequest.coordinatorRemarks ||
                    'Please review hardware/software specifications and verify pricing justification.'}
                </p>
              </div>

              {/* Technical Description Brief */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Technical Project Brief
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedRequest.shortDescription}
                </div>
              </div>

              {/* Document Attachments to Inspect */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Attached Documents ({selectedRequest.documents?.length || 0})</span>
                  <span className="text-[11px] text-slate-400 font-normal">All verified &lt;10 MB</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                    selectedRequest.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {doc.fileName}
                            </p>
                            <span className="text-[10px] text-slate-500">{doc.fileType}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => alert(`Simulated preview/download of ${doc.fileName} (${(doc.fileSize / 1024).toFixed(0)} KB)`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                          title="Inspect Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic">No attachments staged.</div>
                  )}
                </div>
              </div>

              {/* Assessment Form (WhatsApp-clean buttons) */}
              <form onSubmit={handleSubmitReview} className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Your Expert Assessment & Recommendation
                </h4>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setRecommendation('Recommended')}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      recommendation === 'Recommended'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Recommend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecommendation('Clarification Required')}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      recommendation === 'Clarification Required'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Clarification Needed</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecommendation('Not Recommended')}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                      recommendation === 'Not Recommended'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Not Recommended</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specialist Findings & Advice for Coordinator
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your advice (e.g. 'Specifications verified. Hardware conforms to high-performance computing standards. Vendor quote #1 recommended.')"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Transmits directly to Prof. Rajesh Nair's coordinator console.
                  </span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Recording Assessment...' : 'Dispatch Assessment to Coordinator'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
