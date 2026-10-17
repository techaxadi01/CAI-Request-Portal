const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper to validate Christ University email
function validateChristEmail(email) {
  if (!email || typeof email !== 'string') return { isValidChrist: false, type: 'unknown' };
  const cleanEmail = email.trim().toLowerCase();

  const facultyPattern = /^[a-zA-Z0-9._%+-]+@christuniversity\.in$/;
  const studentPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.christuniversity\.in$/;

  if (facultyPattern.test(cleanEmail)) {
    return { isValidChrist: true, type: 'faculty', message: 'Valid Christ University Faculty Email' };
  } else if (studentPattern.test(cleanEmail)) {
    return { isValidChrist: true, type: 'student', message: 'Valid Christ University Student Email' };
  } else {
    return {
      isValidChrist: false,
      type: 'external',
      message:
        'Warning: This email does not match official Christ University formats (Faculty: user@christuniversity.in, Student: user@course.christuniversity.in). Proceeding in testing mode.',
    };
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const emailCheck = validateChristEmail(user.email);

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        campus: user.campus,
        department: user.department,
        designation: user.designation,
      },
      emailWarning: !emailCheck.isValidChrist ? emailCheck.message : null,
      token: `demo-token-${user._id}-${Date.now()}`,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, campus, department, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const emailCheck = validateChristEmail(cleanEmail);

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: role || 'requester',
      campus: campus || 'Main Campus',
      department: department || 'General Studies',
      designation: designation || (emailCheck.type === 'faculty' ? 'Faculty Member' : 'Student'),
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        campus: newUser.campus,
        department: newUser.department,
        designation: newUser.designation,
      },
      emailWarning: !emailCheck.isValidChrist ? emailCheck.message : null,
      token: `demo-token-${newUser._id}-${Date.now()}`,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create user account.' });
  }
});

// GET /api/auth/demo-users
router.get('/demo-users', async (req, res) => {
  try {
    const users = await User.find({
      email: {
        $in: [
          'coordinator@christuniversity.in',
          'specialist@christuniversity.in',
          'anita.sharma@christuniversity.in',
          'priya.s@mca.christuniversity.in',
        ],
      },
    }).select('name email role campus department designation');

    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch demo users.' });
  }
});

module.exports = router;
