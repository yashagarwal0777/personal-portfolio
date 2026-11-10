import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { dbService, storageService, isSupabaseConfigured, authService } from '../../lib/supabase';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Heart,
  Share2,
  FileCode,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Upload,
  RefreshCw,
  Eye,
  Key,
} from 'lucide-react';
import './admin.css';

export default function AdminDashboard() {
  const {
    portfolioData,
    socialLinks,
    user,
    logout,
    refetchPortfolioData,
  } = usePortfolio();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);

  // Live state for forms
  const [profileForm, setProfileForm] = useState({ ...portfolioData.profile });
  const [aboutForm, setAboutForm] = useState({ ...portfolioData.about });
  const [socialForm, setSocialForm] = useState({ ...socialLinks });
  const [settingsForm, setSettingsForm] = useState({
    admin_username: 'yash',
    is_published: true,
    active_resume_url: portfolioData.profile.resumeUrl || '/assets/Yash-Agrawal-Resume.pdf',
  });

  // Collections state
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modals for CRUD
  const [activeModal, setActiveModal] = useState(null); // 'project' | 'experience' | 'education' | 'skill' | 'cert' | 'hobby'
  const [editItem, setEditItem] = useState(null);

  // Password change state
  const [passwordState, setPasswordState] = useState({ newPassword: '', confirmPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3200);
  };

  // Sync profileForm when portfolioData loads/updates
  useEffect(() => {
    setProfileForm({ ...portfolioData.profile });
    if (portfolioData.about) setAboutForm({ ...portfolioData.about });
    setSocialForm({ ...socialLinks });
  }, [portfolioData, socialLinks]);

  // Load collection items from Supabase
  const loadCollections = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [proj, exp, edu, sk, crt, hob, msg, stg] = await Promise.all([
        dbService.getProjects(),
        dbService.getExperiences(),
        dbService.getEducation(),
        dbService.getSkills(),
        dbService.getCertifications(),
        dbService.getHobbies(),
        dbService.getContactMessages(),
        dbService.getSettings(),
      ]);

      if (proj) setProjects(proj);
      if (exp) setExperiences(exp);
      if (edu) setEducation(edu);
      if (sk) setSkills(sk);
      if (crt) setCertifications(crt);
      if (hob) setHobbies(hob);
      if (msg) setMessages(msg);
      if (stg) {
        setSettingsForm({
          admin_username: stg.admin_username || 'yash',
          is_published: stg.is_published !== false,
          active_resume_url: stg.active_resume_url || portfolioData.profile.resumeUrl,
        });
      }
    } catch (err) {
      console.warn('Error loading collections from Supabase:', err);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // --- SAVE HANDLERS ---

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await dbService.updateProfile({
          name: profileForm.name,
          role: profileForm.role,
          location: profileForm.location,
          status: profileForm.status,
          bio: profileForm.bio,
          email: profileForm.email,
          phone: profileForm.phone,
          whatsapp: profileForm.whatsapp,
          resume_url: profileForm.resumeUrl,
        });
      }
      await refetchPortfolioData();
      showToast('Profile information saved successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error saving profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await dbService.updateProfile({
          about_lede: aboutForm.lede,
          story_title: aboutForm.storyTitle,
          story: aboutForm.story,
          motto: aboutForm.motto,
          motto_note: aboutForm.mottoNote,
        });
      }
      await refetchPortfolioData();
      showToast('About Me details saved successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error saving about details', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await dbService.updateSettings({
          social_links: socialForm,
        });
        await dbService.updateProfile({
          linkedin: socialForm.linkedin,
          github: socialForm.github.startsWith('http')
            ? socialForm.github
            : `https://github.com/${socialForm.github}`,
        });
      }
      await refetchPortfolioData();
      showToast('Social links saved successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error saving social links', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordState.newPassword) {
      showToast('Please enter a new password', 'error');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (passwordState.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await authService.updatePassword(passwordState.newPassword);
      setPasswordState({ newPassword: '', confirmPassword: '' });
      showToast('Password updated successfully!');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error updating password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Resume file upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Please select a valid PDF file.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      let uploadedUrl = '';
      if (isSupabaseConfigured()) {
        uploadedUrl = await storageService.uploadFile(file, 'resumes');
        await dbService.updateSettings({ active_resume_url: uploadedUrl });
        await dbService.updateProfile({ resume_url: uploadedUrl });
      } else {
        uploadedUrl = `/assets/${file.name}`;
      }

      setSettingsForm((prev) => ({ ...prev, active_resume_url: uploadedUrl }));
      setProfileForm((prev) => ({ ...prev, resumeUrl: uploadedUrl }));
      await refetchPortfolioData();
      showToast('New resume uploaded and set as active!');
    } catch (err) {
      console.error('Resume upload error:', err);
      showToast(err.message || 'Failed to upload resume', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Project CRUD
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const projData = {
        title: editItem.title,
        description: editItem.description,
        rank: editItem.rank || 'S',
        github_url: editItem.github_url || '',
        demo_url: editItem.demo_url || '',
        tags: typeof editItem.tags === 'string' ? editItem.tags.split(',').map((t) => t.trim()).filter(Boolean) : editItem.tags,
        is_featured: editItem.is_featured !== false,
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateProject(editItem.id, projData);
        } else {
          await dbService.addProject(projData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Project saved successfully!');
    } catch (err) {
      showToast(err.message || 'Error saving project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteProject(id);
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      await refetchPortfolioData();
      showToast('Project removed.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Experience CRUD
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const expData = {
        title: editItem.title,
        company: editItem.company,
        location: editItem.location || '',
        period: editItem.period,
        state: editItem.state || 'complete',
        loot: editItem.loot || '',
        bullets: typeof editItem.bullets === 'string' ? editItem.bullets.split('\n').map((b) => b.trim()).filter(Boolean) : editItem.bullets,
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateExperience(editItem.id, expData);
        } else {
          await dbService.addExperience(expData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Experience entry saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteExperience(id);
      }
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      await refetchPortfolioData();
      showToast('Experience deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Education CRUD
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const eduData = {
        degree: editItem.degree,
        school: editItem.school,
        period: editItem.period,
        state: editItem.state || 'complete',
        note: editItem.note || '',
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateEducation(editItem.id, eduData);
        } else {
          await dbService.addEducation(eduData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Education record saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteEducation(id);
      }
      setEducation((prev) => prev.filter((e) => e.id !== id));
      await refetchPortfolioData();
      showToast('Education record deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Skills CRUD
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skData = {
        name: editItem.name,
        proficiency: parseInt(editItem.proficiency || 80, 10),
        category: editItem.category || 'Core Loadout',
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateSkill(editItem.id, skData);
        } else {
          await dbService.addSkill(skData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Skill saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteSkill(id);
      }
      setSkills((prev) => prev.filter((s) => s.id !== id));
      await refetchPortfolioData();
      showToast('Skill deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Certifications CRUD
  const handleSaveCert = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const crtData = {
        title: editItem.title,
        issuer: editItem.issuer,
        kind: editItem.kind || 'Certification',
        description: editItem.description || '',
        credential_url: editItem.credential_url || '',
        icon: editItem.icon || '★',
        tags: typeof editItem.tags === 'string' ? editItem.tags.split(',').map((t) => t.trim()).filter(Boolean) : editItem.tags,
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateCertification(editItem.id, crtData);
        } else {
          await dbService.addCertification(crtData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Certification saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteCertification(id);
      }
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      await refetchPortfolioData();
      showToast('Certification deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Hobbies CRUD
  const handleSaveHobby = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const hobData = {
        name: editItem.name,
        icon: editItem.icon || '⚡',
        description: editItem.description || '',
        display_order: parseInt(editItem.display_order || 0, 10),
      };

      if (isSupabaseConfigured()) {
        if (editItem.id) {
          await dbService.updateHobby(editItem.id, hobData);
        } else {
          await dbService.addHobby(hobData);
        }
      }
      await loadCollections();
      await refetchPortfolioData();
      setActiveModal(null);
      setEditItem(null);
      showToast('Hobby/Interest saved!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHobby = async (id) => {
    if (!window.confirm('Delete this hobby?')) return;
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteHobby(id);
      }
      setHobbies((prev) => prev.filter((h) => h.id !== id));
      await refetchPortfolioData();
      showToast('Hobby deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      if (isSupabaseConfigured()) {
        await dbService.deleteContactMessage(id);
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Message deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Nav Items definition
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Personal Information', icon: <User size={18} /> },
    { id: 'about', label: 'About Me', icon: <FileText size={18} /> },
    { id: 'projects', label: 'Projects', icon: <FileCode size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Sparkles size={18} /> },
    { id: 'certifications', label: 'Certifications', icon: <Award size={18} /> },
    { id: 'hobbies', label: 'Hobbies & Leadership', icon: <Heart size={18} /> },
    { id: 'social', label: 'Social Links', icon: <Share2 size={18} /> },
    { id: 'resume', label: 'Resume Management', icon: <Upload size={18} /> },
    { id: 'contact', label: 'Contact & Messages', icon: <Mail size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-body">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`admin-toast admin-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-logo-icon">Y</div>
          <div>
            <div className="admin-sidebar__title">Admin Panel</div>
            <span className="admin-sidebar__badge">Supabase Backend</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav__item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-btn-logout" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              className="admin-menu-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="admin-topbar__title">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="admin-topbar__actions">
            {isSupabaseConfigured() ? (
              <span className="admin-chip admin-chip--live">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                Supabase Connected
              </span>
            ) : (
              <span className="admin-chip admin-chip--warning">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                Supabase Setup Pending
              </span>
            )}

            <button
              className="admin-btn admin-btn--secondary"
              style={{ padding: '6px 12px', fontSize: 12.5 }}
              onClick={async () => {
                await refetchPortfolioData();
                await loadCollections();
                showToast('Synced latest data!');
              }}
              title="Refresh and sync data from database"
            >
              <RefreshCw size={14} /> Sync
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-external"
            >
              <ExternalLink size={14} /> View Public Site
            </a>
          </div>
        </header>

        {/* Dynamic Content Views */}
        <main className="admin-content">
          {/* ═══════ TAB 1: OVERVIEW ═══════ */}
          {activeTab === 'overview' && (
            <div>
              <div className="admin-grid-3" style={{ marginBottom: 24 }}>
                <div className="admin-card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>Active Projects</span>
                    <FileCode size={20} style={{ color: '#3b82f6' }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: '#fff' }}>
                    {projects.length || portfolioData.experience.projects.length}
                  </div>
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>Displayed on portfolio</div>
                </div>

                <div className="admin-card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>Work & Fest Roles</span>
                    <Briefcase size={20} style={{ color: '#10b981' }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: '#fff' }}>
                    {experiences.length || portfolioData.experience.jobs.length}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>Celebal + RHYTHM Fest + Training</div>
                </div>

                <div className="admin-card" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>Technical Skills</span>
                    <Sparkles size={20} style={{ color: '#f59e0b' }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, color: '#fff' }}>
                    {skills.length || portfolioData.skills.bars.length}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 4 }}>Loadout competencies</div>
                </div>
              </div>

              {/* Status & Quick Action Card */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <div>
                    <h2 className="admin-card__title">Portfolio Status & Identity</h2>
                    <p className="admin-card__desc">Current published details for Yash Agrawal</p>
                  </div>
                  <button className="admin-btn admin-btn--primary" onClick={() => handleTabChange('profile')}>
                    <Edit2 size={14} /> Edit Information
                  </button>
                </div>

                <div className="admin-grid-2">
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: '#fff' }}>{profileForm.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Professional Title</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, color: '#fff' }}>{profileForm.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Contact Email</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{profileForm.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Base Location</div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{profileForm.location}</div>
                  </div>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="admin-card">
                <h2 className="admin-card__title" style={{ marginBottom: 16 }}>Quick Content Management</h2>
                <div className="admin-grid-3">
                  <button className="admin-btn admin-btn--secondary" style={{ justifyContent: 'flex-start', padding: 14 }} onClick={() => handleTabChange('projects')}>
                    <FileCode size={18} style={{ color: '#3b82f6' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Projects</div>
                      <div style={{ fontSize: 11.5, color: 'var(--admin-text-muted)' }}>Manage live portfolio projects</div>
                    </div>
                  </button>

                  <button className="admin-btn admin-btn--secondary" style={{ justifyContent: 'flex-start', padding: 14 }} onClick={() => handleTabChange('experience')}>
                    <Briefcase size={18} style={{ color: '#10b981' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Experience</div>
                      <div style={{ fontSize: 11.5, color: 'var(--admin-text-muted)' }}>Internships & fest leadership</div>
                    </div>
                  </button>

                  <button className="admin-btn admin-btn--secondary" style={{ justifyContent: 'flex-start', padding: 14 }} onClick={() => handleTabChange('resume')}>
                    <Upload size={18} style={{ color: '#ec4899' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700 }}>Resume Management</div>
                      <div style={{ fontSize: 11.5, color: 'var(--admin-text-muted)' }}>Upload and replace PDF</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ TAB 2: PERSONAL INFORMATION ═══════ */}
          {activeTab === 'profile' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Personal & Contact Details</h2>
                  <p className="admin-card__desc">Updates appear on the public hero, cards, and HUD bar.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="admin-grid-2">
                <div className="admin-form-group">
                  <label className="admin-label">Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Professional Role / Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Primary Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Player Status Tag</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Professional Summary / Bio</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════ TAB 3: ABOUT ME ═══════ */}
          {activeTab === 'about' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">About Section Details</h2>
                  <p className="admin-card__desc">Manage your introductory story, journey, and developer motto.</p>
                </div>
              </div>

              <form onSubmit={handleSaveAbout} className="admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Introduction Lede (HTML supported)</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={aboutForm.lede}
                    onChange={(e) => setAboutForm({ ...aboutForm, lede: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Story Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={aboutForm.storyTitle}
                    onChange={(e) => setAboutForm({ ...aboutForm, storyTitle: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Full Story & Journey (HTML supported)</label>
                  <textarea
                    className="admin-textarea"
                    rows={5}
                    value={aboutForm.story}
                    onChange={(e) => setAboutForm({ ...aboutForm, story: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Developer Motto</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={aboutForm.motto}
                    onChange={(e) => setAboutForm({ ...aboutForm, motto: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Motto Supporting Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={aboutForm.mottoNote}
                    onChange={(e) => setAboutForm({ ...aboutForm, mottoNote: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save About Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════ TAB 4: PROJECTS ═══════ */}
          {activeTab === 'projects' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Project Showcase</h2>
                  <p className="admin-card__desc">Add, edit, and reorder projects displayed on the portfolio.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ title: '', description: '', tags: '', rank: 'S', github_url: '', demo_url: '', is_featured: true, display_order: projects.length + 1 });
                    setActiveModal('project');
                  }}
                >
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Title</th>
                      <th>Technologies</th>
                      <th>GitHub URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(projects.length > 0 ? projects : portfolioData.experience.projects).map((proj) => (
                      <tr key={proj.id}>
                        <td>
                          <span className="admin-chip admin-chip--live" style={{ padding: '2px 8px' }}>
                            {proj.rank || 'S'}
                          </span>
                        </td>
                        <td>
                          <strong>{proj.title}</strong>
                          <div style={{ fontSize: 12, color: 'var(--admin-text-muted)', maxWidth: 400, marginTop: 4 }}>
                            {proj.desc || proj.description}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {(proj.tags || []).map((t, idx) => (
                              <span key={idx} style={{ fontSize: 11, background: '#222634', padding: '2px 6px', borderRadius: 4 }}>
                                {typeof t === 'string' ? t : t.label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          {proj.github_url || proj.githubUrl ? (
                            <a href={proj.github_url || proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>
                              View Repo
                            </a>
                          ) : (
                            <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({
                                  ...proj,
                                  description: proj.description || proj.desc,
                                  tags: Array.isArray(proj.tags) ? proj.tags.map((t) => (typeof t === 'string' ? t : t.label)).join(', ') : '',
                                });
                                setActiveModal('project');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteProject(proj.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 5: EXPERIENCE ═══════ */}
          {activeTab === 'experience' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Professional Experience & Fest Roles</h2>
                  <p className="admin-card__desc">Internships, student leadership, and certified trainings.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ title: '', company: '', location: '', period: '', state: 'complete', bullets: '', loot: '', display_order: experiences.length + 1 });
                    setActiveModal('experience');
                  }}
                >
                  <Plus size={16} /> Add Experience
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title & Company</th>
                      <th>Period</th>
                      <th>Location</th>
                      <th>Key Responsibilities</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(experiences.length > 0 ? experiences : portfolioData.experience.jobs).map((exp) => (
                      <tr key={exp.id}>
                        <td>
                          <strong>{exp.title}</strong>
                          <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{exp.company}</div>
                        </td>
                        <td>{exp.period}</td>
                        <td>{exp.location}</td>
                        <td>
                          <ul style={{ paddingLeft: 16, margin: 0, fontSize: 12.5 }}>
                            {(exp.bullets || []).map((b, idx) => (
                              <li key={idx}>{typeof b === 'string' ? b.replace(/<[^>]+>/g, '') : b.text.replace(/<[^>]+>/g, '')}</li>
                            ))}
                          </ul>
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({
                                  ...exp,
                                  bullets: Array.isArray(exp.bullets) ? exp.bullets.map((b) => (typeof b === 'string' ? b : b.text)).join('\n') : '',
                                });
                                setActiveModal('experience');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteExperience(exp.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 6: EDUCATION ═══════ */}
          {activeTab === 'education' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Education History</h2>
                  <p className="admin-card__desc">University degrees and high school education records.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ degree: '', school: '', period: '', state: 'complete', note: '', display_order: education.length + 1 });
                    setActiveModal('education');
                  }}
                >
                  <Plus size={16} /> Add Education
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Degree / Qualification</th>
                      <th>Institution / School</th>
                      <th>Period</th>
                      <th>Notes & Coursework</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(education.length > 0 ? education : portfolioData.education.entries).map((edu) => (
                      <tr key={edu.id}>
                        <td><strong>{edu.degree}</strong></td>
                        <td>{edu.school}</td>
                        <td>{edu.period}</td>
                        <td style={{ fontSize: 12.5, maxWidth: 350 }}>{edu.note}</td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({ ...edu });
                                setActiveModal('education');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteEducation(edu.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 7: SKILLS ═══════ */}
          {activeTab === 'skills' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Skills & Technical Competencies</h2>
                  <p className="admin-card__desc">Manage skill levels and categories displayed on the skills card and modal.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ name: '', proficiency: 85, category: 'Web & Mobile Development', display_order: skills.length + 1 });
                    setActiveModal('skill');
                  }}
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Skill Name</th>
                      <th>Category</th>
                      <th>Proficiency</th>
                      <th>Visual Bar</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(skills.length > 0 ? skills : portfolioData.skills.bars).map((sk) => (
                      <tr key={sk.id}>
                        <td><strong>{sk.name}</strong></td>
                        <td>{sk.category || 'Core'}</td>
                        <td>{sk.proficiency || sk.value}%</td>
                        <td style={{ width: 160 }}>
                          <div style={{ background: '#222634', height: 8, borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{ background: '#3b82f6', width: `${sk.proficiency || sk.value}%`, height: '100%' }} />
                          </div>
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({ ...sk, proficiency: sk.proficiency || sk.value });
                                setActiveModal('skill');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteSkill(sk.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 8: CERTIFICATIONS ═══════ */}
          {activeTab === 'certifications' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Certifications & Achievements</h2>
                  <p className="admin-card__desc">Manage badges, internships, and military/campus representations.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ title: '', issuer: '', kind: 'Certified Training', description: '', icon: '★', tags: '', display_order: certifications.length + 1 });
                    setActiveModal('cert');
                  }}
                >
                  <Plus size={16} /> Add Certification
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Badge</th>
                      <th>Title</th>
                      <th>Issuer</th>
                      <th>Kind</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(certifications.length > 0 ? certifications : portfolioData.certifications.items).map((crt) => (
                      <tr key={crt.id}>
                        <td style={{ fontSize: 20 }}>{crt.icon || '★'}</td>
                        <td><strong>{crt.title}</strong></td>
                        <td>{crt.issuer}</td>
                        <td>{crt.kind}</td>
                        <td style={{ fontSize: 12.5, maxWidth: 350 }}>{crt.description || crt.desc}</td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({
                                  ...crt,
                                  description: crt.description || crt.desc,
                                  tags: Array.isArray(crt.tags) ? crt.tags.map((t) => (typeof t === 'string' ? t : t.label)).join(', ') : '',
                                });
                                setActiveModal('cert');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteCert(crt.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 9: HOBBIES & LEADERSHIP ═══════ */}
          {activeTab === 'hobbies' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Hobbies & Co-Curricular Pursuits</h2>
                  <p className="admin-card__desc">NCC drill leadership, software experiments, and problem solving.</p>
                </div>
                <button
                  className="admin-btn admin-btn--primary"
                  onClick={() => {
                    setEditItem({ name: '', icon: '⚡', description: '', display_order: hobbies.length + 1 });
                    setActiveModal('hobby');
                  }}
                >
                  <Plus size={16} /> Add Hobby
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Name / Title</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(hobbies.length > 0 ? hobbies : portfolioData.hobbies.items).map((hob) => (
                      <tr key={hob.id}>
                        <td style={{ fontSize: 22 }}>{hob.icon || '⚡'}</td>
                        <td><strong>{hob.name}</strong></td>
                        <td style={{ fontSize: 12.5 }}>{hob.description || hob.desc}</td>
                        <td>
                          <div className="admin-action-btns">
                            <button
                              className="admin-btn admin-btn--secondary admin-btn-sm"
                              onClick={() => {
                                setEditItem({ ...hob, description: hob.description || hob.desc });
                                setActiveModal('hobby');
                              }}
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              className="admin-btn admin-btn--danger admin-btn-sm"
                              onClick={() => handleDeleteHobby(hob.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ TAB 10: SOCIAL LINKS ═══════ */}
          {activeTab === 'social' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Social Profiles & Integrations</h2>
                  <p className="admin-card__desc">Wired across footer HUD, hero buttons, and contact modals.</p>
                </div>
              </div>

              <form onSubmit={handleSaveSocial} className="admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={socialForm.linkedin}
                    onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">GitHub Username or Profile URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={socialForm.github}
                    onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>
                    <Save size={16} /> {isSaving ? 'Saving...' : 'Save Social Links'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════ TAB 11: RESUME MANAGEMENT ═══════ */}
          {activeTab === 'resume' && (
            <div className="admin-card">
              <div className="admin-card__header">
                <div>
                  <h2 className="admin-card__title">Resume Management</h2>
                  <p className="admin-card__desc">Upload and replace the downloadable resume on your public portfolio.</p>
                </div>
              </div>

              <div style={{ background: '#222634', padding: 24, borderRadius: 12, marginBottom: 24, border: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--admin-text-muted)', fontWeight: 600 }}>Active Resume File</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 4 }}>
                      {settingsForm.active_resume_url || '/assets/Yash-Agrawal-Resume.pdf'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <a
                      href={settingsForm.active_resume_url || '/assets/Yash-Agrawal-Resume.pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn--secondary"
                    >
                      <Eye size={16} /> Preview Current PDF
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ border: '2px dashed var(--admin-border)', borderRadius: 12, padding: 36, textAlign: 'center' }}>
                <Upload size={36} style={{ color: '#3b82f6', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Upload New PDF Resume</h3>
                <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>
                  Select a new PDF resume to immediately replace the active document on your public website.
                </p>

                <label className="admin-btn admin-btn--primary" style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    style={{ display: 'none' }}
                  />
                  <span>Select &amp; Replace Resume</span>
                </label>
              </div>
            </div>
          )}

          {/* ═══════ TAB 12: CONTACT & MESSAGES ═══════ */}
          {activeTab === 'contact' && (
            <div>
              <div className="admin-card">
                <div className="admin-card__header">
                  <div>
                    <h2 className="admin-card__title">Incoming Contact Inquiries</h2>
                    <p className="admin-card__desc">Messages submitted by visitors through the public portfolio contact form.</p>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--admin-text-muted)' }}>
                    <Mail size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                    <p>No messages received yet. Messages sent via the public contact form will appear here.</p>
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Sender</th>
                          <th>Email</th>
                          <th>Message Content</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr key={msg.id}>
                            <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                              {new Date(msg.created_at).toLocaleDateString()}
                            </td>
                            <td><strong>{msg.name}</strong></td>
                            <td>
                              <a href={`mailto:${msg.email}`} style={{ color: '#60a5fa' }}>{msg.email}</a>
                            </td>
                            <td style={{ fontSize: 13, maxWidth: 400 }}>{msg.message}</td>
                            <td>
                              <button
                                className="admin-btn admin-btn--danger admin-btn-sm"
                                onClick={() => handleDeleteMessage(msg.id)}
                                title="Delete message"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════ TAB 13: SETTINGS ═══════ */}
          {activeTab === 'settings' && (
            <div>
              {/* Password update */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <div>
                    <h2 className="admin-card__title">Administrator Security</h2>
                    <p className="admin-card__desc">Change your password for Supabase Auth and Incognito mode.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">New Password</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="Minimum 6 characters"
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="admin-input"
                      placeholder="Repeat new password"
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group col-span-2" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>
                      <Key size={16} /> {isSaving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Session information */}
              <div className="admin-card">
                <h2 className="admin-card__title" style={{ marginBottom: 16 }}>Authenticated Session Details</h2>
                <div className="admin-grid-2">
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Logged in as</span>
                    <div style={{ fontWeight: 600, color: '#fff', marginTop: 2 }}>
                      {user?.email || 'yash (Administrator)'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Backend Provider</span>
                    <div style={{ fontWeight: 600, color: '#fff', marginTop: 2 }}>
                      {isSupabaseConfigured() ? 'Supabase Auth (Official Free Tier)' : 'Local Fallback'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══════ CRUD MODALS ═══════ */}

      {/* Project Modal */}
      {activeModal === 'project' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Project' : 'Add New Project'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveProject}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Project Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Project Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={editItem.description}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Rank Badge (e.g. S, A)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.rank}
                    onChange={(e) => setEditItem({ ...editItem, rank: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editItem.display_order}
                    onChange={(e) => setEditItem({ ...editItem, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Technologies (comma separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="HTML5, CSS3, JavaScript, Python"
                    value={editItem.tags}
                    onChange={(e) => setEditItem({ ...editItem, tags: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={editItem.github_url}
                    onChange={(e) => setEditItem({ ...editItem, github_url: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={editItem.demo_url}
                    onChange={(e) => setEditItem({ ...editItem, demo_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {activeModal === 'experience' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Experience' : 'Add Experience'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveExperience}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Job Title / Role</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Company / Organization</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.company}
                    onChange={(e) => setEditItem({ ...editItem, company: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Employment Dates / Period</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.period}
                    onChange={(e) => setEditItem({ ...editItem, period: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">State / Type</label>
                  <select
                    className="admin-select"
                    value={editItem.state}
                    onChange={(e) => setEditItem({ ...editItem, state: e.target.value })}
                  >
                    <option value="internship">Internship</option>
                    <option value="leadership">Leadership</option>
                    <option value="complete">Complete</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Responsibilities &amp; Achievements (1 per line)</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={editItem.bullets}
                    onChange={(e) => setEditItem({ ...editItem, bullets: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Loot Summary (Skills Acquired)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.loot}
                    onChange={(e) => setEditItem({ ...editItem, loot: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Experience</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {activeModal === 'education' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Education' : 'Add Education'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveEducation}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Degree or Course</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.degree}
                    onChange={(e) => setEditItem({ ...editItem, degree: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Institution / School</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.school}
                    onChange={(e) => setEditItem({ ...editItem, school: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Period (Dates)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.period}
                    onChange={(e) => setEditItem({ ...editItem, period: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editItem.display_order}
                    onChange={(e) => setEditItem({ ...editItem, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Description / Grades / Coursework</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editItem.note}
                    onChange={(e) => setEditItem({ ...editItem, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Education</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {activeModal === 'skill' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Skill' : 'Add Skill'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveSkill}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Skill Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Proficiency ({editItem.proficiency}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={editItem.proficiency}
                    onChange={(e) => setEditItem({ ...editItem, proficiency: e.target.value })}
                    style={{ marginTop: 8 }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Category</label>
                  <select
                    className="admin-select"
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                  >
                    <option value="Web & Mobile Development">Web &amp; Mobile Development</option>
                    <option value="Programming & Logic">Programming &amp; Logic</option>
                    <option value="Databases & Analytics">Databases &amp; Analytics</option>
                    <option value="Testing, Tooling & Cloud">Testing, Tooling &amp; Cloud</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {activeModal === 'cert' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Certification' : 'Add Certification'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveCert}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Certification / Achievement Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Issuing Organization</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.issuer}
                    onChange={(e) => setEditItem({ ...editItem, issuer: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Icon / Emoji</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.icon}
                    onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editItem.description}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Certification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hobby Modal */}
      {activeModal === 'hobby' && editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editItem.id ? 'Edit Hobby' : 'Add Hobby'}</h3>
              <button className="admin-modal__close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveHobby}>
              <div className="admin-modal__body admin-grid-2">
                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Name / Title</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Icon / Emoji</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editItem.icon}
                    onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Display Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={editItem.display_order}
                    onChange={(e) => setEditItem({ ...editItem, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-form-group col-span-2">
                  <label className="admin-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editItem.description}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={isSaving}>Save Hobby</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
