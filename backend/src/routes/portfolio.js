const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { getDBStatus } = require('../config/db');

const DEFAULT_PROFILE = {
  name: 'Ashik',
  title: 'Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter',
  location: 'Remote, Worldwide',
  responseTime: 'Within 5 hours',
  availability: 'Available for new projects',
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
  },
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'ashik@gmail.com',
  },
};

const DEFAULT_PROJECTS = [
  {
    title: 'Multi-Region Kubernetes Cluster',
    category: 'devops',
    subtitle: 'Container Orchestration & High Availability',
    description: 'Automated microservices platform on AWS EKS with Helm, Istio service mesh, horizontal pod autoscaling, and zero-downtime canary rollouts.',
    tags: ['Kubernetes', 'Docker', 'Helm', 'AWS EKS', 'Istio'],
    featured: true,
  },
  {
    title: 'Zero-Touch GitOps CI/CD',
    category: 'devops',
    subtitle: 'GitHub Actions & ArgoCD',
    description: 'Enterprise pipeline featuring automated security audits with Trivy, continuous container scanning, automated testing, and sub-minute deployment speeds.',
    tags: ['GitHub Actions', 'ArgoCD', 'GitOps', 'DevSecOps'],
    featured: true,
  },
  {
    title: 'Declarative Cloud Platform',
    category: 'devops',
    subtitle: 'Terraform Multi-Cloud IaC',
    description: '100% Infrastructure as Code managing multi-region VPC topologies, managed PostgreSQL clusters, and automated cost optimization.',
    tags: ['Terraform', 'AWS', 'Cloudflare', 'Vault'],
    featured: true,
  },
  {
    title: 'The Big Three Strength Framework',
    category: 'powerlifting',
    subtitle: 'Squat, Bench Press, Deadlift',
    description: 'Scientific periodization, progressive overload, intra-abdominal core bracing, and data-driven autoregulation under the barbell.',
    tags: ['Squat', 'Bench Press', 'Deadlift', 'RPE Programming'],
    featured: true,
  },
  {
    title: 'Enterprise Fintech Dashboard',
    category: 'web',
    subtitle: 'Full-stack high-speed trading dashboard',
    description: 'Modern financial analytics, low-latency data streams, and responsive design built for traders and investors.',
    tags: ['Next.js', 'React', 'Node.js', 'Tailwind CSS'],
    featured: true,
  },
  {
    title: 'Mobile Vault & Security App',
    category: 'app',
    subtitle: 'Cross-platform iOS / Android security app',
    description: 'Encrypted offline credential storage, biometric authentication, and smooth fluid animations.',
    tags: ['React Native', 'Swift', 'Biometrics', 'Crypto'],
    featured: true,
  },
];

// GET /api/portfolio/profile
router.get('/profile', (req, res) => {
  res.json({ success: true, data: DEFAULT_PROFILE });
});

// GET /api/portfolio/skills
router.get('/skills', (req, res) => {
  res.json({ success: true, data: DEFAULT_PROFILE.skills });
});

// GET /api/portfolio/projects
router.get('/projects', async (req, res) => {
  try {
    const { category } = req.query;
    if (getDBStatus()) {
      const query = category ? { category } : {};
      const projects = await Project.find(query).sort({ order: 1 });
      if (projects.length > 0) {
        return res.json({ success: true, data: projects });
      }
    }
    const filtered = category
      ? DEFAULT_PROJECTS.filter((p) => p.category === category)
      : DEFAULT_PROJECTS;
    res.json({ success: true, data: filtered });
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
      message: 'Cloudinary assets mapping will be populated upon upload.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
