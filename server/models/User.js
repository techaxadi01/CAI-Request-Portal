const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['requester', 'coordinator', 'specialist'],
      default: 'requester',
    },
    campus: {
      type: String,
      default: 'Christ University Central Campus',
    },
    department: {
      type: String,
      default: 'COMPUTER SCIENCE',
    },
    designation: {
      type: String,
      default: 'Faculty / Student',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Pre-save hook to encrypt password before storing in database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Prevent double-hashing if already encrypted
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      return await bcrypt.compare(candidatePassword, this.password);
    }
    return this.password === candidatePassword;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
