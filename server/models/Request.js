const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: {
    type: String,
    enum: ['Signed Covering Letter', 'Description Brief', 'Quotations/Invoices', 'Correction Attachment', 'Other Supporting Document'],
    default: 'Other Supporting Document'
  },
  fileSize: { type: Number, default: 1024 }, // in bytes
  fileData: { type: String, default: '' },   // base64 or download mock
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String, default: 'Applicant' },
  version: { type: Number, default: 1 }
});

const timelineSchema = new mongoose.Schema({
  action: { type: String, required: true },
  byName: { type: String, required: true },
  byRole: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  badgeColor: { type: String, default: 'blue' }
});

const requestSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requesterName: {
      type: String,
      required: true,
    },
    requesterEmail: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      required: true,
      default: 'Christ University Central Campus',
    },
    department: {
      type: String,
      required: true,
    },
    shortTitle: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hardware & Equipment',
        'Software & Licenses',
        'Travel & Conference Grant',
        'Event & Workshop',
        'Research Grant & Subscriptions',
        'Other Institutional Need'
      ],
      default: 'Hardware & Equipment',
    },
    otherPeopleInvolved: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    documents: [documentSchema],

    // Workflow state
    status: {
      type: String,
      required: true,
      enum: [
        'Submitted',
        'Changes Requested',
        'Under Specialist Review',
        'Specialist Feedback Received',
        'Decision Made',
        'Completed'
      ],
      default: 'Submitted',
    },

    // Coordinator interactions
    coordinatorRemarks: {
      type: String,
      default: '',
    },
    coordinatorReviewedAt: {
      type: Date,
    },

    // Specialist interaction
    specialistAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    specialistAssignedName: {
      type: String,
      default: '',
    },
    coordinatorNoteToSpecialist: {
      type: String,
      default: '',
    },
    specialistReview: {
      recommendation: {
        type: String,
        enum: ['', 'Recommended', 'Not Recommended', 'Clarification Required'],
        default: '',
      },
      feedback: {
        type: String,
        default: '',
      },
      reviewedAt: {
        type: Date,
      },
      specialistName: {
        type: String,
        default: '',
      }
    },

    // Decision stage
    finalDecision: {
      outcome: {
        type: String,
        enum: ['', 'Approved', 'Rejected', 'Referred'],
        default: '',
      },
      decisionNotes: {
        type: String,
        default: '',
      },
      decidedAt: {
        type: Date,
      },
      decidedByName: {
        type: String,
        default: '',
      }
    },

    // Requester closure confirmation
    requesterConfirmed: {
      type: Boolean,
      default: false,
    },
    requesterConfirmedAt: {
      type: Date,
    },
    requesterConfirmationNote: {
      type: String,
      default: '',
    },

    timeline: [timelineSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema);
