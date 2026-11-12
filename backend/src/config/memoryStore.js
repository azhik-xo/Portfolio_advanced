const fs = require('fs');
const path = require('path');

let memoryProjects = [];
let memoryLifts = [];
let memoryMessages = [];
let memoryProfile = {
  name: 'Ashik',
  title: 'Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
  location: 'Remote, Worldwide',
  responseTime: 'Within 5 hours',
  availability: 'Available for new projects',
  startingBudget: '$500',
  skills: ['Web Developer', 'App Developer', 'UI/UX Designer', 'DevOps Engineer', 'Powerlifter'],
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

function initMemoryStore() {
  try {
    const seedPath = path.join(__dirname, 'seed-data.json');
    if (fs.existsSync(seedPath)) {
      const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      memoryProjects = seed.projects.map((p, i) => ({
        _id: 'mem_proj_' + (i + 1),
        title: p.title || p.kind || 'Untitled',
        category: p.category || 'web',
        subtitle: p.sub || '',
        description: p.desc || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        liveUrl: p.url || '',
        videoUrl: p.video || '',
        posterUrl: p.poster || p.shot || '',
        mediaUrl: p.poster || p.shot || p.video || '',
        featured: Boolean(p.featured),
        order: Number(p.order) || i,
        createdAt: new Date().toISOString(),
      }));

      memoryLifts = seed.lifts.map((l, i) => ({
        _id: 'mem_lift_' + (i + 1),
        title: l.title,
        subtitle: l.subtitle || '',
        category: l.category || 'lifts',
        categoryLabel: l.categoryLabel || '',
        mediaType: l.mediaType || 'photo',
        thumbnail: l.thumbnail,
        videoSrc: l.videoSrc || '',
        fullPhoto: l.fullPhoto || l.thumbnail,
        badge: l.badge || 'PR',
        w: l.w || 800,
        h: l.h || 1000,
        stats: l.stats || {},
        order: Number(l.order) || i,
        createdAt: new Date().toISOString(),
      }));
    }
  } catch (e) {
    console.error('Error initializing memory store:', e.message);
  }
}

initMemoryStore();

module.exports = {
  getProjects: () => memoryProjects,
  addProject: (p) => {
    const item = { _id: 'mem_proj_' + Date.now(), createdAt: new Date().toISOString(), ...p };
    memoryProjects.unshift(item);
    return item;
  },
  updateProject: (id, updates) => {
    const idx = memoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (idx === -1) return null;
    memoryProjects[idx] = { ...memoryProjects[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryProjects[idx];
  },
  deleteProject: (id) => {
    const idx = memoryProjects.findIndex((p) => p._id === id || p.id === id);
    if (idx === -1) return false;
    memoryProjects.splice(idx, 1);
    return true;
  },

  getLifts: () => memoryLifts,
  addLift: (l) => {
    const item = { _id: 'mem_lift_' + Date.now(), createdAt: new Date().toISOString(), ...l };
    memoryLifts.unshift(item);
    return item;
  },
  updateLift: (id, updates) => {
    const idx = memoryLifts.findIndex((l) => l._id === id || l.id === id);
    if (idx === -1) return null;
    memoryLifts[idx] = { ...memoryLifts[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryLifts[idx];
  },
  deleteLift: (id) => {
    const idx = memoryLifts.findIndex((l) => l._id === id || l.id === id);
    if (idx === -1) return false;
    memoryLifts.splice(idx, 1);
    return true;
  },

  getMessages: () => memoryMessages,
  addMessage: (m) => {
    const item = { _id: 'mem_msg_' + Date.now(), createdAt: new Date().toISOString(), ...m };
    memoryMessages.unshift(item);
    return item;
  },
  deleteMessage: (id) => {
    const idx = memoryMessages.findIndex((m) => m._id === id);
    if (idx === -1) return false;
    memoryMessages.splice(idx, 1);
    return true;
  },

  getProfile: () => memoryProfile,
  updateProfile: (updates) => {
    memoryProfile = { ...memoryProfile, ...updates };
    return memoryProfile;
  },
};

