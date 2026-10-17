const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');

// GET /api/requests
// Role-based retrieval and query filters
router.get('/', async (req, res) => {
  try {
    const { role, userId, userEmail, campus, category, status, search } = req.query;

    let filter = {};

    if (role === 'requester') {
      if (userId) {
        filter.requesterId = userId;
      } else if (userEmail) {
        filter.requesterEmail = userEmail.toLowerCase();
      }
    } else if (role === 'specialist') {
      // Specialists only see requests routed for specialist review
      if (userId) {
        filter.$or = [
          { specialistAssigned: userId },
          { status: { $in: ['Under Specialist Review', 'Specialist Feedback Received'] } },
        ];
      } else {
        filter.status = { $in: ['Under Specialist Review', 'Specialist Feedback Received'] };
      }
    } else {
      // Coordinator sees all requests across all campuses
      if (campus && campus !== 'All') {
        filter.campus = campus;
      }
      if (category && category !== 'All') {
        filter.category = category;
      }
      if (status && status !== 'All') {
        filter.status = status;
      }
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { shortTitle: regex },
          { trackingId: regex },
          { requesterName: regex },
          { department: regex },
        ],
      });
    }

    const requests = await Request.find(filter).sort({ updatedAt: -1, createdAt: -1 });

    // Specialist role protection: mask direct contact of requester
    if (role === 'specialist') {
      const sanitized = requests.map((r) => {
        const doc = r.toObject();
        doc.requesterEmail = 'Protected (Mediated by Coordinator)';
        return doc;
      });
      return res.json({ success: true, count: sanitized.length, requests: sanitized });
    }

    return res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    console.error('Fetch requests error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve requests.' });
  }
});

// GET /api/requests/:id
router.get('/:id', async (req, res) => {
  try {
    const { role } = req.query;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const doc = request.toObject();
    if (role === 'specialist') {
      doc.requesterEmail = 'Protected (Mediated by Coordinator)';
    }

    return res.json({ success: true, request: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving request.' });
  }
});

// POST /api/requests
// Requester submits a new request
router.post('/', async (req, res) => {
  try {
    const {
      requesterId,
      requesterName,
      requesterEmail,
      campus,
      department,
      shortTitle,
      category,
      otherPeopleInvolved,
      amount,
      shortDescription,
      documents,
    } = req.body;

    if (!requesterName || !campus || !department || !shortTitle || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields (Name, Campus, Department, Title, Description).',
      });
    }

    // Validate document sizes (must be < 10 MB per doc)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (documents && Array.isArray(documents)) {
      for (const doc of documents) {
        if (doc.fileSize && doc.fileSize > MAX_FILE_SIZE) {
          return res.status(400).json({
            success: false,
            message: `File "${doc.fileName}" exceeds the 10 MB size limit permitted by the Requests Office.`,
          });
        }
      }
    }

    // Generate unique tracking ID
    const count = await Request.countDocuments();
    const nextSeq = String(count + 1).padStart(3, '0');
    const trackingId = `CAI-2026-${nextSeq}`;

    const newRequest = await Request.create({
      trackingId,
      requesterId: requesterId || null,
      requesterName,
      requesterEmail: (requesterEmail || '').toLowerCase(),
      campus,
      department,
      shortTitle,
      category: category || 'Hardware & Equipment',
      otherPeopleInvolved: otherPeopleInvolved || 'None',
      amount: Number(amount) || 0,
      shortDescription,
      documents: documents && documents.length > 0 ? documents : [],
      status: 'Submitted',
      timeline: [
        {
          action: 'Request Submitted by Applicant',
          byName: requesterName,
          byRole: 'Requester',
          timestamp: new Date(),
          notes: `New request logged for ${campus} - ${department}. Documents submitted: ${documents ? documents.length : 0}.`,
          badgeColor: 'blue',
        },
      ],
    });

    return res.status(201).json({ success: true, trackingId, request: newRequest });
  } catch (err) {
    console.error('Create request error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create request.' });
  }
});

