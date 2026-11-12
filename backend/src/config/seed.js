const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const Lift = require('../models/Lift');
const Profile = require('../models/Profile');
const Story = require('../models/Story');

async function seedInitialData() {
  try {
    const seedDataPath = path.join(__dirname, 'seed-data.json');
    if (!fs.existsSync(seedDataPath)) return;

    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

    // 1. Seed Projects if none exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && seedData.projects && seedData.projects.length > 0) {
      console.log(`[Database Seeder] Seeding ${seedData.projects.length} initial projects...`);
      const formattedProjects = seedData.projects.map((p) => ({
        title: p.title || p.kind || 'Untitled Project',
        category: p.category || 'web',
        subtitle: p.sub || '',
        description: p.desc || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        liveUrl: p.url || '',
        videoUrl: p.video || '',
        posterUrl: p.poster || p.shot || '',
        mediaUrl: p.poster || p.shot || p.video || '',
        featured: Boolean(p.featured),
        order: Number(p.order) || 0,
      }));
      await Project.insertMany(formattedProjects);
      console.log(`[Database Seeder] Successfully seeded ${formattedProjects.length} projects.`);
    }

    // 2. Seed Lifts if none exist
    const liftCount = await Lift.countDocuments();
    if (liftCount === 0 && seedData.lifts && seedData.lifts.length > 0) {
      console.log(`[Database Seeder] Seeding ${seedData.lifts.length} initial powerlifting entries...`);
      const formattedLifts = seedData.lifts.map((l) => ({
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
        order: Number(l.order) || 0,
      }));
      await Lift.insertMany(formattedLifts);
      console.log(`[Database Seeder] Successfully seeded ${formattedLifts.length} powerlifting entries.`);
    }

    // 3. Seed Profile if none exists
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log(`[Database Seeder] Initializing default profile settings...`);
      await Profile.create({
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
      });
      console.log(`[Database Seeder] Successfully initialized profile.`);
    }

    // 4. Seed Story Chapters if none exist
    const storyCount = await Story.countDocuments();
    if (storyCount === 0 && seedData.story && seedData.story.length > 0) {
      console.log(`[Database Seeder] Seeding ${seedData.story.length} story chapters...`);
      const formattedChapters = seedData.story.map((s, i) => ({
        year: s.year || '2026',
        when: s.when || '',
        title: s.title || '',
        org: s.org || '',
        bullets: Array.isArray(s.bullets) ? s.bullets : [],
        isCurrent: Boolean(s.isCurrent),
        order: Number(s.order) || i + 1,
      }));
      await Story.insertMany(formattedChapters);
      console.log(`[Database Seeder] Successfully seeded ${formattedChapters.length} story chapters.`);
    }
  } catch (err) {
    console.error('[Database Seeder Error]', err.message);
  }
}

module.exports = { seedInitialData };

