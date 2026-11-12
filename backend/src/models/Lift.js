const mongoose = require('mongoose');

const liftSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['lifts', 'physique', 'competitions', 'training', 'video'],
      default: 'lifts',
    },
    categoryLabel: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
    },
    thumbnail: {
      type: String,
      required: [true, 'Please provide a thumbnail URL'],
    },
    videoSrc: {
      type: String,
      default: '',
    },
    fullPhoto: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: 'PR',
    },
    w: {
      type: Number,
      default: 800,
    },
    h: {
      type: Number,
      default: 1000,
    },
    stats: {
      weight: { type: String, default: '' },
      reps: { type: String, default: '' },
      discipline: { type: String, default: '' },
      gear: { type: String, default: '' },
      meet: { type: String, default: '' },
      date: { type: String, default: '' },
      notes: { type: String, default: '' },
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

module.exports = mongoose.model('Lift', liftSchema);

