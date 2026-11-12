const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Ashik',
      trim: true,
    },
    title: {
      type: String,
      default: 'Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
    },
    location: {
      type: String,
      default: 'Remote, Worldwide',
    },
    responseTime: {
      type: String,
      default: 'Within 5 hours',
    },
    availability: {
      type: String,
      default: 'Available for new projects',
    },
    startingBudget: {
      type: String,
      default: '$500',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: [
      {
        type: String,
      },
    ],
    stats: {
      experienceYears: { type: String, default: '4+' },
      productionClusters: { type: String, default: '12+' },
      uptimeRecord: { type: String, default: '99.99%' },
      bigThreeTotal: { type: String, default: '315 kg (694.456 lbs)' },
      deadliftPR: { type: String, default: '135 kg' },
      squatPR: { type: String, default: '110 kg' },
      benchPR: { type: String, default: '70 kg' },
    },
    socials: {
      github: { type: String, default: 'https://github.com/azhik-xo' },
      linkedin: { type: String, default: 'https://linkedin.com/in/abdul-ashik-k/' },
      email: { type: String, default: 'syncthrive.meh@gmail.com' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);

