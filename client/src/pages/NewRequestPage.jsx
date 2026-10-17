import React, { useState } from 'react';
import {
  Send,
  Upload,
  FileText,
  AlertCircle,
  Building,
  CheckCircle,
  X,
  FileCheck,
  DollarSign,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import EmailWarningBanner from '../components/EmailWarningBanner';

export default function NewRequestPage({ setCurrentView, setSelectedRequestId }) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    campus: user?.campus || 'Christ University Central Campus',
    department: user?.department || 'COMPUTER SCIENCE',
    shortTitle: '',
    category: 'Hardware & Equipment',
    otherPeopleInvolved: '',
    amount: '',
    shortDescription: '',
  });

  const [documents, setDocuments] = useState([
    {
      fileName: 'Signed_Covering_Letter.pdf',
      fileType: 'Signed Covering Letter',
      fileSize: 320000,
      uploadedAt: new Date(),
      status: 'ready',
    },
    {
      fileName: 'Project_Technical_Brief.pdf',
      fileType: 'Description Brief',
      fileSize: 640000,
      uploadedAt: new Date(),
      status: 'ready',
    },
  ]);

  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setFileError(`File "${file.name}" exceeds the strict 10 MB maximum limit specified by the Requests Office.`);
      return;
    }

    // Filter out existing doc of same type or add new
    const filtered = documents.filter((d) => d.fileType !== fileType);
    filtered.push({
      fileName: file.name,
      fileType: fileType,
      fileSize: file.size,
      uploadedAt: new Date(),
      status: 'ready',
    });
    setDocuments(filtered);
  };

  const removeDocument = (fileType) => {
    setDocuments(documents.filter((d) => d.fileType !== fileType));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.shortTitle.trim() || !formData.shortDescription.trim()) {
      setError('Please provide a Short Title and Short Description.');
      return;
    }

    // Check mandatory covering letter
    const hasCoverLetter = documents.some((d) => d.fileType === 'Signed Covering Letter');
    if (!hasCoverLetter) {
      setError('Please attach the mandatory Signed Covering Letter (< 10 MB).');
      return;
    }

    setSubmitting(true);

    const payload = {
      requesterId: user?.id,
      requesterName: user?.name || 'Applicant',
      requesterEmail: user?.email,
      campus: formData.campus,
      department: formData.department,
      shortTitle: formData.shortTitle,
      category: formData.category,
      otherPeopleInvolved: formData.otherPeopleInvolved || 'None',
      amount: Number(formData.amount) || 0,
      shortDescription: formData.shortDescription,
      documents: documents,
    };

    const res = await api.createRequest(payload);
    setSubmitting(false);

    if (res.success) {
      if (res.request && res.request._id) {
        setSelectedRequestId(res.request._id);
        setCurrentView('request-detail');
      } else {
        setCurrentView('dashboard');
      }
    } else {
      setError(res.message || 'Failed to submit request.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Raise Institutional Request
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Centre for Artificial Intelligence • 2-Day Office Turnaround SLA
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      <EmailWarningBanner email={user?.email} showSuccess={true} />

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {fileError && (
        <div className="p-3 text-xs bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Applicant & Campus Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Applicant Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Originating Campus
              </label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Christ University Central Campus">Bangalore Central Campus (Hosur Road)</option>
                <option value="Bannerghatta Road Campus (BGR)">Bangalore Bannerghatta Road Campus (BGR)</option>
                <option value="Kengeri Campus">Bangalore Kengeri Campus</option>
                <option value="Yeshwanthpur Campus">Bangalore Yeshwanthpur Campus</option>
                <option value="Delhi NCR Campus">Delhi NCR Campus</option>
                <option value="Pune Lavasa Campus">Pune Lavasa Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Program
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-christ-500"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Request Specifics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Request Specifications
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Title of Request
            </label>
            <input
              type="text"
              name="shortTitle"
              value={formData.shortTitle}
              onChange={handleChange}
              placeholder="Enter short title of request"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-christ-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-christ-500"
              >
                <option value="Hardware & Equipment">Hardware & Equipment</option>
                <option value="Software & Licenses">Software & Licenses</option>
                <option value="Travel & Conference Grant">Travel & Conference Grant</option>
                <option value="Event & Workshop">Event & Workshop</option>
                <option value="Research Grant & Subscriptions">Research Grant & Subscriptions</option>
                <option value="Other Institutional Need">Other Institutional Need</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (INR, if any)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-christ-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Names of Other People Involved (Co-investigators, Faculty, Students)
            </label>
            <input
              type="text"
              name="otherPeopleInvolved"
              value={formData.otherPeopleInvolved}
              onChange={handleChange}
              placeholder="Names of other people involved (or None)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-christ-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description & Justification
            </label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Enter short description of request"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-christ-500"
              required
            />
          </div>
        </div>

        {/* 3. Mandatory Document Attachments (<10MB) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              3. Document Attachments (Readable & Under 10 MB)
            </h2>
            <span className="text-[11px] text-slate-500">
              {documents.length} File(s) Staged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Signed Covering Letter */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Signed Covering Letter *
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mandatory signed letter from applicant/guide.
                </p>
              </div>

              {documents.find((d) => d.fileType === 'Signed Covering Letter') ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs">
                  <span className="truncate max-w-[150px]">
                    {documents.find((d) => d.fileType === 'Signed Covering Letter').fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('Signed Covering Letter')}
                    className="p-1 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach PDF (&lt;10MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'Signed Covering Letter')}
                  />
                </label>
              )}
            </div>

            {/* 2. Short Description Document */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-600" />
                  Description Brief *
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Detailed technical or project scope brief.
                </p>
              </div>

              {documents.find((d) => d.fileType === 'Description Brief') ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs">
                  <span className="truncate max-w-[150px]">
                    {documents.find((d) => d.fileType === 'Description Brief').fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('Description Brief')}
                    className="p-1 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach PDF (&lt;10MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'Description Brief')}
                  />
                </label>
              )}
            </div>

            {/* 3. Quotations or Invoices */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  Quotations / Invoices
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Vendor quote / flight fare estimate (if amount involved).
                </p>
              </div>

              {documents.find((d) => d.fileType === 'Quotations/Invoices') ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs">
                  <span className="truncate max-w-[150px]">
                    {documents.find((d) => d.fileType === 'Quotations/Invoices').fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDocument('Quotations/Invoices')}
                    className="p-1 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs font-semibold hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach PDF (&lt;10MB)</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'Quotations/Invoices')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 dark:bg-christ-800 dark:hover:bg-christ-700 text-white font-bold text-xs shadow-md hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Transmitting to Office...' : 'Submit Request (2-Day SLA)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
