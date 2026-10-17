import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  UploadCloud,
  Send,
  Eye,
  DollarSign,
  Users,
  ShieldCheck,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import CampusBadge from '../components/CampusBadge';
import RequestTimeline from '../components/RequestTimeline';

export default function RequestDetailPage({ requestId, setCurrentView }) {
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Requester correction upload state
  const [showCorrectionBox, setShowCorrectionBox] = useState(false);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [correctionFiles, setCorrectionFiles] = useState([]);
  const [submittingCorrection, setSubmittingCorrection] = useState(false);

  // Requester confirm closure state
  const [confirmingClosure, setConfirmingClosure] = useState(false);

  const fetchDetail = async () => {
    if (!requestId) return;
    setLoading(true);
    const res = await api.getRequestById(requestId, user?.role);
    if (res.success) {
      setRequest(res.request);
    } else {
      setError(res.message || 'Unable to load request details.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, [requestId, user]);

  const handleConfirmClosure = async () => {
    if (window.confirm('Do you confirm you have seen the decision outcome? This will officially close the request.')) {
      setConfirmingClosure(true);
      const res = await api.confirmClosure(requestId, {
        requesterName: user?.name,
        confirmationNote: `Acknowledged and confirmed by applicant ${user?.name}.`,
      });
      setConfirmingClosure(false);
      if (res.success) {
        fetchDetail();
      } else {
        alert(res.message || 'Closure confirmation failed');
      }
    }
  };

  const handleAddCorrectionFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert(`File "${file.name}" exceeds 10 MB limit.`);
      return;
    }
    setCorrectionFiles([
      ...correctionFiles,
      {
        fileName: file.name,
        fileType: 'Correction Attachment',
        fileSize: file.size,
        uploadedAt: new Date(),
      },
    ]);
  };

  const handleSubmitCorrections = async (e) => {
    e.preventDefault();
    if (!correctionNotes.trim() && correctionFiles.length === 0) {
      alert('Please provide notes or attach a revised document.');
      return;
    }

    setSubmittingCorrection(true);
    const res = await api.requesterCorrection(requestId, {
      requesterName: user?.name,
      correctionNotes,
      newDocuments: correctionFiles,
    });
    setSubmittingCorrection(false);

    if (res.success) {
      setShowCorrectionBox(false);
      setCorrectionNotes('');
      setCorrectionFiles([]);
      fetchDetail();
    } else {
      alert(res.message || 'Failed to submit correction.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading request file...
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-sm text-rose-600 font-semibold">{error || 'Request not found.'}</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={fetchDetail}
          title="Refresh Data"
          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Request Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
              {request.trackingId}
            </span>
            <CampusBadge campus={request.campus} />
            <span className="text-xs font-semibold text-slate-500">{request.category}</span>
          </div>

          <StatusBadge status={request.status} />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
            {request.shortTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submitted by <strong className="text-slate-800 dark:text-slate-200">{request.requesterName}</strong> • {request.requesterEmail} • {request.department}
          </p>
        </div>

        {/* Action Callouts */}
        {request.status === 'Changes Requested' && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Coordinator Remarks (Correction Required):
              </span>
              {user?.role === 'requester' && !showCorrectionBox && (
                <button
                  onClick={() => setShowCorrectionBox(true)}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs"
                >
                  Upload Fixes
                </button>
              )}
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-100 leading-relaxed font-sans">
              {request.coordinatorRemarks || 'Please review deficiencies and upload corrected documents.'}
            </p>
          </div>
        )}

        {/* Decision Made Callout */}
        {request.status === 'Decision Made' && (
          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                Sanctioned Decision: {request.finalDecision?.outcome}
              </span>

              {user?.role === 'requester' && !request.requesterConfirmed && (
                <button
                  onClick={handleConfirmClosure}
                  disabled={confirmingClosure}
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                >
                  {confirmingClosure ? 'Confirming...' : 'Confirm Receipt of Decision & Close Request'}
                </button>
              )}
            </div>
            <p className="text-xs text-sky-950 dark:text-sky-100 leading-relaxed">
              {request.finalDecision?.decisionNotes}
            </p>
            {!request.requesterConfirmed && (
              <p className="text-[11px] text-sky-700 dark:text-sky-300 italic pt-1">
                * Document Rule: "When a decision is made, you confirm you have seen it, and only then is the request closed."
              </p>
            )}
          </div>
        )}

        {request.status === 'Completed' && (
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Request Officially Confirmed & Closed. Archival record stored in institutional database.
            </span>
          </div>
        )}

        {/* Resubmit Corrections Box */}
        {showCorrectionBox && (
          <form
            onSubmit={handleSubmitCorrections}
            className="p-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-amber-400 space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Submit Revised Documents / Response
            </h4>

            <textarea
              rows={3}
              value={correctionNotes}
              onChange={(e) => setCorrectionNotes(e.target.value)}
              placeholder="Explain the corrections made or address coordinator questions..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />

            <div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Attach Revised File (&lt;10 MB)</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleAddCorrectionFile}
                />
              </label>

              {correctionFiles.map((f, i) => (
                <span key={i} className="ml-2 text-xs font-mono text-blue-600 dark:text-blue-400">
                  {f.fileName}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCorrectionBox(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingCorrection}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs disabled:opacity-50"
              >
                {submittingCorrection ? 'Submitting...' : 'Send Back to Coordinator'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Details Grid & Document List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Request Details & Attached Documents */}
        <div className="md:col-span-7 space-y-6">
          {/* Project Scope & Specifications */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Request Details & Justification
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Description:
                </span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {request.shortDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500 block text-[11px]">Sanction Amount:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Rs. {Number(request.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-500 block text-[11px]">Other People Involved:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {request.otherPeopleInvolved || 'None stated'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Files (<10MB) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Document Attachments ({request.documents?.length || 0})
              </h2>
              <span className="text-[11px] text-slate-400">Under 10 MB per document</span>
            </div>

            <div className="space-y-2">
              {request.documents && request.documents.length > 0 ? (
                request.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileText className="w-5 h-5 text-christ-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {doc.fileName}
                        </p>
                        <span className="text-[11px] text-slate-500">
                          {doc.fileType} • {((doc.fileSize || 1024) / 1024).toFixed(0)} KB • v{doc.version || 1}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated secure preview of: ${doc.fileName}`)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:border-christ-500 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">No files attached.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Audit Timeline */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Request Travel History & Audit Trail
            </h2>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Verified
            </span>
          </div>

          <RequestTimeline timeline={request.timeline} />
        </div>
      </div>
    </div>
  );
}
