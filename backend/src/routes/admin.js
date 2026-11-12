const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const Project = require('../models/Project');
const Lift = require('../models/Lift');
const Profile = require('../models/Profile');
const Message = require('../models/Message');
const Story = require('../models/Story');
const { getDBStatus } = require('../config/db');
const memoryStore = require('../config/memoryStore');

// Protect all /api/admin routes
router.use(requireAdmin);

// ==========================================
// 1. STATS & OVERVIEW
// ==========================================
router.get('/stats', async (req, res) => {
  try {
    const isDBConnected = getDBStatus();
    let projectsCount = 0;
    let liftsCount = 0;
    let messagesCount = 0;
    let storyCount = 0;
    let recentMessages = [];

    if (isDBConnected) {
      projectsCount = await Project.countDocuments();
      liftsCount = await Lift.countDocuments();
      messagesCount = await Message.countDocuments();
      storyCount = await Story.countDocuments();
      recentMessages = await Message.find().sort({ createdAt: -1 }).limit(5);
    } else {
      projectsCount = memoryStore.getProjects().length;
      liftsCount = memoryStore.getLifts().length;
      messagesCount = memoryStore.getMessages().length;
      storyCount = memoryStore.getStory().length;
      recentMessages = memoryStore.getMessages().slice(0, 5);
    }

    res.json({
      success: true,
      data: {
        mongodb: isDBConnected ? 'connected' : 'active (in-memory mode)',
        counts: {
          projects: projectsCount,
          lifts: liftsCount,
          messages: messagesCount,
          story: storyCount,
        },
        recentMessages,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. PROJECTS CRUD
// ==========================================
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      const query = category && category !== 'all' ? { category } : {};
      const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: projects.length, data: projects });
    }

    let projects = memoryStore.getProjects();
    if (category && category !== 'all') {
      projects = projects.filter((p) => p.category === category);
    }
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/projects', async (req, res) => {
  try {
    const {
      title,
      category,
      subtitle,
      description,
      tags,
      liveUrl,
      githubUrl,
      mediaUrl,
      videoUrl,
      posterUrl,
      featured,
      order,
    } = req.body;

    if (!title || !category || !subtitle || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, category, subtitle, and description are required.',
      });
    }

    const tagList = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const projectPayload = {
      title: title.trim(),
      category,
      subtitle: subtitle.trim(),
      description: description.trim(),
      tags: tagList,
      liveUrl: liveUrl?.trim() || '',
      githubUrl: githubUrl?.trim() || '',
      mediaUrl: mediaUrl?.trim() || '',
      videoUrl: videoUrl?.trim() || '',
      posterUrl: posterUrl?.trim() || '',
      featured: Boolean(featured),
      order: Number(order) || 0,
    };

    if (getDBStatus()) {
      const project = await Project.create(projectPayload);
      return res.status(201).json({ success: true, message: 'Project created successfully', data: project });
    }

    const project = memoryStore.addProject(projectPayload);
    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    if (getDBStatus()) {
      const project = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      return res.json({ success: true, message: 'Project updated successfully', data: project });
    }

    const project = memoryStore.updateProject(id, updateData);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const project = await Project.findByIdAndDelete(id);
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      return res.json({ success: true, message: 'Project deleted successfully' });
    }

    const deleted = memoryStore.deleteProject(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. POWERLIFTING LIFTS CRUD
// ==========================================
router.get('/lifts', async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      const query = category && category !== 'all' ? { category } : {};
      const lifts = await Lift.find(query).sort({ order: 1, createdAt: -1 });
      return res.json({ success: true, count: lifts.length, data: lifts });
    }

    let lifts = memoryStore.getLifts();
    if (category && category !== 'all') {
      lifts = lifts.filter((l) => l.category === category);
    }
    res.json({ success: true, count: lifts.length, data: lifts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/lifts', async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      categoryLabel,
      mediaType,
      thumbnail,
      videoSrc,
      fullPhoto,
      badge,
      w,
      h,
      stats,
      order,
    } = req.body;

    if (!title || !thumbnail) {
      return res.status(400).json({
        success: false,
        error: 'Title and thumbnail URL are required.',
      });
    }

    const liftPayload = {
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      category: category || 'lifts',
      categoryLabel: categoryLabel?.trim() || '',
      mediaType: mediaType || 'photo',
      thumbnail: thumbnail.trim(),
      videoSrc: videoSrc?.trim() || '',
      fullPhoto: fullPhoto?.trim() || thumbnail.trim(),
      badge: badge?.trim() || 'PR',
      w: Number(w) || 800,
      h: Number(h) || 1000,
      stats: stats || {},
      order: Number(order) || 0,
    };

    if (getDBStatus()) {
      const lift = await Lift.create(liftPayload);
      return res.status(201).json({ success: true, message: 'Lift entry created successfully', data: lift });
    }

    const lift = memoryStore.addLift(liftPayload);
    res.status(201).json({ success: true, message: 'Lift entry created successfully', data: lift });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/lifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const lift = await Lift.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!lift) return res.status(404).json({ success: false, error: 'Lift entry not found' });
      return res.json({ success: true, message: 'Lift entry updated successfully', data: lift });
    }

    const lift = memoryStore.updateLift(id, req.body);
    if (!lift) return res.status(404).json({ success: false, error: 'Lift entry not found' });
    res.json({ success: true, message: 'Lift entry updated successfully', data: lift });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/lifts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const lift = await Lift.findByIdAndDelete(id);
      if (!lift) return res.status(404).json({ success: false, error: 'Lift entry not found' });
      return res.json({ success: true, message: 'Lift entry deleted successfully' });
    }

    const deleted = memoryStore.deleteLift(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Lift entry not found' });
    res.json({ success: true, message: 'Lift entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. CLIENT MESSAGES / INQUIRIES
// ==========================================
router.get('/messages', async (req, res) => {
  try {
    if (getDBStatus()) {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: messages.length, data: messages });
    }

    const messages = memoryStore.getMessages();
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const msg = await Message.findByIdAndDelete(id);
      if (!msg) return res.status(404).json({ success: false, error: 'Message not found' });
      return res.json({ success: true, message: 'Inquiry deleted successfully' });
    }

    const deleted = memoryStore.deleteMessage(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Message not found' });
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. PROFILE & SETTINGS
// ==========================================
router.get('/profile', async (req, res) => {
  try {
    if (getDBStatus()) {
      let profile = await Profile.findOne();
      if (!profile) profile = await Profile.create({});
      return res.json({ success: true, data: profile });
    }

    const profile = memoryStore.getProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    if (getDBStatus()) {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(req.body);
      } else {
        profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
          new: true,
          runValidators: true,
        });
      }
      return res.json({ success: true, message: 'Profile updated successfully', data: profile });
    }

    const profile = memoryStore.updateProfile(req.body);
    res.json({ success: true, message: 'Profile updated successfully', data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. STORY & TIMELINE CRUD
// ==========================================
router.get('/story', async (req, res) => {
  try {
    const settings = memoryStore.getStorySettings();
    if (getDBStatus()) {
      let chapters = await Story.find().sort({ order: 1, createdAt: 1 });
      if (!chapters || chapters.length === 0) {
        chapters = memoryStore.getStory();
      }
      return res.json({ success: true, count: chapters.length, settings, data: chapters });
    }

    const chapters = memoryStore.getStory();
    res.json({ success: true, count: chapters.length, settings, data: chapters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/story', async (req, res) => {
  try {
    const { year, when, title, org, bullets, isCurrent, order } = req.body;

    if (!title || !org || !when) {
      return res.status(400).json({
        success: false,
        error: 'Title, organization, and date range are required.',
      });
    }

    const bulletList = Array.isArray(bullets)
      ? bullets
      : typeof bullets === 'string'
      ? bullets.split('\n').map((b) => b.trim()).filter(Boolean)
      : [];

    const storyPayload = {
      year: (year || '2026').toString().trim(),
      when: when.trim(),
      title: title.trim(),
      org: org.trim(),
      bullets: bulletList,
      isCurrent: Boolean(isCurrent),
      order: order !== undefined ? Number(order) : 0,
    };

    if (getDBStatus()) {
      const chapter = await Story.create(storyPayload);
      return res.status(201).json({
        success: true,
        message: 'Story chapter created successfully',
        data: chapter,
      });
    }

    const chapter = memoryStore.addStory(storyPayload);
    res.status(201).json({
      success: true,
      message: 'Story chapter created successfully',
      data: chapter,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/story/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, when, title, org, bullets, isCurrent, order } = req.body;

    const updates = {};
    if (year !== undefined) updates.year = year.toString().trim();
    if (when !== undefined) updates.when = when.trim();
    if (title !== undefined) updates.title = title.trim();
    if (org !== undefined) updates.org = org.trim();
    if (bullets !== undefined) {
      updates.bullets = Array.isArray(bullets)
        ? bullets
        : typeof bullets === 'string'
        ? bullets.split('\n').map((b) => b.trim()).filter(Boolean)
        : [];
    }
    if (isCurrent !== undefined) updates.isCurrent = Boolean(isCurrent);
    if (order !== undefined) updates.order = Number(order);

    if (getDBStatus()) {
      const chapter = await Story.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (chapter) {
        return res.json({
          success: true,
          message: 'Story chapter updated successfully',
          data: chapter,
        });
      }
    }

    const chapter = memoryStore.updateStory(id, updates);
    if (!chapter) {
      return res.status(404).json({ success: false, error: 'Story chapter not found.' });
    }

    res.json({
      success: true,
      message: 'Story chapter updated successfully',
      data: chapter,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/story/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const deleted = await Story.findByIdAndDelete(id);
      if (deleted) {
        return res.json({ success: true, message: 'Story chapter deleted successfully' });
      }
    }

    const removed = memoryStore.deleteStory(id);
    if (!removed) {
      return res.status(404).json({ success: false, error: 'Story chapter not found.' });
    }

    res.json({ success: true, message: 'Story chapter deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/story-settings', (req, res) => {
  try {
    const { eyebrow, heading } = req.body;
    const updates = {};
    if (eyebrow !== undefined) updates.eyebrow = eyebrow.trim();
    if (heading !== undefined) updates.heading = heading.trim();

    const updated = memoryStore.updateStorySettings(updates);
    res.json({
      success: true,
      message: 'Story settings updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
