import React, { useState, useEffect } from 'react';
import { PageTab, LeadItem, ServiceItem, TestimonialItem } from '../types';
import {
  Shield,
  Users,
  Briefcase,
  MessageSquare,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Code,
  Copy,
  Check,
  Star,
  Eye,
  EyeOff,
  X,
  FileText,
} from 'lucide-react';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  fetchLeads,
  updateLeadStatus,
  deleteLead,
  fetchServices,
  saveService,
  deleteService,
  fetchTestimonials,
  saveTestimonial,
  deleteTestimonial,
} from '../lib/supabase';
import { COMPANY_INFO, SERVICE_OPTIONS } from '../data/siteData';

interface AdminDashboardPageProps {
  onNavigate: (page: PageTab) => void;
  onLogout: () => void;
}

type TabType = 'leads' | 'services' | 'testimonials' | 'sql';

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('leads');
  const [userEmail, setUserEmail] = useState<string>('admin');

  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadFilter, setLeadFilter] = useState<'all' | 'new' | 'contacted'>('all');
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  // UI feedback & SQL helper
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const configured = isSupabaseConfigured();

  // Load User Email
  useEffect(() => {
    async function loadUser() {
      if (!isSupabaseConfigured()) return;
      try {
        const client = getSupabaseClient();
        const { data } = await client.auth.getUser();
        if (data.user?.email) {
          setUserEmail(data.user.email);
        }
      } catch (err) {
        console.warn('Could not load user email:', err);
      }
    }
    loadUser();
  }, []);

  // Show Toast
  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Load Leads
  const loadLeadsData = async () => {
    setLeadsLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (err: any) {
      notify(err.message || 'Failed to load leads', 'error');
    } finally {
      setLeadsLoading(false);
    }
  };

  // Load Services
  const loadServicesData = async () => {
    setServicesLoading(true);
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (err: any) {
      notify(err.message || 'Failed to load services', 'error');
    } finally {
      setServicesLoading(false);
    }
  };

  // Load Testimonials
  const loadTestimonialsData = async () => {
    setTestimonialsLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      notify(err.message || 'Failed to load testimonials', 'error');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    loadLeadsData();
    loadServicesData();
    loadTestimonialsData();
  }, []);

  // Handle Mark Contacted / New
  const handleToggleLeadStatus = async (lead: LeadItem) => {
    const nextStatus = lead.status === 'contacted' ? 'new' : 'contacted';
    try {
      await updateLeadStatus(lead.id, nextStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: nextStatus } : l))
      );
      if (selectedLead?.id === lead.id) {
        setSelectedLead({ ...selectedLead, status: nextStatus });
      }
      notify(`Lead marked as ${nextStatus === 'contacted' ? 'Contacted' : 'New'}`);
    } catch (err: any) {
      notify(err.message || 'Failed to update status', 'error');
    }
  };

  // Handle Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
      notify('Enquiry deleted successfully');
    } catch (err: any) {
      notify(err.message || 'Failed to delete lead', 'error');
    }
  };

  // Handle Save Service
  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      notify('Title is required', 'error');
      return;
    }

    try {
      await saveService({
        id: editingService.id,
        title: editingService.title,
        description: editingService.description || '',
        icon: editingService.icon || 'Shield',
        image_url: editingService.image_url || '/images/Security-Guards.webp',
        order: editingService.order ?? services.length + 1,
        is_active: editingService.is_active ?? true,
      });
      await loadServicesData();
      setIsServiceModalOpen(false);
      setEditingService(null);
      notify('Service saved successfully');
    } catch (err: any) {
      notify(err.message || 'Failed to save service', 'error');
    }
  };

  // Handle Delete Service
  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      notify(`Service "${title}" removed`);
    } catch (err: any) {
      notify(err.message || 'Failed to delete service', 'error');
    }
  };

  // Handle Save Testimonial
  const handleSaveTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.author || !editingTestimonial?.quote) {
      notify('Client name and review quote are required', 'error');
      return;
    }

    try {
      await saveTestimonial({
        id: editingTestimonial.id,
        name: editingTestimonial.author,
        quote: editingTestimonial.quote,
        rating: editingTestimonial.rating || 5,
        role: editingTestimonial.role || 'Client',
        image_url: editingTestimonial.image || '/images/Team-4.jpg',
      });
      await loadTestimonialsData();
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      notify('Testimonial saved successfully');
    } catch (err: any) {
      notify(err.message || 'Failed to save testimonial', 'error');
    }
  };

  // Handle Delete Testimonial
  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete review from "${name}"?`)) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      notify(`Review from "${name}" removed`);
    } catch (err: any) {
      notify(err.message || 'Failed to delete testimonial', 'error');
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((item) => {
    const matchesFilter =
      leadFilter === 'all' ? true : item.status === leadFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      item.phone.toLowerCase().includes(leadSearch.toLowerCase()) ||
      item.service_interested.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const sqlSetupCode = `-- ============================================================
