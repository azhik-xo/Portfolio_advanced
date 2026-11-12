const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const Lift = require('../models/Lift');
const Profile = require('../models/Profile');
const { getDBStatus } = require('../config/db');

const DEFAULT_PROFILE = {
  name: 'Ashik',
  title: 'Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
  location: 'Remote, Worldwide',
  responseTime: 'Within 5 hours',
  availability: 'Available for new projects',
  startingBudget: '$500',
  skills: [
    'Web Developer',
    'App Developer',
    'UI/UX Designer',
    'DevOps Engineer',
    'Powerlifter',
  ],
  stats: {
    experienceYears: '4+',
    productionClusters: '12+',
    uptimeRecord: '99.99%',
    bigThreeTotal: '585 kg (1,290 lbs)',
    deadliftPR: '235 kg',
    squatPR: '205 kg',
    benchPR: '145 kg',
  },
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'ashik@gmail.com',
  },
};

// GET /api/portfolio/profile
router.get('/profile', async (req, res) => {
  try {
    if (getDBStatus()) {
      const profile = await Profile.findOne();
      if (profile) return res.json({ success: true, data: profile });
    }
    res.json({ success: true, data: DEFAULT_PROFILE });
  } catch (err) {
    res.json({ success: true, data: DEFAULT_PROFILE });
  }
});

// GET /api/portfolio/skills
router.get('/skills', async (req, res) => {
  try {
    if (getDBStatus()) {
      const profile = await Profile.findOne();
      if (profile && profile.skills?.length > 0) {
        return res.json({ success: true, data: profile.skills });
      }
    }
    res.json({ success: true, data: DEFAULT_PROFILE.skills });
  } catch (err) {
    res.json({ success: true, data: DEFAULT_PROFILE.skills });
  }
});

// GET /api/portfolio/projects
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      const query = category && category !== 'all' ? { category } : {};
      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
      if (projects.length > 0) {
        return res.json({ success: true, count: projects.length, data: projects });
      }
    }

    // Fallback from seed data file if DB not ready
    const seedPath = path.join(__dirname, '../config/seed-data.json');
    if (fs.existsSync(seedPath)) {
      const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const list = category && category !== 'all'
        ? seed.projects.filter((p) => p.category === category)
        : seed.projects;
      return res.json({ success: true, count: list.length, data: list });
    }

    res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/portfolio/powerlifting
router.get('/powerlifting', async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      const query = category && category !== 'all' ? { category } : {};
      const lifts = await Lift.find(query).sort({ order: 1, createdAt: -1 });
      if (lifts.length > 0) {
        return res.json({ success: true, count: lifts.length, data: lifts });
      }
    }

    // Fallback from seed data file if DB not ready
    const seedPath = path.join(__dirname, '../config/seed-data.json');
    if (fs.existsSync(seedPath)) {
      const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const list = category && category !== 'all'
        ? seed.lifts.filter((l) => l.category === category)
        : seed.lifts;
      return res.json({ success: true, count: list.length, data: list });
    }

    res.json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/portfolio/assets
router.get('/assets', (req, res) => {
  try {
    const configPath = path.join(__dirname, '../config/cloudinary-assets.json');
    if (fs.existsSync(configPath)) {
      const assets = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return res.json({ success: true, provider: 'cloudinary', data: assets });
    }
    res.json({
      success: true,
      provider: 'local',
      message: 'Cloudinary assets mapping will be populated upon upload.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
