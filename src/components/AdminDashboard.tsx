/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  LayoutDashboard, 
  Briefcase, 
  PhoneCall, 
  FileText, 
  Download, 
  LogOut, 
  LogIn, 
  ShieldAlert, 
  Search, 
  RefreshCw,
  Database,
  User,
  Clock,
  TrendingUp,
  MapPin,
  Mail,
  Calendar,
  Filter,
  HelpCircle,
  Activity,
  Quote,
  Users,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Application, ConsultLead, Testimonial, Partner, PortfolioItem, CMSData, SportType, TeamMember } from '../types';
import { getCMSData, saveCMSData, getInitialCMSData } from '../lib/cms-store';

export function AdminDashboard({ onBackToMain }: { onBackToMain: () => void }) {
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Core Data
  const [applications, setApplications] = useState<Application[]>([]);
  const [consultations, setConsultations] = useState<ConsultLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // CMS Data
  const [cmsData, setCmsData] = useState<CMSData>(getInitialCMSData());
  const [isCmsSaving, setIsCmsSaving] = useState(false);

  // Nav / Tab filters
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'consultations' | 'testimonials' | 'partners' | 'portfolio' | 'team'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'
  const [sportFilter, setSportFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    type?: 'danger' | 'warning';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Toast Notification State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' = 'danger', confirmText?: string) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type,
      confirmText
    });
  };

  // One-time data wipe as requested by user ("remove all the data currently stored in the admin portal")
  useEffect(() => {
    const isWiped = localStorage.getItem('earthfirm_data_wiped_v2');
    if (!isWiped) {
      localStorage.removeItem('offline_job_applications');
      localStorage.removeItem('offline_floating_consultations');
      localStorage.removeItem('offline_faq_consultations');
      localStorage.removeItem('offline_interactive_consultations');
      localStorage.removeItem('offline_budget_rfps');
      localStorage.setItem('earthfirm_data_wiped_v2', 'true');
      console.log('Admin Portal Data Wiped per request.');
    }
  }, []);

  // Listen to Auth state
  useEffect(() => {
      const isSimLoggedIn = localStorage.getItem('admin_simulated_logged_in') === 'true';
      if (isSimLoggedIn) {
        setUser({ email: 'sportsinfraearthfirm@gmail.com', displayName: 'Administrator' });
      }
  }, []);

  // Fetch data
  const fetchData = async () => {
    setIsRefreshing(true);
    let appList: Application[] = [];
    let consultList: ConsultLead[] = [];

    // Fetch LocalStorage data
    try {
      const cachedApps = JSON.parse(localStorage.getItem('offline_job_applications') || '[]');
      appList = cachedApps;

      const cachedFloating = JSON.parse(localStorage.getItem('offline_floating_consultations') || '[]');
      const cachedFaq = JSON.parse(localStorage.getItem('offline_faq_consultations') || '[]');
      const cachedInteractive = JSON.parse(localStorage.getItem('offline_interactive_consultations') || '[]');
      const cachedBudget = JSON.parse(localStorage.getItem('offline_budget_rfps') || '[]');

      const parseOfflineLead = (item: any, idx: number, source: any): ConsultLead => ({
        id: item.id || `offline-${source}-${idx}`,
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        location: item.location || item.cityName || 'Unknown',
        sportType: item.sportType,
        source: source,
        additionalNotes: item.notes || item.additionalNotes,
        totalCost: item.totalCost || item.projectTotalCost,
        timeline: item.timeline,
        timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
        isOffline: true
      });

      cachedFloating.forEach((item: any, idx: number) => consultList.push(parseOfflineLead(item, idx, 'floating')));
      cachedFaq.forEach((item: any, idx: number) => consultList.push(parseOfflineLead(item, idx, 'faq')));
      cachedInteractive.forEach((item: any, idx: number) => consultList.push(parseOfflineLead(item, idx, 'interactive')));
      cachedBudget.forEach((item: any, idx: number) => consultList.push(parseOfflineLead(item, idx, 'budget')));
    } catch (e) {
      console.error('Error recovering local dashboard cache:', e);
    }

    // Refresh CMS Data
    setCmsData(getInitialCMSData());
    try {
      const res = await fetch('/api/cms');
      const serverCmsData = await res.json();
      if (serverCmsData && typeof serverCmsData === 'object' && !serverCmsData.error) {
        setCmsData(serverCmsData);
        localStorage.setItem('earthfirm_cms_data', JSON.stringify(serverCmsData));
      }
    } catch (err) {
      console.warn("Failed to update CMS data from server API root:", err);
    }

    setApplications(appList);
    setConsultations(consultList);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  // Trigger Fetching when logged in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading && user) {
    return (
      <div className="min-h-screen bg-[#0d100d] flex items-center justify-center font-sans">
        <div className="text-center space-y-6">
          <div className="relative">
            <Loader2 className="h-12 w-12 text-brand-sage animate-spin mx-auto" />
            <div className="absolute inset-0 bg-brand-sage/20 blur-xl rounded-full" />
          </div>
          <div className="space-y-1">
            <p className="text-[#e3e7e3] font-serif text-lg tracking-wide">Synchronizing Operations Hub</p>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">Accessing Local Registry...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle Authenticated Actions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    setAuthError('');
    setIsLoggingIn(true);

    if (emailInput.trim() === 'sportsinfraearthfirm@gmail.com' && passwordInput === 'sportsinfra452015') {
      setUser({ email: 'sportsinfraearthfirm@gmail.com', displayName: 'Administrator' });
      localStorage.setItem('admin_simulated_logged_in', 'true');
    } else {
      setAuthError('Invalid credentials!');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('admin_simulated_logged_in');
  };

  const handleDeleteApplication = async (appId: string) => {
    confirmAction(
      'Purge Candidate Record?',
      'Are you absolutely certain you want to wipe this candidate record? This action is irreversible.',
      () => {
        setApplications(prev => {
          const cleanList = prev.filter(a => String(a.id) !== String(appId));
          localStorage.setItem('offline_job_applications', JSON.stringify(cleanList));
          return cleanList;
        });
      }
    );
  };

  const handleDeleteConsultation = async (consultId: string, source: string) => {
    confirmAction(
      'Wipe Consultation Lead?',
      'Wipe this consultation lead record entirely? All attached project metadata will be lost.',
      () => {
        setConsultations(prev => {
          const cleanList = prev.filter(c => String(c.id) !== String(consultId));
          
          const localOfflineMap: any = {
            interactive: 'offline_interactive_consultations',
            floating: 'offline_floating_consultations',
            faq: 'offline_faq_consultations',
            budget: 'offline_budget_rfps'
          };
          const localStorageKey = localOfflineMap[source];
          if (localStorageKey) {
            const matchingLocalItems = cleanList.filter(c => c.source === source);
            localStorage.setItem(localStorageKey, JSON.stringify(matchingLocalItems));
          }
          return cleanList;
        });
      }
    );
  };

  // --- CMS Management Handlers ---
  const triggerSaveCMS = (newData: CMSData) => {
    setIsCmsSaving(true);
    setCmsData(newData);
    saveCMSData(newData);
    setTimeout(() => setIsCmsSaving(false), 800);
  };

  const handleAddTestimonial = () => {
    const newT: Testimonial = {
      id: Date.now().toString(),
      name: 'New Client',
      role: 'Project Lead',
      content: 'Exemplary service and top-tier construction quality.',
      stars: 5,
      date: new Date().toISOString().split('T')[0]
    };
    triggerSaveCMS({ ...cmsData, testimonials: [newT, ...cmsData.testimonials] });
    showToast('Testimonial record created successfully');
  };

  const handleDeleteTestimonial = (id: string) => {
    confirmAction(
      'Delete Testimonial?',
      'Delete this testimonial permanently? It will be removed from the public website immediately.',
      () => {
        const updated = cmsData.testimonials.filter(t => String(t.id) !== String(id));
        triggerSaveCMS({ ...cmsData, testimonials: updated });
        showToast('Testimonial purged from registry');
      }
    );
  };

  const handleUpdateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    const updated = cmsData.testimonials.map(t => t.id === id ? { ...t, ...updates } : t);
    triggerSaveCMS({ ...cmsData, testimonials: updated });
  };

  const handleAddPartner = () => {
    const newP: Partner = {
      id: Date.now().toString(),
      name: 'Alliance Partner',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'
    };
    triggerSaveCMS({ ...cmsData, partners: [newP, ...cmsData.partners] });
    showToast('New partner entry added');
  };

  const handleDeletePartner = (id: string) => {
    confirmAction(
      'Remove Partner Alliance?',
      'Are you sure you want to remove this partner? The logo will disappear from the infinite marquee.',
      () => {
        const updated = cmsData.partners.filter(p => String(p.id) !== String(id));
        triggerSaveCMS({ ...cmsData, partners: updated });
        showToast('Partner alliance decommissioned');
      }
    );
  };

  const handleUpdatePartner = (id: string, updates: Partial<Partner>) => {
    const updated = cmsData.partners.map(p => p.id === id ? { ...p, ...updates } : p);
    triggerSaveCMS({ ...cmsData, partners: updated });
  };

  const handlePartnerImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleUpdatePartner(id, { logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleTeamMemberImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      handleUpdateTeamMember(id, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddPortfolio = () => {
    const newP: PortfolioItem = {
      id: Date.now().toString(),
      title: 'New Arena Construction',
      location: 'Regional Hub',
      category: 'BASKETBALL',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&q=80&w=800',
      description: 'Integrated sports complex featuring high-performance surfaces.',
      year: new Date().getFullYear().toString()
    };
    triggerSaveCMS({ ...cmsData, portfolio: [newP, ...cmsData.portfolio] });
    showToast('Portfolio project indexed');
  };

  const handleDeletePortfolio = (id: string) => {
    confirmAction(
      'Purge Project Record?',
      'Are you sure you want to purge this project record? This will remove it from the showcase gallery.',
      () => {
        const updated = cmsData.portfolio.filter(p => String(p.id) !== String(id));
        triggerSaveCMS({ ...cmsData, portfolio: updated });
        showToast('Portfolio record permanently purged');
      }
    );
  };

  const handleUpdatePortfolio = (id: string, updates: Partial<PortfolioItem>) => {
    const updated = cmsData.portfolio.map(p => p.id === id ? { ...p, ...updates } : p);
    triggerSaveCMS({ ...cmsData, portfolio: updated });
  };

  const handleAddTeamMember = () => {
    const newM: TeamMember = {
      id: Date.now().toString(),
      name: 'New Team Member',
      role: 'Consultant',
      description: 'Expert in sports infrastructure and client relations.',
      type: 'ENGINEER'
    };
    triggerSaveCMS({ ...cmsData, team: [newM, ...(cmsData.team || [])] });
    showToast('New personnel record active');
  };

  const handleDeleteTeamMember = (id: string) => {
    confirmAction(
      'Decommission Personnel?',
      'Permanently remove this team member from the registry? Their profile will no longer be visible on the About page.',
      () => {
        const updated = (cmsData.team || []).filter(m => String(m.id) !== String(id));
        triggerSaveCMS({ ...cmsData, team: updated });
        showToast('Personnel decommissioned');
      }
    );
  };

  const handleUpdateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    const updated = (cmsData.team || []).map(m => m.id === id ? { ...m, ...updates } : m);
    triggerSaveCMS({ ...cmsData, team: updated });
  };

  // Safe file extraction Base64 to Local Download
  const executeFileDownload = (base64String?: string, fileName?: string) => {
    if (!base64String) {
      alert('This application did not cache a file byteset in the DB or was sent directly via mail server.');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = base64String; // is a base64 encoded dataURL
      link.download = fileName || 'Earthfirm_CV_Application.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download translation stream erred:', e);
      alert('Error recreating document file.');
    }
  };

  // Analytics helper calculations
  const totalLeadsCount = consultations.length;
  const totalAppsCount = applications.length;

  const sportDistributionData = () => {
    const counts: any = {};
    consultations.forEach(c => {
      const sp = c.sportType || 'FAQ/General';
      counts[sp] = (counts[sp] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  };

  const leadSourceDistributionData = () => {
    const interactiveCount = consultations.filter(c => c.source === 'interactive').length;
    const floatingCount = consultations.filter(c => c.source === 'floating').length;
    const faqCount = consultations.filter(c => c.source === 'faq').length;
    const budgetCount = consultations.filter(c => c.source === 'budget').length;

    return [
      { name: 'Customizer RFP', value: interactiveCount, color: '#909D8E' },
      { name: 'Floating Consult', value: floatingCount, color: '#A0B2A6' },
      { name: 'FAQ Questionnaire', value: faqCount, color: '#4D544C' },
      { name: 'Budget Excel Planner', value: budgetCount, color: '#CBCFC9' }
    ].filter(v => v.value > 0);
  };

  const totalConstructValueEstimateInr = consultations.reduce((acc, c) => acc + (c.totalCost || 0), 0);

  // Date filtering helper
  const isWithinRange = (dateStr: string) => {
    if (dateFilter === 'all') return true;
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateFilter === 'today') {
      return date >= today;
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }
    
    if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return date >= monthAgo;
    }
    
    return true;
  };

  // Search filter listings
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    
    const matchesDate = isWithinRange(app.timestamp);
    return matchesSearch && matchesDate;
  });

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.location && c.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesSport = sportFilter === 'All' || c.sportType === sportFilter;
    const matchesSource = sourceFilter === 'All' || c.source === sourceFilter;
    const matchesDate = isWithinRange(c.timestamp);

    return matchesSearch && matchesSport && matchesSource && matchesDate;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111412] text-[#F5F5F3] flex flex-col items-center justify-center p-4 font-sans selection:bg-brand-sage/20 selection:text-white">
        
        {/* Branding banner */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={onBackToMain}>
          <img src="./Logo.png" alt="Earthfirm Sports Infra" className="h-[70px] w-auto object-contain grayscale opacity-95 mix-blend-screen" />
          <div className="text-left">
            <span className="text-brand-sage font-mono text-[9px] uppercase tracking-[0.25em] font-bold block">SOVEREIGN WORKSPACE</span>
            <h1 className="text-white text-base tracking-widest font-serif uppercase font-semibold">Earthfirm Sports</h1>
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-sm bg-[#161a18] rounded-2xl border border-white/5 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-sage" />
          
          <div className="text-center space-y-1">
            <h2 className="text-lg font-serif font-semibold text-white tracking-wide">Administrator Ingress</h2>
            <p className="text-xs text-zinc-500 font-mono">Verify credentials to manage placement applications &amp; leads.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1">
              <label htmlFor="admin-email" className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">Root System Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="admin-email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="sportsinfraearthfirm@gmail.com"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-sage rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition"
                />
                <User className="h-4 w-4 text-zinc-605 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label htmlFor="admin-pass" className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 block">Administrative Token Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="admin-pass"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-black/40 border border-white/5 focus:border-brand-sage rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-700 outline-none transition"
                />
                <ShieldAlert className="h-4 w-4 text-zinc-605 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-xs text-center font-serif leading-relaxed">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-brand-sage hover:bg-brand-sage-dark text-black font-bold uppercase text-[11px] tracking-wider rounded-xl transition flex justify-center items-center gap-2 cursor-pointer shadow-lg hover:shadow-brand-sage/10 disabled:bg-neutral-800 disabled:text-neutral-500"
            >
              {isLoggingIn ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying Sign-In Access Key...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Secure System Authenticate
                </>
              )}
            </button>
          </form>

          {/* Guidelines notes */}
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-[10px] text-zinc-500 leading-normal font-mono">
            <span className="font-bold text-brand-sage block mb-0.5">💡 Central Registry Direct Setup:</span>
            Authenticate using the official email: <span className="text-zinc-300 font-bold">sportsinfraearthfirm@gmail.com</span> and credential <span className="text-zinc-300 font-bold">sportsinfra452015</span>.
          </div>
        </div>

        {/* Back link */}
        <button 
          onClick={onBackToMain}
          className="mt-6 text-zinc-500 hover:text-brand-sage text-xs font-mono tracking-widest uppercase transition-colors"
        >
          ← Exit Secure Node
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d100d] text-[#e3e7e3] font-sans flex flex-col selection:bg-brand-sage/20 selection:text-white">
      {/* Top Admin Header Bar */}
      <header className="bg-[#111412] border-b border-white/5 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 shrink-0">
        
        {/* Branding */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="./Logo.png" alt="Earthfirm Sports" className="h-10 w-auto object-contain grayscale mix-blend-screen opacity-90" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-sm font-serif font-bold uppercase tracking-wider">Earthfirm Operations Hub</h2>
                <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#153e1a] text-[#4ade80] border border-[#22c55e]/20">
                  Secure Local Registry Access
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Operator Registry: {user.email || 'sportsinfraearthfirm@gmail.com'}</p>
            </div>
          </div>

          <AnimatePresence>
            {isCmsSaving && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-sage/10 rounded-full border border-brand-sage/20"
              >
                <RefreshCw className="h-3 w-3 text-brand-sage animate-spin" />
                <span className="text-[9px] font-bold font-mono text-brand-sage uppercase tracking-widest leading-none">CMS Syncing</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            title="Force synchronization"
            className="p-2 border border-white/5 bg-black/40 hover:bg-neutral-900 rounded-lg text-zinc-400 hover:text-brand-sage transition-all relative shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-brand-sage' : ''}`} />
          </button>

          <button
            onClick={onBackToMain}
            className="px-4 py-2 border border-white/10 hover:border-white/20 bg-[#161a18] hover:bg-neutral-900 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors shrink-0 cursor-pointer"
          >
            Client Hub
          </button>

          <button
            onClick={handleLogout}
            className="p-2 border border-[#dc2626]/20 bg-[#2d1111]/30 hover:bg-red-950 text-red-400 rounded-lg hover:text-white transition-all shrink-0 cursor-pointer"
            title="Terminate Sign-In Access"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Admin UI Grid */}
      <div className="flex flex-col lg:flex-row flex-grow relative min-h-0">
        
        {/* Sidebar Nav */}
        <nav className="lg:w-72 bg-[#090b09] border-r border-white/5 py-8 px-5 flex flex-nowrap overflow-x-auto lg:flex-col lg:overflow-y-auto shrink-0 gap-2 lg:gap-1.5 scrollbar-hide">
          <div className="hidden lg:block pb-6 mb-4 border-b border-white/5">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-[0.2em]">Management Terminal</span>
          </div>

          {[
            { id: 'overview', label: 'Operations Dashboard', icon: LayoutDashboard },
            { id: 'applications', label: 'Career board', count: totalAppsCount, icon: Briefcase },
            { id: 'consultations', label: 'Growth Leads', count: totalLeadsCount, icon: PhoneCall },
            { id: 'testimonials', label: 'Testimonials', icon: Quote },
            { id: 'partners', label: 'Our Partners', icon: Users },
            { id: 'team', label: 'Our Team', icon: User },
            { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 lg:flex-grow-0 flex items-center justify-between group px-4 py-3.5 rounded-xl text-[11px] font-bold font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-brand-sage text-black shadow-[0_0_20px_rgba(144,157,142,0.15)] lg:translate-x-1' 
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-black' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${isActive ? 'bg-black/10 text-black' : 'bg-white/5 text-zinc-600 group-hover:text-zinc-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="hidden lg:block mt-auto pt-8 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase tracking-widest">
                <ShieldAlert className="h-3 w-3 text-brand-sage" />
                <span>Security verified</span>
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                Earthfirm Administrative Protocol v2.4 initialized. All actions are logged.
              </p>
            </div>
          </div>
        </nav>

        {/* Content Node Container */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          
          <AnimatePresence mode="wait">
          {/* TAB 1: OPERATIONAL OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {/* Stats highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total leads card */}
                <div className="bg-[#161a18] p-5 rounded-2xl border border-white/5 space-y-2 shadow relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-brand-sage/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-505 text-zinc-400 uppercase tracking-widest font-bold">Arena RFPs &amp; Leads</span>
                    <PhoneCall className="h-4 w-4 text-brand-sage" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-mono text-white font-bold leading-normal">{totalLeadsCount}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Aggregated active site inquires.</p>
                  </div>
                </div>

                {/* Total applications card */}
                <div className="bg-[#161a18] p-5 rounded-2xl border border-white/5 space-y-2 shadow relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-24 h-24 bg-zinc-700/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-505 text-zinc-400 uppercase tracking-widest font-bold">Placement Candidates</span>
                    <Briefcase className="h-4 w-4 text-brand-sage" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-mono text-white font-bold leading-normal">{totalAppsCount}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">Resumes secured via Career board.</p>
                  </div>
                </div>

              </div>

              {/* Data Visuals Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Visual 1: Source channels of consultations */}
                <div className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Lead Acquisition Source Channels</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Submission points distribution for free advisor RFPs.</p>
                  </div>

                  {leadSourceDistributionData().length > 0 ? (
                    <div className="h-64 relative font-mono text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={leadSourceDistributionData()} layout="vertical">
                          <XAxis type="number" stroke="#52525b" fontSize={10} hide />
                          <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={10} width={120} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111412', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#F5F5F3', fontFamily: 'monospace', fontSize: '11px' }}
                            labelStyle={{ display: 'none' }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {leadSourceDistributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 bg-black/10 rounded-xl text-zinc-505 text-zinc-500 font-mono text-xs">
                      <Activity className="h-6 w-6 mb-2 text-zinc-600 animate-pulse" />
                      Pending aggregate lead sources...
                    </div>
                  )}
                </div>

                {/* Visual 2: Requested Court Layouts Distribution */}
                <div className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Demanded Arena Court Configurations</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Demanded sports setups from interactive constructor profiles.</p>
                  </div>

                  {sportDistributionData().length > 0 ? (
                    <div className="h-64 relative font-mono text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sportDistributionData()}>
                          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#52525b" fontSize={10} allowDecimals={false} axisLine={false} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111412', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#F5F5F3', fontFamily: 'monospace', fontSize: '11px' }}
                            labelStyle={{ color: '#909D8E', fontSize: '11px', fontFamily: 'monospace' }}
                          />
                          <Bar dataKey="value" fill="#909D8E" radius={[4, 4, 0, 0]} maxBarSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 bg-black/10 rounded-xl text-zinc-505 text-zinc-500 font-mono text-xs">
                      <HelpCircle className="h-6 w-6 mb-2 text-zinc-600" />
                      No court layout configs attached yet.
                    </div>
                  )}
                </div>

              </div>

              {/* Latest Submissions Logs Activity */}
              <div className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Recent Operational Registries</h3>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Real-time chronos snapshot of inbound career placements and arena quotes.</p>
                  </div>
                  <Clock className="h-4 w-4 text-zinc-500" />
                </div>

                <div className="space-y-2.5">
                  {/* Job Application Alerts */}
                  {applications.slice(0, 3).map(app => (
                    <div key={app.id} className="p-3.5 bg-black/30 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-amber-950/20 text-brand-sage border border-brand-sage/10 font-bold font-mono text-[9px] uppercase tracking-wider shrink-0">
                          CAREER
                        </div>
                        <div>
                          <span className="font-bold text-white">{app.fullName}</span> applied for <strong className="text-amber-400 font-normal">{app.roleTitle}</strong>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(app.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}

                  {/* Consultation Alerts */}
                  {consultations.slice(0, 3).map(c => (
                    <div key={c.id} className="p-3.5 bg-black/30 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-emerald-950/20 text-emerald-400 border border-emerald-900/10 font-bold font-mono text-[9px] uppercase tracking-wider shrink-0">
                          {c.source.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white">{c.fullName}</span> requesting site consult in <strong className="text-emerald-400 font-normal">{c.location}</strong>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{new Date(c.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}

                  {applications.length === 0 && consultations.length === 0 && (
                    <div className="p-10 text-center text-zinc-505 text-zinc-500 font-mono text-xs">
                      Waiting to receive active pipeline records. Submit a career request or consult form to track logs.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: APPLICATIONS BOARD */}
          {activeTab === 'applications' && (
            <motion.div 
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white tracking-wide">Job Placements &amp; Careers board</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Detailed applications, credentials, and resume base64 downloads.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search candidate or job role..."
                      className="w-full bg-[#161a18] border border-white/5 focus:border-brand-sage text-zinc-300 rounded-xl px-4 py-2.5 pl-10 text-xs outline-none transition"
                    />
                    <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3.5 top-3.5" />
                  </div>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#161a18] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer hover:border-white/10 transition"
                  >
                    <option value="all">Everywhere</option>
                    <option value="today">Today</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>

                  {(searchTerm || dateFilter !== 'all') && (
                    <button 
                      onClick={() => { setSearchTerm(''); setDateFilter('all'); }}
                      className="text-[10px] uppercase font-mono font-bold text-zinc-500 hover:text-brand-sage transition-colors px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map(app => (
                  <div key={app.id} className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4 shadow relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Badge detail */}
                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono tracking-widest font-bold text-brand-sage uppercase">Applied Position</span>
                          <h4 className="text-base text-white font-bold leading-tight font-serif">{app.roleTitle}</h4>
                        </div>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${app.isOffline ? 'bg-zinc-800 text-zinc-400' : 'bg-brand-sage/10 text-brand-sage'}`}>
                          {app.isOffline ? 'Offline Sync' : 'Firestore'}
                        </span>
                      </div>

                      {/* Info lines */}
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Candidate Name</span>
                          <span className="text-white font-bold block truncate py-0.5">{app.fullName}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Years of Experience</span>
                          <span className="text-brand-sage font-extrabold block truncate py-0.5">{app.experienceYear} Years</span>
                        </div>
                        <div>
                          <span className="text-zinc-505 text-zinc-500 text-[9px] uppercase tracking-wider block">Inbound Email</span>
                          <a href={`mailto:${app.email}`} className="text-zinc-300 hover:text-brand-sage block truncate py-0.5">{app.email}</a>
                        </div>
                        <div>
                          <span className="text-zinc-505 text-zinc-500 text-[9px] uppercase tracking-wider block">Telecom No.</span>
                          <a href={`tel:${app.phone}`} className="text-zinc-300 hover:text-brand-sage block truncate py-0.5">{app.phone}</a>
                        </div>
                      </div>

                      {/* Cover letter collapsible card */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Cover Letter Pitch Note</span>
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-zinc-350 leading-relaxed font-sans max-h-28 overflow-y-auto">
                          {app.coverLetter || 'No cover letter pitch provided.'}
                        </div>
                      </div>

                      {/* Resume File Item */}
                      {app.resumeFileName ? (
                        <div className="p-3 bg-[#111412]/50 hover:bg-neutral-900 rounded-xl border border-white/5 transition flex items-center justify-between gap-4">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <FileText className="h-4.5 w-4.5 text-brand-sage flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-white text-xs font-semibold truncate" title={app.resumeFileName}>
                                {app.resumeFileName}
                              </p>
                              {app.resumeSize && (
                                <span className="text-zinc-505 text-zinc-500 font-mono text-[9px] uppercase">
                                  Size: {(app.resumeSize / 1024).toFixed(1)} KB
                                </span>
                              )}
                            </div>
                          </div>

                          {app.resumeUrl ? (
                            <button
                              onClick={() => executeFileDownload(app.resumeUrl, app.resumeFileName)}
                              className="p-2 border border-white/5 bg-[#161a18] hover:bg-white hover:text-black rounded-lg transition-all text-zinc-400 shrink-0 cursor-pointer"
                              title="Download Candidate CV"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span className="text-[8px] uppercase tracking-wider text-zinc-600 font-mono font-bold">Bytes in mail</span>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-center text-[10px] text-zinc-600 font-mono uppercase">
                          No Resume Document Uploaded
                        </div>
                      )}
                    </div>

                    {/* Footer Date and Delete */}
                    <div className="flex justify-between items-center gap-4 pt-4 mt-4 border-t border-white/5">
                      <span className="text-zinc-500 text-[10px] font-mono flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(app.timestamp).toLocaleString()}
                      </span>

                      <button 
                        onClick={() => handleDeleteApplication(app.id)}
                        className="px-3.5 py-1.5 border border-red-950 hover:bg-red-950/20 text-red-500 hover:text-red-400 text-[10px] font-bold font-mono tracking-widest uppercase rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Wipe Candidate
                      </button>
                    </div>

                  </div>
                ))}

                {filteredApplications.length === 0 && (
                  <div className="md:col-span-2 p-16 text-center border border-dashed border-white/5 bg-[#161a18] rounded-3xl text-zinc-505 text-zinc-500 font-mono text-xs">
                    <Briefcase className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                     No candidate profiles match the searched parameters.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 3: LEAD CONSTRUCTS */}
          {activeTab === 'consultations' && (
            <motion.div 
              key="consultations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {/* Header and filters */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-white tracking-wide">Arena Construction leads &amp; RFPs</h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Aggregated inquiries on customized play fields, sports systems, and budget estimators.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 w-full lg:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search name, location..."
                      className="w-full bg-[#161a18] border border-white/5 focus:border-brand-sage text-zinc-300 rounded-xl px-4 py-2 pl-9 text-xs outline-none transition"
                    />
                    <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-3" />
                  </div>

                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-[#161a18] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer hover:border-white/10 transition"
                  >
                    <option value="all">Anytime</option>
                    <option value="today">Today</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>

                  <select
                    value={sportFilter}
                    onChange={(e) => setSportFilter(e.target.value)}
                    className="bg-[#161a18] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer hover:border-white/10 transition"
                  >
                    <option value="All">All Sports</option>
                    <option value="BASKETBALL">Basketball</option>
                    <option value="BADMINTON">Badminton</option>
                    <option value="CRICKET">Cricket Arena</option>
                    <option value="TENNIS">ITF Tennis</option>
                    <option value="SQUASH">Squash Arena</option>
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-[#161a18] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none cursor-pointer hover:border-white/10 transition"
                  >
                    <option value="All">All Sources</option>
                    <option value="interactive">Customizer RFP</option>
                    <option value="floating">Floating Quick</option>
                    <option value="faq">FAQ Questionnaire</option>
                    <option value="budget">Budget Excel Planner</option>
                  </select>

                  {(searchTerm || dateFilter !== 'all' || sportFilter !== 'All' || sourceFilter !== 'All') && (
                    <button 
                      onClick={() => { setSearchTerm(''); setDateFilter('all'); setSportFilter('All'); setSourceFilter('All'); }}
                      className="text-[10px] uppercase font-mono font-bold text-zinc-500 hover:text-brand-sage transition-colors px-2"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Consultation leads grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredConsultations.map(c => (
                  <div key={c.id} className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4 shadow relative overflow-hidden flex flex-col justify-between">
                    
                    <div className="space-y-4">
                      {/* Header details */}
                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono tracking-widest font-bold text-emerald-400 uppercase">
                            Source: {c.source.toUpperCase()}
                          </span>
                          <h4 className="text-base text-white font-bold leading-tight font-serif">{c.fullName}</h4>
                        </div>
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-sage/10 text-brand-sage border border-brand-sage/10">
                          Active Lead
                        </span>
                      </div>

                      {/* Dimensions Attached if present */}
                      {c.sportType && (
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider block">Selected Arena Sport</span>
                            <strong className="text-white text-sm font-serif">{c.sportType}</strong>
                          </div>
                          {c.totalCost && (
                            <div className="text-right">
                              <span className="text-zinc-505 text-zinc-500 font-mono text-[9px] uppercase block">Cost Projection</span>
                              <strong className="text-brand-sage font-mono text-base font-bold">₹{c.totalCost.toLocaleString('en-IN')}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fields */}
                      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-zinc-550 text-zinc-500 text-[9px] uppercase tracking-wider block">Project Location</span>
                          <span className="text-white block truncate py-0.5 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                            {c.location}
                          </span>
                        </div>
                        {c.timeline && (
                          <div>
                            <span className="text-zinc-555 text-zinc-505 text-[9px] uppercase tracking-wider block">Mobilization Expected</span>
                            <span className="text-white font-bold block truncate py-0.5">{c.timeline}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-zinc-555 text-zinc-505 text-[9px] uppercase tracking-wider block">Telecom No.</span>
                          {c.phone ? (
                            <a href={`tel:${c.phone}`} className="text-zinc-300 hover:text-brand-sage block truncate py-0.5">{c.phone}</a>
                          ) : (
                            <span className="text-zinc-600 block py-0.5">Not Provided</span>
                          )}
                        </div>
                        <div>
                          <span className="text-zinc-555 text-zinc-505 text-[9px] uppercase tracking-wider block">Client Email</span>
                          <a href={`mailto:${c.email}`} className="text-zinc-300 hover:text-brand-sage block truncate py-0.5">{c.email}</a>
                        </div>
                      </div>

                      {/* Additional briefs / messages */}
                      {c.additionalNotes && (
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Client geological / Design Brief</span>
                          <p className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-zinc-300 leading-relaxed font-sans max-h-24 overflow-y-auto">
                            &quot;{c.additionalNotes}&quot;
                          </p>
                        </div>
                      )}

                      {/* FAQ Answers dictionary representation */}
                      {c.answers && (
                        <div className="space-y-2 font-mono text-xs">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">Wizard Questionnaire Responses</span>
                          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5 max-h-40 overflow-y-auto text-[11px]">
                            {Object.keys(c.answers).map(qKey => (
                              <div key={qKey} className="border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                <span className="text-[#909D8E] font-bold block leading-relaxed">{qKey}:</span>
                                <span className="text-zinc-350 leading-normal">{String(c.answers[qKey])}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer deletion and clock */}
                    <div className="flex justify-between items-center gap-4 pt-4 mt-4 border-t border-white/5">
                      <span className="text-zinc-500 text-[10px] font-mono flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                        {new Date(c.timestamp).toLocaleDateString()} {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>

                      <button 
                        onClick={() => handleDeleteConsultation(c.id, c.source)}
                        className="px-3.5 py-1.5 border border-red-950 hover:bg-red-950/20 text-red-500 hover:text-red-400 text-[10px] font-bold font-mono tracking-widest uppercase rounded-lg transition shrink-0 cursor-pointer"
                      >
                        Wipe Lead
                      </button>
                    </div>

                  </div>
                ))}

                {filteredConsultations.length === 0 && (
                  <div className="md:col-span-2 p-16 text-center border border-dashed border-white/5 bg-[#161a18] rounded-3xl text-zinc-505 text-zinc-500 font-mono text-xs">
                    <PhoneCall className="h-8 w-8 text-zinc-600 mx-auto mb-3 animate-bounce" />
                    No active arena consultations matching current filters.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <Quote className="h-5 w-5 text-brand-sage" />
                    Global Testimonials
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Control client feedback displayed on the public landing page.</p>
                </div>
                <button 
                  onClick={handleAddTestimonial}
                  className="bg-brand-sage hover:bg-brand-sage-light text-black px-4 py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider uppercase flex items-center gap-2 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Append Recommendation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cmsData.testimonials.map(t => (
                  <div key={t.id} className="bg-[#161a18] rounded-2xl border border-white/5 p-5 space-y-4 group hover:border-white/10 transition-all">
                    <div className="flex justify-between gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded-full bg-brand-sage/10 flex items-center justify-center border border-brand-sage/20 overflow-hidden shrink-0">
                          {t.image ? <img src={t.image} alt={t.name} className="h-full w-full object-cover" /> : <User className="h-5 w-5 text-brand-sage" />}
                        </div>
                        <div className="flex-grow">
                          <input 
                            value={t.name}
                            onChange={(e) => handleUpdateTestimonial(t.id, { name: e.target.value })}
                            className="bg-black/20 border border-white/5 text-white font-bold text-sm outline-none w-full focus:ring-1 focus:ring-brand-sage/30 rounded px-2 py-0.5"
                          />
                          <input 
                            value={t.role}
                            onChange={(e) => handleUpdateTestimonial(t.id, { role: e.target.value })}
                            className="bg-black/10 border border-white/5 text-zinc-500 text-[10px] uppercase font-mono outline-none w-full mt-1 focus:ring-1 focus:ring-brand-sage/30 rounded px-2 py-0.5"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteTestimonial(t.id)} 
                        className="bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-900/30 cursor-pointer shadow-lg z-50 relative"
                        title="Purge Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <textarea 
                      value={t.content}
                      onChange={(e) => handleUpdateTestimonial(t.id, { content: e.target.value })}
                      className="w-full bg-black/30 border border-white/5 rounded-xl p-3 text-xs text-zinc-400 font-sans leading-relaxed outline-none focus:border-brand-sage/30 min-h-[100px] resize-none"
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button 
                            key={star}
                            onClick={() => handleUpdateTestimonial(t.id, { stars: star })}
                            className={`p-0.5 transition-colors ${star <= t.stars ? 'text-amber-400' : 'text-zinc-700'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">ID: {t.id}</span>
                    </div>
                  </div>
                ))}
              </div>
              {cmsData.testimonials.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-zinc-500 font-mono text-sm tracking-widest">NO TESTIMONIALS CONFIGURED</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5.5: OUR TEAM */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <User className="h-5 w-5 text-brand-sage" />
                    Personnel Registry
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Manage portraits and profiles for the "Meet our team" section.</p>
                </div>
                <button 
                  onClick={handleAddTeamMember}
                  className="bg-brand-sage hover:bg-brand-sage-light text-black px-4 py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider uppercase flex items-center gap-2 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Enlist Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(cmsData.team || []).map(m => (
                  <div key={m.id} className="bg-[#161a18] rounded-3xl border border-white/5 p-5 space-y-4 group hover:border-white/10 transition-all">
                    <div className="flex gap-5">
                      <div className="w-24 h-24 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden shrink-0 relative group/img">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-zinc-800" />
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                           <ImageIcon className="h-6 w-6 text-white" />
                           <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleTeamMemberImageUpload(m.id, file);
                              }}
                            />
                        </label>
                      </div>

                      <div className="flex-grow space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow space-y-1">
                            <input 
                              value={m.name}
                              onChange={(e) => handleUpdateTeamMember(m.id, { name: e.target.value })}
                              className="w-full bg-black/20 border-none text-white font-bold text-base outline-none focus:ring-1 focus:ring-brand-sage/30 rounded px-2"
                              placeholder="Name"
                            />
                            <input 
                              value={m.role}
                              onChange={(e) => handleUpdateTeamMember(m.id, { role: e.target.value })}
                              className="w-full bg-transparent border-none text-brand-sage text-[10px] uppercase font-mono font-bold outline-none px-2 focus:ring-1 focus:ring-brand-sage/30 rounded"
                              placeholder="Designation"
                            />
                          </div>
                          <button 
                            onClick={() => handleDeleteTeamMember(m.id)} 
                            className="bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-900/30 cursor-pointer shadow-lg ml-2 z-50 relative"
                            title="Decommission Member"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {['FOUNDER', 'ENGINEER', 'ADMIN'].map((type) => (
                            <button
                              key={type}
                              onClick={() => handleUpdateTeamMember(m.id, { type: type as any })}
                              className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold border transition-all ${
                                m.type === type 
                                  ? 'bg-brand-sage/20 text-brand-sage border-brand-sage/30' 
                                  : 'bg-black/20 text-zinc-600 border-white/5 hover:text-zinc-400'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <textarea 
                      value={m.description}
                      onChange={(e) => handleUpdateTeamMember(m.id, { description: e.target.value })}
                      className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed outline-none focus:border-brand-sage/30 h-20 resize-none font-sans"
                      placeholder="Biography/Operations scope..."
                    />

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-600 uppercase block px-1">Portrait Path (URL)</label>
                      <input 
                        value={m.image || ''}
                        onChange={(e) => handleUpdateTeamMember(m.id, { image: e.target.value })}
                        className="w-full bg-black/10 border border-white/5 rounded-lg p-2 text-[9px] text-zinc-600 outline-none focus:border-brand-sage/30 font-mono"
                        placeholder="Leave empty for default icon"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {(cmsData.team || []).length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">REGISTRY EMPTY</p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: PARTNERS */}
          {activeTab === 'partners' && (
            <motion.div
              key="partners"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <Users className="h-5 w-5 text-brand-sage" />
                    Strategic Partners
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Manage the logo carousel of infrastructure and supply chain partners.</p>
                </div>
                <button 
                  onClick={handleAddPartner}
                  className="bg-brand-sage hover:bg-brand-sage-light text-black px-4 py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider uppercase flex items-center gap-2 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Initiate Alliance
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {cmsData.partners.map(p => (
                  <div key={p.id} className="bg-[#161a18] rounded-2xl border border-white/5 p-4 space-y-4 group hover:border-white/10 transition-all text-center">
                    <div className="aspect-video rounded-xl bg-black/40 flex items-center justify-center p-4 relative overflow-hidden border border-white/5 group">
                      <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain transition-all duration-500" />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4 shadow-2xl">
                        <label className="w-full bg-brand-sage hover:bg-brand-sage-light text-black py-2 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 text-[10px] font-bold font-mono shadow-lg border border-white/10">
                          <ImageIcon className="h-3.5 w-3.5" />
                          REPLACE LOGO
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePartnerImageUpload(p.id, file);
                            }}
                          />
                        </label>
                        <button 
                          onClick={() => handleDeletePartner(p.id)} 
                          className="w-full bg-red-500/80 hover:bg-red-500 text-white py-2 rounded-xl transition-all shadow-lg border border-red-400/20 flex items-center justify-center gap-2 text-[10px] font-bold font-mono"
                          title="Remove Partner"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          PURGE ENTRY
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-zinc-600 uppercase block tracking-widest">Entity Designation</label>
                      <input 
                        value={p.name}
                        onChange={(e) => handleUpdatePartner(p.id, { name: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 text-white text-center font-mono font-bold text-[10px] uppercase outline-none focus:border-brand-sage/40 rounded-xl py-2 px-3 transition-all"
                        placeholder="Partner Name"
                      />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[8px] font-mono text-zinc-600 block text-left px-1 uppercase mb-1">Source URL</label>
                       <input 
                        value={p.logo}
                        onChange={(e) => handleUpdatePartner(p.id, { logo: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 rounded-lg p-1.5 text-[9px] text-zinc-500 outline-none focus:border-brand-sage/30 font-mono"
                        placeholder="Logo URL"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-brand-sage" />
                    Arena Portfolio
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">Showcase completed high-performance infrastructure projects.</p>
                </div>
                <button 
                  onClick={handleAddPortfolio}
                  className="bg-brand-sage hover:bg-brand-sage-light text-black px-4 py-2 rounded-xl text-[11px] font-bold font-mono tracking-wider uppercase flex items-center gap-2 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Register Development
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cmsData.portfolio.map(p => (
                  <div key={p.id} className="bg-[#161a18] rounded-3xl border border-white/5 overflow-hidden group hover:border-white/10 transition-all flex flex-col md:flex-row">
                    <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative shrink-0">
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] font-mono font-extrabold text-brand-sage tracking-tighter uppercase">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex-grow p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow space-y-1">
                          <input 
                            value={p.title}
                            onChange={(e) => handleUpdatePortfolio(p.id, { title: e.target.value })}
                            className="w-full bg-black/20 border-none text-white font-serif font-bold text-base outline-none focus:ring-1 focus:ring-brand-sage/30 rounded px-2"
                            placeholder="Project Title"
                          />
                          <div className="flex items-center gap-3 mt-2 px-2">
                            <input 
                              value={p.location}
                              onChange={(e) => handleUpdatePortfolio(p.id, { location: e.target.value })}
                              className="bg-transparent border-none text-zinc-500 text-[10px] uppercase font-mono outline-none focus:ring-1 focus:ring-brand-sage/30 rounded"
                              placeholder="Location"
                            />
                            <span className="text-zinc-800">|</span>
                            <input 
                              value={p.year}
                              onChange={(e) => handleUpdatePortfolio(p.id, { year: e.target.value })}
                              className="bg-transparent border-none text-zinc-500 text-[10px] uppercase font-mono outline-none w-16 focus:ring-1 focus:ring-brand-sage/30 rounded"
                              placeholder="Year"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeletePortfolio(p.id)} 
                          className="bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all border border-red-900/30 cursor-pointer shadow-lg ml-auto z-50 relative"
                          title="Purge Project Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <textarea 
                        value={p.description}
                        onChange={(e) => handleUpdatePortfolio(p.id, { description: e.target.value })}
                        className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed outline-none focus:border-brand-sage/30 h-20 resize-none font-sans"
                        placeholder="Project description..."
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase block px-1">Img URL</label>
                          <input 
                            value={p.image}
                            onChange={(e) => handleUpdatePortfolio(p.id, { image: e.target.value })}
                            className="w-full bg-black/10 border border-white/5 rounded-lg p-2 text-[9px] text-zinc-600 outline-none focus:border-brand-sage/30 font-mono"
                          />
                        </div>
                         <div className="space-y-1 text-left">
                          <label className="text-[9px] font-mono text-zinc-600 uppercase block px-1">Class</label>
                          <select 
                            value={p.category}
                            onChange={(e) => handleUpdatePortfolio(p.id, { category: e.target.value as SportType })}
                            className="w-full bg-black/10 border border-white/5 rounded-lg p-2 text-[9px] text-zinc-500 font-bold outline-none focus:border-brand-sage/30 font-mono"
                          >
                            <option value="BASKETBALL">Basketball</option>
                            <option value="TENNIS">Tennis</option>
                            <option value="SWIMMING_POOL">Pool</option>
                            <option value="FOOTBALL">Football</option>
                            <option value="CRICKET">Cricket</option>
                            <option value="GYM">Gym</option>
                            <option value="BADMINTON">Badminton</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          </AnimatePresence>
        </main>

        <AnimatePresence>
          {confirmModal.isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-[#161a18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
              >
                <div className={`h-1.5 w-full ${confirmModal.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
                <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="p-8 space-y-6">
                  <div className="space-y-2 text-left">
                    <h3 className="text-xl font-serif font-bold text-white tracking-tight">{confirmModal.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-sans">{confirmModal.message}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                      className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmModal.onConfirm}
                      className={`flex-1 px-4 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg ${
                        confirmModal.type === 'danger' 
                          ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/10' 
                          : 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/10'
                      }`}
                    >
                      {confirmModal.confirmText || 'Confirm'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast.show && (
            <motion.div 
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 20, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-[200] flex items-center gap-3 px-6 py-4 bg-[#161a18] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md"
            >
              <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </div>
              <span className="text-white text-xs font-mono font-bold tracking-tight uppercase">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