// PUT /api/requests/:id/coordinator-action
// Coordinator workflow actions
router.put('/:id/coordinator-action', async (req, res) => {
  try {
    const { action, coordinatorName, remarks, specialistId, specialistName, noteToSpecialist, decisionOutcome, decisionNotes } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const cName = coordinatorName || 'Prof. Rajesh Nair (Coordinator)';

    if (action === 'request_corrections') {
      if (!remarks || remarks.trim() === '') {
        return res.status(400).json({ success: false, message: 'Please specify the correction remarks for the requester.' });
      }
      request.status = 'Changes Requested';
      request.coordinatorRemarks = remarks;
      request.coordinatorReviewedAt = new Date();
      request.timeline.push({
        action: 'Corrections Requested by Coordinator',
        byName: cName,
        byRole: 'Coordinator',
        timestamp: new Date(),
        notes: remarks,
        badgeColor: 'amber',
      });
    } else if (action === 'forward_to_specialist') {
      let specUser = null;
      if (specialistId) {
        specUser = await User.findById(specialistId);
      } else {
        specUser = await User.findOne({ role: 'specialist' });
      }

      request.status = 'Under Specialist Review';
      request.specialistAssigned = specUser ? specUser._id : null;
      request.specialistAssignedName = specUser ? specUser.name : (specialistName || 'Dr. K. S. Ramanathan');
      request.coordinatorNoteToSpecialist = noteToSpecialist || remarks || '';
      request.coordinatorRemarks = remarks || 'Forwarded for external technical evaluation.';
      request.coordinatorReviewedAt = new Date();

      request.timeline.push({
        action: 'Forwarded to External Specialist',
        byName: cName,
        byRole: 'Coordinator',
        timestamp: new Date(),
        notes: `Routed to ${request.specialistAssignedName} for expert assessment (7 working days window). Note: ${noteToSpecialist || 'Review requested.'}`,
        badgeColor: 'indigo',
      });
    } else if (action === 'make_decision') {
      if (!decisionOutcome) {
        return res.status(400).json({ success: false, message: 'Decision outcome (Approved/Rejected) is required.' });
      }
      request.status = 'Decision Made';
      request.coordinatorRemarks = remarks || decisionNotes || '';
      request.finalDecision = {
        outcome: decisionOutcome,
        decisionNotes: decisionNotes || remarks || 'Decision finalized by coordinator.',
        decidedAt: new Date(),
        decidedByName: cName,
      };

      request.timeline.push({
        action: `Outcome Recorded: ${decisionOutcome}`,
        byName: cName,
        byRole: 'Coordinator',
        timestamp: new Date(),
        notes: decisionNotes || `Request marked as ${decisionOutcome}. Pending applicant confirmation to formally close.`,
        badgeColor: decisionOutcome === 'Approved' ? 'emerald' : 'rose',
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid coordinator action.' });
    }

    await request.save();
    return res.json({ success: true, request });
  } catch (err) {
    console.error('Coordinator action error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process coordinator action.' });
  }
});

// PUT /api/requests/:id/specialist-review
// Specialist evaluates request
router.put('/:id/specialist-review', async (req, res) => {
  try {
    const { recommendation, feedback, specialistName } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (!recommendation) {
      return res.status(400).json({ success: false, message: 'Recommendation is required (Recommended, Not Recommended, or Clarification Required).' });
    }

    const sName = specialistName || 'Dr. K. S. Ramanathan (Specialist)';

    request.specialistReview = {
      recommendation,
      feedback: feedback || '',
      reviewedAt: new Date(),
      specialistName: sName,
    };

    request.status = 'Specialist Feedback Received';

    request.timeline.push({
      action: `Specialist Review: ${recommendation}`,
      byName: sName,
      byRole: 'Specialist',
      timestamp: new Date(),
      notes: feedback || `Specialist recommendation logged: ${recommendation}. Returned to coordinator.`,
      badgeColor: recommendation === 'Recommended' ? 'purple' : recommendation === 'Clarification Required' ? 'amber' : 'rose',
    });

    await request.save();
    return res.json({ success: true, request });
  } catch (err) {
    console.error('Specialist review error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record specialist review.' });
  }
});

// PUT /api/requests/:id/requester-correction
// Requester submits fixes after changes requested
router.put('/:id/requester-correction', async (req, res) => {
  try {
    const { requesterName, correctionNotes, newDocuments } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (newDocuments && Array.isArray(newDocuments) && newDocuments.length > 0) {
      newDocuments.forEach((doc) => {
        request.documents.push({
          ...doc,
          version: (request.documents.length + 1),
          uploadedAt: new Date(),
          uploadedBy: requesterName || request.requesterName,
        });
      });
    }

    request.status = 'Submitted'; // Returns to coordinator's review queue
    request.timeline.push({
      action: 'Applicant Resubmitted Corrections',
      byName: requesterName || request.requesterName,
      byRole: 'Requester',
      timestamp: new Date(),
      notes: correctionNotes || 'Uploaded revised supporting files for coordinator re-evaluation.',
      badgeColor: 'blue',
    });

    await request.save();
    return res.json({ success: true, request });
  } catch (err) {
    console.error('Requester correction error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit corrections.' });
  }
});

// PUT /api/requests/:id/confirm-closure
// Requester confirms outcome -> Closed!
router.put('/:id/confirm-closure', async (req, res) => {
  try {
    const { requesterName, confirmationNote } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    if (request.status !== 'Decision Made') {
      return res.status(400).json({ success: false, message: 'Closure confirmation is only available once a decision has been made.' });
    }

    request.requesterConfirmed = true;
    request.requesterConfirmedAt = new Date();
    request.requesterConfirmationNote = confirmationNote || 'Acknowledged and confirmed by applicant.';
    request.status = 'Completed';

    request.timeline.push({
      action: 'Applicant Confirmed Outcome & Closed Request',
      byName: requesterName || request.requesterName,
      byRole: 'Requester',
      timestamp: new Date(),
      notes: confirmationNote || 'Applicant confirmed seeing the outcome. Request officially marked Closed and archived.',
      badgeColor: 'emerald',
    });

    await request.save();
    return res.json({ success: true, request });
  } catch (err) {
    console.error('Confirm closure error:', err);
    return res.status(500).json({ success: false, message: 'Failed to confirm request closure.' });
  }
});

// POST /api/requests/seed-reset
// Restore initial sample requests and demo accounts
router.post('/seed-reset', async (req, res) => {
  try {
    const { demoUsers, sampleRequestsTemplate } = require('../seedData');
    await Request.deleteMany({});
    await User.deleteMany({});

    const createdUsers = await User.insertMany(demoUsers);
    const usersMap = {};
    createdUsers.forEach((u) => {
      usersMap[u.email] = u;
    });

    const initialRequests = sampleRequestsTemplate(usersMap);
    const createdReqs = await Request.insertMany(initialRequests);

    return res.json({
      success: true,
      message: `System reset complete. Seeded ${createdUsers.length} demo users and ${createdReqs.length} sample requests.`,
    });
  } catch (err) {
    console.error('Seed reset error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset sample data.' });
  }
});

module.exports = router;