-- SK SERVICES & SOLUTIONS LTD - SUPABASE DATABASE SETUP
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_interested TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Shield',
    image_url TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    role TEXT DEFAULT 'Client',
    image_url TEXT DEFAULT '/images/Team-4.jpg',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- LEADS POLICIES
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (true);

-- SERVICES POLICIES
CREATE POLICY "Public can view active services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (true);

-- TESTIMONIALS POLICIES
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSetupCode);
    setSqlCopied(true);
    notify('SQL schema copied to clipboard!');
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#061524] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <header className="bg-[#0B1F33] border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E8B84B] flex items-center justify-center text-[#0B1F33] font-bold shadow-md">
            <Shield className="w-5 h-5 text-[#0B1F33]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                SK Security
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#E8B84B]/20 text-[#E8B84B] font-bold text-[10px] uppercase tracking-wider border border-[#E8B84B]/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Connected to Supabase Backend
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            title="Open Public Site"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E8B84B]" />
            <span className="hidden md:inline">View Live Site</span>
          </button>

          <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

          <div className="hidden lg:flex flex-col items-end text-right">
            <span className="text-xs font-semibold text-white">{userEmail}</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Authenticated
            </span>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#081B2E] border-r border-slate-800/80 p-4 shrink-0 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-visible">
          <nav className="flex flex-row md:flex-col gap-1.5 w-full">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex-1 md:flex-none flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-[#E8B84B] text-[#0B1F33] font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Leads &amp; Enquiries</span>
              </div>
              {newLeadsCount > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === 'leads'
                      ? 'bg-[#0B1F33] text-[#E8B84B]'
                      : 'bg-[#E8B84B] text-[#0B1F33]'
                  }`}
                >
                  {newLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'services'
                  ? 'bg-[#E8B84B] text-[#0B1F33] font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services ({services.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'testimonials'
                  ? 'bg-[#E8B84B] text-[#0B1F33] font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Testimonials ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`flex-1 md:flex-none flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sql'
                  ? 'bg-[#E8B84B] text-[#0B1F33] font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>SQL Schema &amp; Setup</span>
            </button>
          </nav>

          {/* Quick Info Box in Sidebar */}
          <div className="hidden md:block mt-8 p-3.5 rounded-xl bg-[#0B1F33] border border-slate-700/60 text-xs text-slate-400">
            <span className="font-bold text-white block mb-1">Company Contact</span>
            <p className="text-[11px] leading-relaxed mb-2">
              {COMPANY_INFO.phone}
              <br />
              {COMPANY_INFO.email}
            </p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">Online</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ============================================================ */}
          {/* TAB 1: LEADS                                                */}
          {/* ============================================================ */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Top Bar: Title, Search, Filter, Refresh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span>Client Leads &amp; Enquiries</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                      {leads.length} total
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct quotes and contact inquiries captured via public website forms.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadLeadsData}
                    disabled={leadsLoading}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Refresh Leads"
                  >
                    <RefreshCw className={`w-4 h-4 ${leadsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Filters and Search Bar */}
              <div className="p-4 rounded-xl bg-[#0B1F33] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search by name, email, phone, service..."
                    className="w-full pl-9 pr-4 py-2 bg-[#061524] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full md:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
                  <button
                    onClick={() => setLeadFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      leadFilter === 'all'
                        ? 'bg-[#E8B84B] text-[#0B1F33]'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    All ({leads.length})
                  </button>
                  <button
                    onClick={() => setLeadFilter('new')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      leadFilter === 'new'
                        ? 'bg-amber-400 text-[#0B1F33]'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    New ({newLeadsCount})
                  </button>
                  <button
                    onClick={() => setLeadFilter('contacted')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      leadFilter === 'contacted'
                        ? 'bg-emerald-400 text-[#0B1F33]'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    Contacted ({leads.length - newLeadsCount})
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="rounded-xl bg-[#0B1F33] border border-slate-800 overflow-hidden shadow-xl">
                {leadsLoading ? (
                  <div className="py-20 text-center text-slate-400 text-sm">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E8B84B]" />
                    <span>Loading enquiries from Supabase...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 text-sm px-4">
                    <Users className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="font-semibold text-slate-300">No enquiries found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {leadSearch || leadFilter !== 'all'
                        ? 'Try changing your search filters.'
                        : 'When visitors submit the Contact form or Quote modal, submissions will appear here instantly.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#071727] text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Message</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className={`hover:bg-slate-800/40 transition-colors ${
                              lead.status === 'new' ? 'bg-[#E8B84B]/5' : ''
                            }`}
                          >
                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleLeadStatus(lead)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                  lead.status === 'contacted'
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                }`}
                                title="Click to toggle status"
                              >
                                {lead.status === 'contacted' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span>Contacted</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>New Lead</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Name */}
                            <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                              {lead.name}
                            </td>

                            {/* Contact info */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-slate-300 hover:text-[#E8B84B] flex items-center gap-1 transition-colors"
                                >
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{lead.email}</span>
                                </a>
                                {lead.phone && (
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors text-[11px]"
                                  >
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    <span>{lead.phone}</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* Service */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {lead.service_interested}
                              </span>
                            </td>

                            {/* Message Preview */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <p
                                className="truncate text-slate-300 cursor-pointer hover:text-white"
                                onClick={() => setSelectedLead(lead)}
                                title="Click to view full message"
                              >
                                {lead.message || <em className="text-slate-500">No message provided</em>}
                              </p>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                              {new Date(lead.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="View full details"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

          {/* ============================================================ */}
          {/* TAB 2: SERVICES                                             */}
          {/* ============================================================ */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Manage Security Services
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit existing services, add new offerings, or update images &amp; descriptions. Changes reflect immediately on the live website.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingService({
                        id: '',
                        title: '',
                        description: '',
                        icon: 'Shield',
                        image_url: '/images/Security-Guards.webp',
                        order: services.length + 1,
                        is_active: true,
                      });
                      setIsServiceModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                  </button>
                  <button
                    onClick={loadServicesData}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Refresh Services"
                  >
                    <RefreshCw className={`w-4 h-4 ${servicesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Services Grid */}
              {servicesLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E8B84B]" />
                  <span>Loading services from Supabase...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <div
                      key={service.id || index}
                      className="rounded-2xl bg-[#0B1F33] border border-slate-800 overflow-hidden flex flex-col justify-between shadow-lg hover:border-slate-700 transition-all"
                    >
                      <div>
                        {/* Service Image Banner */}
                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/Security-Guards.webp';
                            }}
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-[#E8B84B] uppercase tracking-wider border border-white/10">
                              Order #{service.order ?? index + 1}
                            </span>
                            {service.is_active === false && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-[10px] font-bold text-white uppercase">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Service Content */}
                        <div className="p-5">
                          <h3 className="text-base font-bold text-white mb-2">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-4 bg-[#071727] border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-mono">
                          ID: {service.id}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingService({
                                id: service.id,
                                title: service.title,
                                description: service.description,
                                icon: service.icon || 'Shield',
                                image_url: service.image,
                                order: service.order ?? index + 1,
                                is_active: service.is_active ?? true,
                              });
                              setIsServiceModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id, service.title)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                            title="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: TESTIMONIALS                                         */}
          {/* ============================================================ */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Manage Testimonials &amp; Reviews
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Control the customer testimonials displayed on the homepage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingTestimonial({
                        id: '',
                        author: '',
                        quote: '',
                        rating: 5,
                        role: 'Client',
                        image: '/images/Team-4.jpg',
                      });
                      setIsTestimonialModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                  <button
                    onClick={loadTestimonialsData}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    title="Refresh Testimonials"
                  >
                    <RefreshCw className={`w-4 h-4 ${testimonialsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Testimonials Grid */}
              {testimonialsLoading ? (
                <div className="py-20 text-center text-slate-400 text-sm">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E8B84B]" />
                  <span>Loading testimonials from Supabase...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-[#0B1F33] border border-slate-800 p-6 flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Rating Stars */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-[#E8B84B]">
                            {Array.from({ length: item.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-[#E8B84B] text-[#E8B84B]" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {item.rating || 5}/5
                          </span>
                        </div>

                        {/* Quote */}
                        <p className="text-xs text-slate-300 italic leading-relaxed mb-6">
                          "{item.quote}"
                        </p>
                      </div>

                      {/* Author Info & Actions */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#12456B] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            {item.author
                              .split(' ')
                              .map((p) => p[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <strong className="block text-xs text-white font-bold">
                              {item.author}
                            </strong>
                            <span className="text-[11px] text-slate-400">
                              {item.role || 'Verified Client'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingTestimonial({
                                id: item.id,
                                author: item.author,
                                quote: item.quote,
                                rating: item.rating || 5,
                                role: item.role || 'Client',
                                image: item.image,
                              });
                              setIsTestimonialModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit testimonial"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(item.id, item.author)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                            title="Delete testimonial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: SQL SCHEMA & SETUP GUIDE                             */}
          {/* ============================================================ */}
          {activeTab === 'sql' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Code className="w-6 h-6 text-[#E8B84B]" />
                  <span>Supabase Database Setup &amp; SQL</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Run this SQL in your Supabase project's SQL Editor to create the tables, enable Row Level Security, and seed initial records.
                </p>
              </div>

              {/* Instructions Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#0B1F33] border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#E8B84B] text-[#0B1F33] font-bold text-xs flex items-center justify-center mb-2">
                    1
                  </span>
                  <h4 className="font-bold text-white text-xs mb-1">Open Supabase SQL Editor</h4>
                  <p className="text-[11px] text-slate-400">
                    Go to your Supabase project dashboard and click "SQL Editor" in the left sidebar.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1F33] border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#E8B84B] text-[#0B1F33] font-bold text-xs flex items-center justify-center mb-2">
                    2
                  </span>
                  <h4 className="font-bold text-white text-xs mb-1">Paste &amp; Run SQL</h4>
                  <p className="text-[11px] text-slate-400">
                    Click "Copy SQL Script" below, paste into a New Query, and click "Run".
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#0B1F33] border border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-[#E8B84B] text-[#0B1F33] font-bold text-xs flex items-center justify-center mb-2">
                    3
                  </span>
                  <h4 className="font-bold text-white text-xs mb-1">Create Admin User</h4>
                  <p className="text-[11px] text-slate-400">
                    Under <span className="text-[#E8B84B]">Authentication &rarr; Users</span>, click "Add User" &rarr; "Create User" with your admin email and password.
                  </p>
                </div>
              </div>

              {/* Code Box with Copy Button */}
              <div className="rounded-xl bg-[#040D16] border border-slate-800 overflow-hidden shadow-2xl">
                <div className="px-4 py-3 bg-[#071727] border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">supabase_setup.sql</span>
                  <button
                    onClick={copySqlToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8B84B] text-[#0B1F33] font-bold text-xs uppercase tracking-wider hover:bg-[#d6a539] transition-colors cursor-pointer"
                  >
                    {sqlCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL Script</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] leading-relaxed select-all">
                  {sqlSetupCode}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL: VIEW FULL LEAD DETAILS                                */}
      {/* ============================================================ */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1F33] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B84B] block mb-1">
                  Enquiry Details
                </span>
                <h3 className="text-xl font-bold">{selectedLead.name}</h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#061524] border border-slate-800">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1 font-bold">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-white hover:text-[#E8B84B] break-all font-semibold"
                  >
                    {selectedLead.email}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-[#061524] border border-slate-800">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1 font-bold">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="text-white hover:text-[#E8B84B] font-semibold"
                  >
                    {selectedLead.phone || 'Not provided'}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#061524] border border-slate-800">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1 font-bold">
                    Required Service
                  </span>
                  <span className="text-[#E8B84B] font-semibold">
                    {selectedLead.service_interested}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#061524] border border-slate-800">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1 font-bold">
                    Submission Date
                  </span>
                  <span className="text-slate-300">
                    {new Date(selectedLead.created_at).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#061524] border border-slate-800">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-2 font-bold">
                  Client Message / Site Specifications
                </span>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message || 'No additional message was provided.'}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggleLeadStatus(selectedLead)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedLead.status === 'contacted'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {selectedLead.status === 'contacted'
                  ? 'Mark as New'
                  : 'Mark as Contacted'}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT SERVICE                                    */}
      {/* ============================================================ */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1F33] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h3 className="text-lg font-bold">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g. VIP Close Protection"
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Detailed description of the security service..."
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  value={editingService.image_url || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, image_url: e.target.value })
                  }
                  placeholder="/images/Security-Guards.webp or https://..."
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingService.order ?? 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#E8B84B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Active on Website
                  </label>
                  <select
                    value={editingService.is_active ? 'true' : 'false'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        is_active: e.target.value === 'true',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#E8B84B]"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD / EDIT TESTIMONIAL                                */}
      {/* ============================================================ */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0B1F33] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <h3 className="text-lg font-bold">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client / Reviewer Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.author || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, author: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client Role / Company
                </label>
                <input
                  type="text"
                  value={editingTestimonial.role || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, role: e.target.value })
                  }
                  placeholder="e.g. Site Operations Manager"
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Review Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingTestimonial.quote || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  placeholder="Their feedback on your security service..."
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#E8B84B] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={editingTestimonial.rating || 5}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      rating: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#061524] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#E8B84B]"
                >
                  <option value="5">★★★★★ (5 Stars)</option>
                  <option value="4">★★★★☆ (4 Stars)</option>
                  <option value="3">★★★☆☆ (3 Stars)</option>
                  <option value="2">★★☆☆☆ (2 Stars)</option>
                  <option value="1">★☆☆☆☆ (1 Star)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
