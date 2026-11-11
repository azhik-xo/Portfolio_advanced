const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    service: {
      type: String,
      enum: [
        'Web Development',
        'App Development',
        'UI/UX Design',
        'DevOps Engineering',
        'Powerlifting Coaching',
        'General Inquiry',
        'Other',
      ],
      default: 'Web Development',
    },
    budget: {
      type: String,
      default: 'Flexible',
    },
    timeline: {
      type: String,
      default: 'Ready to start',
    },
    clientType: {
      type: String,
      default: 'Startup / Company',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message or project summary'],
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
    },
    ip: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);

