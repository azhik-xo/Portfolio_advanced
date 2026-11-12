const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
      default: '2026',
    },
    when: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    org: {
      type: String,
      required: true,
      trim: true,
    },
    bullets: [
      {
        type: String,
        trim: true,
      },
    ],
    isCurrent: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Story', storySchema);

