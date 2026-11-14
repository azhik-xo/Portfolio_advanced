'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getApiUrl } from '../../lib/api';
import {
  LayoutDashboard,
  Briefcase,
  Dumbbell,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  ShieldCheck,
  Lock,
  User,
  ArrowUpRight,
  TrendingUp,
  History,
  Clock,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export default function AdminDashboard() {
  // Auth state
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [dbHealth, setDbHealth] = useState({ online: true, mongodb: 'checking' });

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, lifts, story, messages, settings
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Data states
  const [stats, setStats] = useState({ counts: { projects: 0, lifts: 0, messages: 0, story: 0 }, recentMessages: [] });
  const [projects, setProjects] = useState([]);
  const [lifts, setLifts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [story, setStory] = useState([]);
  const [storySettings, setStorySettings] = useState({ eyebrow: 'My story', heading: "Let's go back in time." });
  const [profile, setProfile] = useState({});

  // Filter & Search states
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [liftFilter, setLiftFilter] = useState('all');
  const [liftSearch, setLiftSearch] = useState('');
  const [storySearch, setStorySearch] = useState('');

  // Modal states
  const [projectModal, setProjectModal] = useState({ open: false, mode: 'create', data: null });
  const [liftModal, setLiftModal] = useState({ open: false, mode: 'create', data: null });
  const [storyModal, setStoryModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: '', title: '' });

  // Drag and drop ordering states
  const [draggedStoryIdx, setDraggedStoryIdx] = useState(null);
  const [dragOverStoryIdx, setDragOverStoryIdx] = useState(null);
  const [isReorderingStory, setIsReorderingStory] = useState(false);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check backend health & MongoDB connection status
  const checkHealth = async () => {
    try {
      const res = await fetch(getApiUrl('/api/health'));
      if (res.ok) {
        const json = await res.json();
        setDbHealth({
          online: json.status === 'online',
          mongodb: json.mongodb || 'connected',
        });
      }
    } catch (e) {
      setDbHealth({ online: false, mongodb: 'unreachable' });
    }
  };

  // Check existing token and backend health on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ashik_admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setAuthChecked(true);
    checkHealth();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (token) {
      fetchStats();
      fetchProjects();
      fetchLifts();
      fetchStory();
      fetchMessages();
      fetchProfile();
      checkHealth();
    }
  }, [token]);

  // Auth fetch helper
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };
    try {
      const apiUrl = getApiUrl(url);
      const res = await fetch(apiUrl, { ...options, headers });
      if (res.status === 401) {
        handleLogout();
        showToast('Session expired. Please log in again.', 'error');
        return null;
      }
      return await res.json();
    } catch (err) {
      showToast(err.message || 'Network request failed', 'error');
      return null;
    }
  };

  // Auth handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const apiUrl = getApiUrl('/api/auth/login');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('ashik_admin_token', data.token);
        setToken(data.token);
        showToast('Welcome back, Ashik! Logged in successfully.');
        checkHealth();
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setLoginError('Could not reach backend API server. If Render backend was asleep, please wait a few seconds and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ashik_admin_token');
    setToken(null);
    setLoginPassword('');
    showToast('Logged out successfully.');
  };

  // Data fetching functions
  const fetchStats = async () => {
    const data = await authFetch('/api/admin/stats');
    if (data?.success) setStats(data.data);
  };

  const fetchProjects = async () => {
    const data = await authFetch('/api/admin/projects');
    if (data?.success) setProjects(data.data || []);
  };

  const fetchLifts = async () => {
    const data = await authFetch('/api/admin/lifts');
    if (data?.success) setLifts(data.data || []);
  };

  const fetchStory = async () => {
    const data = await authFetch('/api/admin/story');
    if (data?.success) {
      setStory(data.data || []);
      if (data.settings) setStorySettings(data.settings);
    }
  };

  const fetchMessages = async () => {
    const data = await authFetch('/api/admin/messages');
    if (data?.success) setMessages(data.data || []);
  };

  const fetchProfile = async () => {
    const data = await authFetch('/api/admin/profile');
    if (data?.success) setProfile(data.data || {});
  };

  // Filtered views
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCat = projectFilter === 'all' || p.category === projectFilter;
      const matchesSearch =
        projectSearch === '' ||
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [projects, projectFilter, projectSearch]);

  const filteredLifts = useMemo(() => {
    return lifts.filter((l) => {
      const matchesCat =
        liftFilter === 'all' ||
        (liftFilter === 'video' ? l.mediaType === 'video' : l.category === liftFilter);
      const matchesSearch =
        liftSearch === '' ||
        l.title.toLowerCase().includes(liftSearch.toLowerCase()) ||
        l.subtitle?.toLowerCase().includes(liftSearch.toLowerCase()) ||
        l.badge?.toLowerCase().includes(liftSearch.toLowerCase()) ||
        l.stats?.discipline?.toLowerCase().includes(liftSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [lifts, liftFilter, liftSearch]);

  const filteredStory = useMemo(() => {
    return story.filter((s) => {
      if (!storySearch) return true;
      const q = storySearch.toLowerCase();
      return (
        s.title?.toLowerCase().includes(q) ||
        s.org?.toLowerCase().includes(q) ||
        s.when?.toLowerCase().includes(q) ||
        s.year?.toLowerCase().includes(q) ||
        s.bullets?.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [story, storySearch]);

  // Project CRUD handlers
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const payload = {
        title: form.title?.value || '',
        category: form.category?.value || 'web',
        subtitle: form.subtitle?.value || '',
        description: form.description?.value || '',
        tags: form.tags?.value || '',
        liveUrl: form.liveUrl?.value || '',
        githubUrl: form.githubUrl?.value || '',
        mediaUrl: form.mediaUrl?.value || '',
        videoUrl: form.videoUrl?.value || '',
        posterUrl: form.posterUrl?.value || '',
        featured: Boolean(form.featured?.checked),
        order: parseInt(form.order?.value, 10) || 0,
      };

      const isEdit = projectModal.mode === 'edit';
      const url = isEdit ? `/api/admin/projects/${projectModal.data._id}` : '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (res?.success) {
        showToast(isEdit ? 'Project updated successfully!' : 'Project created successfully!');
        setProjectModal({ open: false, mode: 'create', data: null });
        fetchProjects();
        fetchStats();
      } else {
        showToast(res?.error || 'Failed to save project', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving project', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Lift CRUD handlers
  const handleSaveLift = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const payload = {
        title: form.title?.value || '',
        subtitle: form.subtitle?.value || '',
        category: form.category?.value || 'lifts',
        categoryLabel: form.categoryLabel?.value || '',
        mediaType: form.mediaType?.value || 'photo',
        thumbnail: form.thumbnail?.value || '',
        videoSrc: form.videoSrc?.value || '',
        fullPhoto: form.fullPhoto?.value || form.thumbnail?.value || '',
        badge: form.badge?.value || 'PR',
        stats: {
          weight: form.weight?.value || '',
          reps: form.reps?.value || '',
          discipline: form.discipline?.value || '',
          gear: form.gear?.value || '',
          meet: form.meet?.value || '',
          date: form.date?.value || '',
          notes: form.notes?.value || '',
        },
        order: parseInt(form.order?.value, 10) || 0,
      };

      const isEdit = liftModal.mode === 'edit';
      const url = isEdit ? `/api/admin/lifts/${liftModal.data._id}` : '/api/admin/lifts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (res?.success) {
        showToast(isEdit ? 'Lift entry updated!' : 'New lift entry added!');
        setLiftModal({ open: false, mode: 'create', data: null });
        fetchLifts();
        fetchStats();
      } else {
        showToast(res?.error || 'Failed to save lift entry', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving lift entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Story CRUD handlers
  const handleSaveStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const bulletsRaw = form.bullets?.value || '';
      const bulletsArray = bulletsRaw
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean);

      const payload = {
        title: form.title?.value || '',
        org: form.org?.value || '',
        when: form.when?.value || '',
        year: form.year?.value || '2026',
        bullets: bulletsArray,
        isCurrent: Boolean(form.isCurrent?.checked),
        order: parseInt(form.order?.value, 10) || 0,
      };

      const isEdit = storyModal.mode === 'edit';
      const url = isEdit ? `/api/admin/story/${storyModal.data._id}` : '/api/admin/story';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (res?.success) {
        showToast(isEdit ? 'Story milestone updated!' : 'New story milestone added!');
        setStoryModal({ open: false, mode: 'create', data: null });
        fetchStory();
        fetchStats();
      } else {
        showToast(res?.error || 'Failed to save story milestone', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving story milestone', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStorySettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const payload = {
      eyebrow: form.eyebrow.value,
      heading: form.heading.value,
    };

    const res = await authFetch('/api/admin/story-settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res?.success) {
      showToast('Story section title updated live!');
      fetchStory();
    } else {
      showToast(res?.error || 'Failed to update story header', 'error');
    }
  };

  // Story Drag & Drop Ordering
  const handleStoryDragStart = (e, index) => {
    setDraggedStoryIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleStoryDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStoryIdx !== index) {
      setDragOverStoryIdx(index);
    }
  };

  const handleStoryDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedStoryIdx === null || draggedStoryIdx === targetIndex) {
      setDraggedStoryIdx(null);
      setDragOverStoryIdx(null);
      return;
    }

    const reordered = [...story];
    const [draggedItem] = reordered.splice(draggedStoryIdx, 1);
    reordered.splice(targetIndex, 0, draggedItem);

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setStory(updatedWithOrder);
    setDraggedStoryIdx(null);
    setDragOverStoryIdx(null);

    await persistStoryOrder(updatedWithOrder);
  };

  const handleStoryDragEnd = () => {
    setDraggedStoryIdx(null);
    setDragOverStoryIdx(null);
  };

  // Move Story Milestone by Step (Up or Down)
  const handleMoveStoryStep = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= story.length) return;

    const reordered = [...story];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);

    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setStory(updatedWithOrder);
    await persistStoryOrder(updatedWithOrder);
  };

  const persistStoryOrder = async (updatedList) => {
    try {
      setIsReorderingStory(true);
      const res = await authFetch('/api/admin/story/reorder', {
        method: 'PUT',
        body: JSON.stringify({
          items: updatedList.map((s, idx) => ({
            _id: s._id,
            id: s._id,
            order: idx + 1,
          })),
        }),
      });

      if (res?.success) {
        showToast('Timeline order updated and saved live!');
      } else {
        showToast(res?.error || 'Failed to save milestone order', 'error');
        fetchStory();
      }
    } catch (err) {
      showToast('Error syncing order with server', 'error');
      fetchStory();
    } finally {
      setIsReorderingStory(false);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = e.target;
      const payload = {
        name: form.name?.value || profile?.name || 'Ashik',
        title: form.title?.value || profile?.title || '',
        location: form.location?.value || profile?.location || '',
        responseTime: form.responseTime?.value || profile?.responseTime || '',
        availability: form.availability?.value || profile?.availability || '',
        startingBudget: form.startingBudget?.value || profile?.startingBudget || '$500',
        stats: {
          experienceYears: form.experienceYears?.value || profile?.stats?.experienceYears || '4+',
          productionClusters: form.productionClusters?.value || profile?.stats?.productionClusters || '12+',
          uptimeRecord: form.uptimeRecord?.value || profile?.stats?.uptimeRecord || '99.99%',
          bigThreeTotal: form.bigThreeTotal?.value || profile?.stats?.bigThreeTotal || '585 kg',
          deadliftPR: form.deadliftPR?.value || profile?.stats?.deadliftPR || '235 kg',
          squatPR: form.squatPR?.value || profile?.stats?.squatPR || '205 kg',
          benchPR: form.benchPR?.value || profile?.stats?.benchPR || '145 kg',
        },
        socials: {
          github: form.github?.value || profile?.socials?.github || 'https://github.com/azhik-xo',
          linkedin: form.linkedin?.value || profile?.socials?.linkedin || 'https://linkedin.com',
          email: form.email?.value || profile?.socials?.email || 'ashik@gmail.com',
        },
      };

      const res = await authFetch('/api/admin/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res?.success) {
        showToast('Profile and settings updated live in MongoDB!');
        fetchProfile();
      } else {
        showToast(res?.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id } = deleteDialog;
    let url = '';
    if (type === 'project') url = `/api/admin/projects/${id}`;
    if (type === 'lift') url = `/api/admin/lifts/${id}`;
    if (type === 'story') url = `/api/admin/story/${id}`;
    if (type === 'message') url = `/api/admin/messages/${id}`;

    const res = await authFetch(url, { method: 'DELETE' });
    if (res?.success) {
      showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      setDeleteDialog({ open: false, type: '', id: '', title: '' });
      if (type === 'project') fetchProjects();
      if (type === 'lift') fetchLifts();
      if (type === 'story') fetchStory();
      if (type === 'message') fetchMessages();
      fetchStats();
    } else {
      showToast(res?.error || 'Delete failed', 'error');
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#070606] flex items-center justify-center text-[#E8E4E0]">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D6B26E]" />
      </div>
    );
  }

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#070606] text-[#E8E4E0] flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Ambient subtle backlight */}
        <div className="absolute w-[500px] h-[500px] bg-[#D6B26E]/10 rounded-full blur-[140px] pointer-events-none -top-24 -left-24" />
        <div className="absolute w-[450px] h-[450px] bg-[#8B5CF6]/5 rounded-full blur-[120px] pointer-events-none -bottom-24 -right-24" />

        <div className="w-full max-w-md bg-[#121010]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D6B26E]/20 to-[#1F1D1D] border border-[#D6B26E]/30 flex items-center justify-center mb-4 text-[#D6B26E] shadow-lg shadow-[#D6B26E]/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#FAF8F5]">Ashik's Admin Console</h1>
            <p className="text-sm text-[#A8A29E] mt-1.5">Manage portfolio projects, powerlifting media & inquiries</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#FAF8F5] transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#D6B26E] to-[#E5C78A] hover:brightness-105 active:scale-[0.99] text-[#121010] font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-[#D6B26E]/20 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying session...
                </>
              ) : (
                'Access Control Panel'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#78716C]">
            <Link href="/" className="hover:text-[#D6B26E] transition-colors flex items-center gap-1">
              ← Return to live site
            </Link>
            <span>v2.4 · Portfolio Advanced</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-[#070606] text-[#E8E4E0] flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 text-sm backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === 'error'
              ? 'bg-red-500/20 border-red-500/30 text-red-200'
              : 'bg-[#D6B26E]/20 border-[#D6B26E]/40 text-[#FAF8F5]'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#D6B26E]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 bg-[#0F0D0D]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#D6B26E]/20 border border-[#D6B26E]/40 flex items-center justify-center text-[#D6B26E] font-black text-sm">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#FAF8F5] leading-none">Ashik — Portfolio Admin</h1>
            <div className="text-[11px] text-[#A8A29E] mt-1 flex items-center gap-1.5">
              {dbHealth.mongodb === 'connected' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-medium">MongoDB Atlas Connected</span>
                </>
              ) : dbHealth.mongodb.includes('in-memory') ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-300 font-medium" title="Add 0.0.0.0/0 to MongoDB Atlas Network Access so data persists permanently">
                    In-Memory Mode (Atlas IP Whitelist Required)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Checking Backend Status...</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#A8A29E] hover:text-[#FAF8F5] px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
          >
            <span>View Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* MongoDB Atlas Notice Banner if in-memory mode */}
      {dbHealth.mongodb.includes('in-memory') && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <b>Database Notice:</b> The live backend is running in temporary in-memory fallback. To save edits permanently across restarts, open <b>MongoDB Atlas → Network Access → Add IP Address</b> and choose <b>Allow Access from Anywhere (0.0.0.0/0)</b>.
            </span>
          </div>
          <button
            onClick={() => checkHealth()}
            className="ml-4 shrink-0 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded border border-amber-500/30 text-amber-200 transition-colors"
          >
            Re-check Status
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar / Tabs Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#0A0909] p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 md:flex-initial flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span>Projects</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{projects.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('lifts')}
            className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'lifts'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Dumbbell className="w-4 h-4 flex-shrink-0" />
              <span>Powerlifting</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{lifts.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'story'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-4 h-4 flex-shrink-0" />
              <span>My Story</span>
            </div>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{story.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 md:flex-initial flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'messages'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>Inquiries</span>
            </div>
            <span className="text-[10px] bg-[#D6B26E]/20 text-[#D6B26E] px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-initial flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#D6B26E]/15 text-[#D6B26E] border border-[#D6B26E]/30 shadow-sm'
                : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Profile & Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ========================================================== */}
          {/* TAB 1: OVERVIEW                                            */}
          {/* ========================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-[#FAF8F5]">System Overview & Telemetry</h2>
                <p className="text-xs text-[#A8A29E] mt-1">Real-time status across projects, powerlifting media, and inquiries</p>
              </div>

              {/* 5 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-[#D6B26E]/40 transition-all">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-xs font-medium uppercase tracking-wider">Total Projects</span>
                    <Briefcase className="w-4 h-4 text-[#D6B26E]" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#FAF8F5] mt-3">{projects.length}</div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">Across Web, App, UI/UX & DevOps</p>
                </div>

                <div className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-[#D6B26E]/40 transition-all">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-xs font-medium uppercase tracking-wider">Powerlifting Media</span>
                    <Dumbbell className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#FAF8F5] mt-3">{lifts.length}</div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">PRs, poses, competition videos</p>
                </div>

                <div className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-[#D6B26E]/40 transition-all">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-xs font-medium uppercase tracking-wider">Story Chapters</span>
                    <History className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#FAF8F5] mt-3">{story.length}</div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">Interactive career timeline</p>
                </div>

                <div className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-[#D6B26E]/40 transition-all">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-xs font-medium uppercase tracking-wider">Client Inquiries</span>
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#FAF8F5] mt-3">{messages.length}</div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">Submitted via 5-step modal</p>
                </div>

                <div className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-[#D6B26E]/40 transition-all">
                  <div className="flex items-center justify-between text-[#A8A29E]">
                    <span className="text-xs font-medium uppercase tracking-wider">Starting Rate</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-[#FAF8F5] mt-3">{profile?.startingBudget || '$500'}</div>
                  <p className="text-[11px] text-[#78716C] mt-1.5">Minimum client project budget</p>
                </div>
              </div>

              {/* Quick Actions & Recent Messages */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#121010] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#FAF8F5]">Latest Client Inquiries</h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs text-[#D6B26E] hover:underline flex items-center gap-1"
                    >
                      View all ({messages.length}) →
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-[#78716C] text-xs">
                      No client inquiries recorded yet. Form submissions via the contact modal will appear here.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {messages.slice(0, 4).map((msg) => (
                        <div key={msg._id} className="py-3.5 flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#FAF8F5]">{msg.name}</span>
                              <span className="text-[10px] bg-white/10 text-[#D6B26E] px-2 py-0.5 rounded-full font-medium">
                                {msg.service}
                              </span>
                            </div>
                            <p className="text-xs text-[#A8A29E] mt-1 line-clamp-1">{msg.message}</p>
                            <span className="text-[10px] text-[#78716C] mt-1 block">
                              Budget: {msg.budget || 'Flexible'} · {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-xs bg-white/5 hover:bg-white/10 text-[#E8E4E0] px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Add Actions */}
                <div className="bg-[#121010] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#FAF8F5] mb-2">Quick Actions</h3>
                    <p className="text-xs text-[#A8A29E] mb-6">Instantly create or modify dynamic portfolio records</p>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setProjectModal({ open: true, mode: 'create', data: null });
                        }}
                        className="w-full bg-[#1A1818] hover:bg-[#252222] border border-white/10 rounded-xl p-3 text-xs font-semibold text-[#FAF8F5] flex items-center gap-3 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#D6B26E]/20 text-[#D6B26E] flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Add New Project</div>
                          <div className="text-[10px] font-normal text-[#78716C]">Web, App, UI/UX or DevOps</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setLiftModal({ open: true, mode: 'create', data: null });
                        }}
                        className="w-full bg-[#1A1818] hover:bg-[#252222] border border-white/10 rounded-xl p-3 text-xs font-semibold text-[#FAF8F5] flex items-center gap-3 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Dumbbell className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Post PR / Lift Video</div>
                          <div className="text-[10px] font-normal text-[#78716C]">Upload lift telemetry & media</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setStoryModal({ open: true, mode: 'create', data: null });
                        }}
                        className="w-full bg-[#1A1818] hover:bg-[#252222] border border-white/10 rounded-xl p-3 text-xs font-semibold text-[#FAF8F5] flex items-center gap-3 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Add Story Milestone</div>
                          <div className="text-[10px] font-normal text-[#78716C]">Career history & rolling year</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 text-[11px] text-[#78716C]">
                    All modifications sync dynamically with MongoDB Atlas and the live frontend.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: PROJECTS MANAGEMENT                                 */}
          {/* ========================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#FAF8F5]">Portfolio Projects ({filteredProjects.length})</h2>
                  <p className="text-xs text-[#A8A29E] mt-1">Manage project cards across all 4 developer disciplines</p>
                </div>
                <button
                  onClick={() => setProjectModal({ open: true, mode: 'create', data: null })}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#D6B26E]/20 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121010] p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['all', 'web', 'app', 'uiux', 'devops'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProjectFilter(cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        projectFilter === cat
                          ? 'bg-[#D6B26E] text-[#121010]'
                          : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
                      }`}
                    >
                      {cat === 'all'
                        ? 'All Projects'
                        : cat === 'uiux'
                        ? 'UI/UX Design'
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full sm:w-64 bg-[#1A1818] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                  />
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p._id}
                    className="bg-[#121010] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            p.category === 'web'
                              ? 'bg-blue-500/20 text-blue-400'
                              : p.category === 'app'
                              ? 'bg-purple-500/20 text-purple-400'
                              : p.category === 'uiux'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {p.category}
                        </span>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setProjectModal({ open: true, mode: 'edit', data: p })}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-[#A8A29E] hover:text-[#FAF8F5] transition-colors"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: 'project',
                                id: p._id,
                                title: p.title,
                              })
                            }
                            className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[#FAF8F5] line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-[#D6B26E] mt-0.5 line-clamp-1">{p.subtitle}</p>
                      <p className="text-xs text-[#A8A29E] mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.tags?.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-white/5 text-[#A8A29E] px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>

                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#A8A29E] hover:text-[#D6B26E] flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{p.liveUrl}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3: POWERLIFTING MANAGEMENT                             */}
          {/* ========================================================== */}
          {activeTab === 'lifts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#FAF8F5]">Powerlifting Room Items ({filteredLifts.length})</h2>
                  <p className="text-xs text-[#A8A29E] mt-1">Manage gym PRs, body posing shots, meet records & videos</p>
                </div>
                <button
                  onClick={() => setLiftModal({ open: true, mode: 'create', data: null })}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#D6B26E]/20 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lift / Media</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121010] p-3 rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'lifts', label: 'Big Lifts (PRs)' },
                    { id: 'physique', label: 'Physique' },
                    { id: 'competitions', label: 'Meets' },
                    { id: 'training', label: 'Training' },
                    { id: 'video', label: '▶ Videos' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setLiftFilter(cat.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        liftFilter === cat.id
                          ? 'bg-[#D6B26E] text-[#121010]'
                          : 'text-[#A8A29E] hover:text-[#FAF8F5] hover:bg-white/5'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={liftSearch}
                    onChange={(e) => setLiftSearch(e.target.value)}
                    placeholder="Search lifts & PRs..."
                    className="w-full sm:w-64 bg-[#1A1818] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                  />
                </div>
              </div>

              {/* Lifts Visual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLifts.map((l) => (
                  <div
                    key={l._id}
                    className="bg-[#121010] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D6B26E]/40 transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-[4/5] bg-black/40 overflow-hidden">
                      <img
                        src={l.thumbnail}
                        alt={l.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#D6B26E] border border-[#D6B26E]/30 px-2 py-0.5 rounded-full">
                          {l.badge || 'PR'}
                        </span>
                        {l.mediaType === 'video' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full">
                            ▶ VIDEO
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-xl p-1 border border-white/10">
                        <button
                          onClick={() => setLiftModal({ open: true, mode: 'edit', data: l })}
                          className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: 'lift',
                              id: l._id,
                              title: l.title,
                            })
                          }
                          className="p-1 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-[#FAF8F5] truncate">{l.title}</h3>
                      <p className="text-xs text-[#A8A29E] truncate mt-0.5">{l.subtitle}</p>

                      <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                        {l.stats?.weight && (
                          <div className="flex justify-between text-[#78716C]">
                            <span>Weight:</span>
                            <span className="font-semibold text-[#D6B26E]">{l.stats.weight}</span>
                          </div>
                        )}
                        {l.stats?.reps && (
                          <div className="flex justify-between text-[#78716C]">
                            <span>Reps:</span>
                            <span className="text-[#FAF8F5]">{l.stats.reps}</span>
                          </div>
                        )}
                        {l.stats?.date && (
                          <div className="flex justify-between text-[#78716C]">
                            <span>Date:</span>
                            <span className="text-[#A8A29E]">{l.stats.date}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 3.5: MY STORY & TIMELINE                               */}
          {/* ========================================================== */}
          {activeTab === 'story' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#FAF8F5]">My Story & Career Timeline ({story.length})</h2>
                  <p className="text-xs text-[#A8A29E] mt-1">
                    Manage the interactive timeline milestones, rolling year odometer, and career history chapters
                  </p>
                </div>
                <button
                  onClick={() => setStoryModal({ open: true, mode: 'create', data: null })}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#D6B26E]/20 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {/* Story Header Settings Banner */}
              <div className="bg-[#121010] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-[#D6B26E]" />
                    <span className="text-xs font-bold text-[#FAF8F5]">Story Section Header Controls</span>
                  </div>
                  <span className="text-[10px] text-[#78716C]">Appears above the rolling timeline on the homepage</span>
                </div>
                <form onSubmit={handleSaveStorySettings} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-semibold text-[#A8A29E] mb-1">Eyebrow Badge</label>
                    <input
                      name="eyebrow"
                      defaultValue={storySettings.eyebrow || 'My story'}
                      placeholder="My story"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-semibold text-[#A8A29E] mb-1">Main Heading</label>
                    <input
                      name="heading"
                      defaultValue={storySettings.heading || "Let's go back in time."}
                      placeholder="Let's go back in time."
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white/10 hover:bg-[#D6B26E] hover:text-[#121010] text-[#FAF8F5] text-xs font-semibold py-2 px-3 rounded-xl transition-all"
                    >
                      Save Heading
                    </button>
                  </div>
                </form>
              </div>

              {/* Search & Stats Bar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#A8A29E]">
                  <div className="flex items-center gap-1.5 font-medium text-[#FAF8F5]">
                    <GripVertical className="w-4 h-4 text-[#D6B26E]" />
                    <span>Drag cards to reorder</span>
                  </div>
                  <span>•</span>
                  <span>{filteredStory.length} milestones</span>
                  {isReorderingStory && (
                    <span className="flex items-center gap-1.5 text-[#D6B26E] text-[11px] font-semibold bg-[#D6B26E]/10 px-2 py-0.5 rounded-full animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Saving order...
                    </span>
                  )}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={storySearch}
                    onChange={(e) => setStorySearch(e.target.value)}
                    placeholder="Search milestones..."
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                  />
                </div>
              </div>

              {/* Milestones Vertical List with Drag & Drop */}
              <div className="space-y-3.5">
                {filteredStory.map((ch, idx) => (
                  <div
                    key={ch._id || idx}
                    draggable={storySearch === ''}
                    onDragStart={(e) => handleStoryDragStart(e, idx)}
                    onDragOver={(e) => handleStoryDragOver(e, idx)}
                    onDrop={(e) => handleStoryDrop(e, idx)}
                    onDragEnd={handleStoryDragEnd}
                    className={`bg-[#121010] border rounded-2xl p-5 transition-all relative group select-none ${
                      draggedStoryIdx === idx
                        ? 'opacity-30 border-dashed border-[#D6B26E] scale-[0.99]'
                        : dragOverStoryIdx === idx
                        ? 'border-[#D6B26E] shadow-xl shadow-[#D6B26E]/20 scale-[1.01] bg-[#181515]'
                        : 'border-white/10 hover:border-[#D6B26E]/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Drag Handle & Step Buttons */}
                        <div className="flex items-center gap-1 self-center sm:self-start pt-1">
                          <div
                            className="cursor-grab active:cursor-grabbing p-1.5 text-[#78716C] hover:text-[#D6B26E] hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-5 h-5 flex-shrink-0" />
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0 || storySearch !== ''}
                              onClick={() => handleMoveStoryStep(idx, -1)}
                              className="p-1 hover:bg-white/10 text-[#78716C] hover:text-[#FAF8F5] disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors"
                              title="Move milestone up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === filteredStory.length - 1 || storySearch !== ''}
                              onClick={() => handleMoveStoryStep(idx, 1)}
                              className="p-1 hover:bg-white/10 text-[#78716C] hover:text-[#FAF8F5] disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors"
                              title="Move milestone down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rolling Year Odometer Badge */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#1F1D1D] to-[#121010] border border-[#D6B26E]/30 flex flex-col items-center justify-center text-center flex-shrink-0 shadow-lg shadow-black/50">
                          <span className="text-[10px] text-[#A8A29E] uppercase tracking-wider font-mono">YEAR</span>
                          <span className="text-base font-extrabold text-[#D6B26E] tracking-tight">{ch.year || '2026'}</span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-[#D6B26E]">
                              {ch.when}
                            </span>
                            {ch.isCurrent && (
                              <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                Current Role (ch--now)
                              </span>
                            )}
                            <span className="text-[10px] bg-white/5 border border-white/10 text-[#A8A29E] px-2 py-0.5 rounded-full">
                              Order: {ch.order ?? idx + 1}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#FAF8F5]">{ch.title}</h3>
                          <p className="text-xs font-medium text-[#A8A29E] mb-3">{ch.org}</p>

                          {/* Bullet points */}
                          {ch.bullets && ch.bullets.length > 0 && (
                            <ul className="space-y-1.5 text-xs text-[#FAF8F5]/80">
                              {ch.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-[#D6B26E] font-bold leading-tight">•</span>
                                  <span className="leading-relaxed">{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-start">
                        <button
                          onClick={() => setStoryModal({ open: true, mode: 'edit', data: ch })}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-[#FAF8F5] text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              type: 'story',
                              id: ch._id,
                              title: `${ch.title} (${ch.when})`,
                            })
                          }
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors"
                          title="Delete Milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStory.length === 0 && (
                  <div className="py-16 text-center text-[#78716C] text-xs bg-[#121010] border border-white/10 rounded-2xl">
                    No timeline milestones found. Click "Add Milestone" to create one.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: CLIENT INQUIRIES & MESSAGES                         */}
          {/* ========================================================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#FAF8F5]">Client Contact Inquiries ({messages.length})</h2>
                  <p className="text-xs text-[#A8A29E] mt-1">Submitted directly via the 5-step modal into MongoDB</p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="bg-white/5 hover:bg-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="bg-[#121010] border border-white/10 rounded-2xl p-16 text-center">
                  <Mail className="w-10 h-10 text-[#78716C] mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-[#FAF8F5]">No inquiries received yet</h3>
                  <p className="text-xs text-[#A8A29E] mt-1">When clients submit requests, they will show up here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className="bg-[#121010] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#D6B26E]/20 text-[#D6B26E] font-bold text-xs flex items-center justify-center">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#FAF8F5]">{m.name}</h3>
                            <a href={`mailto:${m.email}`} className="text-xs text-[#D6B26E] hover:underline">
                              {m.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[#A8A29E]">
                            {m.service}
                          </span>
                          <button
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: 'message',
                                id: m._id,
                                title: `Inquiry from ${m.name}`,
                              })
                            }
                            className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3.5 bg-black/40 rounded-xl text-xs text-[#E8E4E0] whitespace-pre-wrap leading-relaxed">
                        {m.message}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-[#78716C]">
                        <span>Budget: <b className="text-[#A8A29E]">{m.budget || 'Flexible'}</b></span>
                        <span>Timeline: <b className="text-[#A8A29E]">{m.timeline || 'Ready'}</b></span>
                        <span>Client: <b className="text-[#A8A29E]">{m.clientType || 'Direct'}</b></span>
                        <span>Received: {new Date(m.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: PROFILE & SETTINGS                                  */}
          {/* ========================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-[#FAF8F5]">Profile & Telemetry Settings</h2>
                <p className="text-xs text-[#A8A29E] mt-1">
                  Control hero bio, availability status, starting rates, and social links live in MongoDB
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-[#121010] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                      Display Name
                    </label>
                    <input
                      name="name"
                      defaultValue={profile?.name || 'Ashik'}
                      required
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                      Location / Timezone
                    </label>
                    <input
                      name="location"
                      defaultValue={profile?.location || 'Remote, Worldwide'}
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                    Disciplines & Headline
                  </label>
                  <input
                    name="title"
                    defaultValue={
                      profile?.title || 'Web Developer, App Developer, UI/UX Designer, DevOps Engineer, Powerlifter'
                    }
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                      Availability Status
                    </label>
                    <input
                      name="availability"
                      defaultValue={profile?.availability || 'Available for new projects'}
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                      Response Time
                    </label>
                    <input
                      name="responseTime"
                      defaultValue={profile?.responseTime || 'Within 5 hours'}
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[#A8A29E] mb-1.5">
                      Starting Project Rate
                    </label>
                    <input
                      name="startingBudget"
                      defaultValue={profile?.startingBudget || '$500'}
                      className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#D6B26E]"
                    />
                  </div>
                </div>

                {/* Engineering Stats */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#D6B26E] mb-3">
                    Engineering Telemetry
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Years of Experience</span>
                      <input
                        name="experienceYears"
                        defaultValue={profile?.stats?.experienceYears || '4+'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Production Clusters</span>
                      <input
                        name="productionClusters"
                        defaultValue={profile?.stats?.productionClusters || '12+'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Uptime Record</span>
                      <input
                        name="uptimeRecord"
                        defaultValue={profile?.stats?.uptimeRecord || '99.99%'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                {/* PR Stats */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#D6B26E] mb-3">Powerlifting PRs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Big Three Total</span>
                      <input
                        name="bigThreeTotal"
                        defaultValue={profile?.stats?.bigThreeTotal || '585 kg'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Deadlift PR</span>
                      <input
                        name="deadliftPR"
                        defaultValue={profile?.stats?.deadliftPR || '235 kg'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Squat PR</span>
                      <input
                        name="squatPR"
                        defaultValue={profile?.stats?.squatPR || '205 kg'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Bench PR</span>
                      <input
                        name="benchPR"
                        defaultValue={profile?.stats?.benchPR || '145 kg'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#D6B26E] mb-3">Social & Contact Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">Email</span>
                      <input
                        name="email"
                        defaultValue={profile?.socials?.email || 'ashik@gmail.com'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">GitHub URL</span>
                      <input
                        name="github"
                        defaultValue={profile?.socials?.github || 'https://github.com/azhik-xo'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#78716C] uppercase">LinkedIn URL</span>
                      <input
                        name="linkedin"
                        defaultValue={profile?.socials?.linkedin || 'https://linkedin.com'}
                        className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-[#D6B26E]/20"
                  >
                    {loading ? 'Saving...' : 'Save Settings Live'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================== */}
      {/* MODAL: ADD / EDIT PROJECT                                  */}
      {/* ========================================================== */}
      {projectModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121010] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
              className="absolute top-5 right-5 text-[#78716C] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#FAF8F5] mb-1">
              {projectModal.mode === 'create' ? 'Create New Project' : 'Edit Project'}
            </h3>
            <p className="text-xs text-[#A8A29E] mb-6">Manage project card content for the 3D room showcase</p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={projectModal.data?.title || ''}
                    placeholder="e.g. Sundown Studio"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Category / Room</label>
                  <select
                    name="category"
                    defaultValue={projectModal.data?.category || 'web'}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  >
                    <option value="web">Web Development</option>
                    <option value="app">App Development</option>
                    <option value="uiux">UI/UX Design</option>
                    <option value="devops">DevOps Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Subtitle</label>
                <input
                  name="subtitle"
                  required
                  defaultValue={projectModal.data?.subtitle || ''}
                  placeholder="e.g. Studio website · Interactive typography"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={projectModal.data?.description || ''}
                  placeholder="Comprehensive description of architectural decisions, UX and impact..."
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  name="tags"
                  defaultValue={projectModal.data?.tags?.join(', ') || ''}
                  placeholder="Next.js, Tailwind CSS, Motion, WebGL"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Live Website URL</label>
                  <input
                    name="liveUrl"
                    defaultValue={projectModal.data?.liveUrl || ''}
                    placeholder="https://example.com"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">GitHub Repo URL</label>
                  <input
                    name="githubUrl"
                    defaultValue={projectModal.data?.githubUrl || ''}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Video / MP4</label>
                  <input
                    name="videoUrl"
                    defaultValue={projectModal.data?.videoUrl || ''}
                    placeholder="project-2.mp4"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Poster / Screenshot</label>
                  <input
                    name="posterUrl"
                    defaultValue={projectModal.data?.posterUrl || ''}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Display Order</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={projectModal.data?.order || 0}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={Boolean(projectModal.data?.featured)}
                  className="rounded accent-[#D6B26E]"
                />
                <label htmlFor="featured" className="text-xs text-[#FAF8F5]">
                  Feature this project on hero showcase
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setProjectModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs font-semibold text-[#A8A29E] hover:text-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-5 py-2 rounded-xl"
                >
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD / EDIT POWERLIFTING LIFT                        */}
      {/* ========================================================== */}
      {liftModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121010] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setLiftModal({ open: false, mode: 'create', data: null })}
              className="absolute top-5 right-5 text-[#78716C] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#FAF8F5] mb-1">
              {liftModal.mode === 'create' ? 'Post New Lift / Media' : 'Edit Lift Telemetry'}
            </h3>
            <p className="text-xs text-[#A8A29E] mb-6">Manage PR metrics, photos, body posing and lift recordings</p>

            <form onSubmit={handleSaveLift} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={liftModal.data?.title || ''}
                    placeholder="e.g. 235 KG Conventional Deadlift"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={liftModal.data?.category || 'lifts'}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  >
                    <option value="lifts">Big Lifts (PR)</option>
                    <option value="physique">Physique & Posing</option>
                    <option value="competitions">Competitions</option>
                    <option value="training">Training</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Media Type</label>
                  <select
                    name="mediaType"
                    defaultValue={liftModal.data?.mediaType || 'photo'}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  >
                    <option value="photo">Photo / Picture</option>
                    <option value="video">Video Recording (MP4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Badge Text</label>
                  <input
                    name="badge"
                    defaultValue={liftModal.data?.badge || '235 KG · PR'}
                    placeholder="235 KG · PR"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Order</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={liftModal.data?.order || 0}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Subtitle</label>
                <input
                  name="subtitle"
                  defaultValue={liftModal.data?.subtitle || ''}
                  placeholder="All-Time Gym PR · Clean Lockout"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Category Label</label>
                <input
                  name="categoryLabel"
                  defaultValue={liftModal.data?.categoryLabel || ''}
                  placeholder="e.g. Big Lifts (PR)"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">
                    Thumbnail Image URL (Cloudinary or local)
                  </label>
                  <input
                    name="thumbnail"
                    required
                    defaultValue={liftModal.data?.thumbnail || ''}
                    placeholder="https://res.cloudinary.com/...webp"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">
                    Full Photo URL (optional)
                  </label>
                  <input
                    name="fullPhoto"
                    defaultValue={liftModal.data?.fullPhoto || ''}
                    placeholder="https://res.cloudinary.com/...webp"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">
                  Video MP4 Source URL (if mediaType is video)
                </label>
                <input
                  name="videoSrc"
                  defaultValue={liftModal.data?.videoSrc || ''}
                  placeholder="https://res.cloudinary.com/...mp4"
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                />
              </div>

              {/* Telemetry Stats */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#D6B26E] block">
                  Barbell Telemetry & Stats
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Weight</span>
                    <input
                      name="weight"
                      defaultValue={liftModal.data?.stats?.weight || ''}
                      placeholder="235 kg (518 lbs)"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Reps / RPE</span>
                    <input
                      name="reps"
                      defaultValue={liftModal.data?.stats?.reps || ''}
                      placeholder="1 Rep @ RPE 9.5"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Discipline</span>
                    <input
                      name="discipline"
                      defaultValue={liftModal.data?.stats?.discipline || ''}
                      placeholder="Conventional Deadlift"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Gear Used</span>
                    <input
                      name="gear"
                      defaultValue={liftModal.data?.stats?.gear || ''}
                      placeholder="SBD 13mm Belt, A7 Slippers"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Meet / Context</span>
                    <input
                      name="meet"
                      defaultValue={liftModal.data?.stats?.meet || ''}
                      placeholder="State Championship Prep"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Date</span>
                    <input
                      name="date"
                      defaultValue={liftModal.data?.stats?.date || ''}
                      placeholder="October 2026"
                      className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#A8A29E] uppercase block mb-1">Notes & Technique</span>
                  <input
                    name="notes"
                    defaultValue={liftModal.data?.stats?.notes || ''}
                    placeholder="Fast off the floor, tight lats engagement..."
                    className="w-full bg-[#1A1818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setLiftModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs font-semibold text-[#A8A29E] hover:text-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-5 py-2 rounded-xl"
                >
                  {loading ? 'Saving...' : 'Save Lift Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: ADD / EDIT STORY MILESTONE                          */}
      {/* ========================================================== */}
      {storyModal.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121010] border border-white/10 rounded-2xl w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setStoryModal({ open: false, mode: 'create', data: null })}
              className="absolute top-5 right-5 text-[#78716C] hover:text-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#FAF8F5] mb-1">
              {storyModal.mode === 'create' ? 'Add Story Milestone' : 'Edit Story Milestone'}
            </h3>
            <p className="text-xs text-[#A8A29E] mb-6">
              Updates the interactive chronological timeline and year odometer on the homepage
            </p>

            <form onSubmit={handleSaveStory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Role / Milestone Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={storyModal.data?.title || ''}
                    placeholder="e.g. Independent Freelancer"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Organization / Context</label>
                  <input
                    name="org"
                    required
                    defaultValue={storyModal.data?.org || ''}
                    placeholder="e.g. Working for myself, remote-first"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Date Display</label>
                  <input
                    name="when"
                    required
                    defaultValue={storyModal.data?.when || ''}
                    placeholder="e.g. Oct 2026 — Now"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Odometer Year (4 digits)</label>
                  <input
                    name="year"
                    required
                    defaultValue={storyModal.data?.year || '2026'}
                    placeholder="e.g. 2026"
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">Display Order</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={storyModal.data?.order ?? story.length + 1}
                    className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-[#A8A29E] mb-1">
                  Bullet Points (One per line)
                </label>
                <textarea
                  name="bullets"
                  rows={4}
                  defaultValue={Array.isArray(storyModal.data?.bullets) ? storyModal.data.bullets.join('\n') : ''}
                  placeholder="Web applications, iOS apps, and DevOps automation built end to end.&#10;Engineering scalable cloud architectures."
                  className="w-full bg-[#1A1818] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF8F5] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isCurrent"
                  name="isCurrent"
                  defaultChecked={Boolean(storyModal.data?.isCurrent)}
                  className="rounded bg-[#1A1818] border-white/10 text-[#D6B26E] focus:ring-0"
                />
                <label htmlFor="isCurrent" className="text-xs text-[#FAF8F5] font-medium cursor-pointer">
                  Mark as Current Role (adds glowing badge and initial focus)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStoryModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 text-xs font-semibold text-[#A8A29E] hover:text-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D6B26E] hover:brightness-105 text-[#121010] text-xs font-bold px-5 py-2 rounded-xl"
                >
                  {loading ? 'Saving...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: DELETE CONFIRMATION                                 */}
      {/* ========================================================== */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121010] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#FAF8F5]">Confirm Deletion</h3>
            <p className="text-xs text-[#A8A29E] mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <b className="text-[#FAF8F5]">"{deleteDialog.title}"</b>? This action will remove it from MongoDB immediately.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteDialog({ open: false, type: '', id: '', title: '' })}
                className="px-4 py-2 text-xs font-semibold text-[#A8A29E] hover:text-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-lg shadow-red-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

