import React, { useState, useEffect, useRef } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OffcanvasDrawer } from './components/OffcanvasDrawer';
import { QuoteModal } from './components/QuoteModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Phone, ChevronUp } from 'lucide-react';
import { COMPANY_INFO } from './data/siteData';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageTab>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isWhatsAppMenuOpen, setIsWhatsAppMenuOpen] = useState(false);
  const whatsAppMenuRef = useRef<HTMLDivElement>(null);

  // Close WhatsApp popover on click outside or Escape key
  useEffect(() => {
    if (!isWhatsAppMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (whatsAppMenuRef.current && !whatsAppMenuRef.current.contains(e.target as Node)) {
        setIsWhatsAppMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsWhatsAppMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isWhatsAppMenuOpen]);

  // Check auth session
  useEffect(() => {
    let unsubscribe = () => {};

    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const client = getSupabaseClient();
          const { data } = await client.auth.getSession();
          setIsAuthenticated(Boolean(data.session));

          const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(Boolean(session));
          });
          unsubscribe = () => authListener.subscription.unsubscribe();
        } catch (err) {
          console.warn('Auth check error:', err);
        }
      }
      setAuthChecking(false);
    }

    initAuth();
    return () => unsubscribe();
  }, []);

  // Sync pathname and hash routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();

      // Check admin routes first
      if (
        path === '/admin/dashboard' ||
        path.startsWith('/admin/dashboard') ||
        hash === 'admin/dashboard' ||
        hash === 'admin-dashboard'
      ) {
        setCurrentPage('admin-dashboard');
      } else if (
        path === '/admin/login' ||
        path === '/admin' ||
        path.startsWith('/admin/login') ||
        hash === 'admin/login' ||
        hash === 'admin-login' ||
        hash === 'admin'
      ) {
        setCurrentPage('admin-login');
      } else if (hash === 'about') {
        setCurrentPage('about');
      } else if (hash === 'services') {
        setCurrentPage('services');
      } else if (hash === 'contact') {
        setCurrentPage('contact');
      } else {
        setCurrentPage('home');
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: PageTab) => {
    setCurrentPage(page);

    if (page === 'admin-login') {
      try {
        window.history.pushState(null, '', '/admin/login');
      } catch {
        // Fallback for restricted sandboxes
      }
      window.location.hash = 'admin/login';
    } else if (page === 'admin-dashboard') {
      try {
        window.history.pushState(null, '', '/admin/dashboard');
      } catch {
        // Fallback for restricted sandboxes
      }
      window.location.hash = 'admin/dashboard';
    } else if (page === 'home') {
      try {
        window.history.pushState(null, '', '/');
      } catch {}
      window.location.hash = '';
    } else {
      try {
        window.history.pushState(null, '', `/#${page}`);
      } catch {}
      window.location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteWithService = (serviceName: string) => {
    setSelectedServiceForQuote(serviceName);
    setIsQuoteOpen(true);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseClient();
        await client.auth.signOut();
      } catch (err) {
        console.warn('Logout error:', err);
      }
    }
    setIsAuthenticated(false);
    handleNavigate('admin-login');
  };

  // ============================================================
  // ADMIN ROUTES (Dedicated Full-Screen Layout)
  // ============================================================
  if (currentPage === 'admin-login') {
    return (
      <AdminLoginPage
        onNavigate={handleNavigate}
        onLoginSuccess={() => handleNavigate('admin-dashboard')}
      />
    );
  }

  if (currentPage === 'admin-dashboard') {
    // Route Protection: If not logged in and not currently checking, redirect to login
    if (!authChecking && !isAuthenticated) {
      return (
        <AdminLoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={() => handleNavigate('admin-dashboard')}
        />
      );
    }

    return (
      <AdminDashboardPage
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    );
  }

  // ============================================================
  // PUBLIC-FACING WEBSITE (Standard Customer Layout)
  // ============================================================
  return (
    <div className="min-h-screen bg-white text-[#0B1F33] flex flex-col font-sans selection:bg-[#E8B84B] selection:text-[#0B1F33]">
      {/* Top Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenQuoteWithService={handleOpenQuoteWithService}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onSelectService={(service) => {
              setSelectedServiceForQuote(service);
              handleNavigate('contact');
            }}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
            initialService={selectedServiceForQuote}
          />
        )}
      </main>

      {/* Global Navy Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Side Information Drawer */}
      <OffcanvasDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleNavigate}
        onOpenQuote={() => setIsQuoteOpen(true)}
      />

      {/* Instant Proposal Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        defaultService={selectedServiceForQuote}
      />

      {/* Floating Action Buttons */}
      {/* 1. Floating WhatsApp Button & Popover (Fixed Bottom-Left with Gold Ring) */}
      <div ref={whatsAppMenuRef} className="fixed bottom-6 left-6 z-40">
        {/* Popover / Menu directly above */}
        {isWhatsAppMenuOpen && (
          <div
            className="whatsapp-popover-enter absolute bottom-16 left-0 mb-2 w-64 max-w-[calc(100vw-3rem)] rounded-2xl bg-white p-2.5 shadow-2xl border border-slate-200/90 z-50 flex flex-col gap-2"
            role="menu"
            aria-label="Select WhatsApp contact number"
          >
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 pb-0.5 select-none">
              Chat on WhatsApp
            </div>

            {/* Option 1: +44 7830 998699 */}
            <a
              href="https://wa.me/447830998699?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20SK%20Services%20%26%20Solutions%20security%20services."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsWhatsAppMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-[#25D366]/40 shadow-xs hover:shadow transition-all group cursor-pointer text-slate-900"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <svg
                  className="w-4 h-4 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-[#12456B]">
                +44 7830 998699
              </span>
            </a>

            {/* Option 2: +44 7438 327074 */}
            <a
              href="https://wa.me/447438327074?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20SK%20Services%20%26%20Solutions%20security%20services."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsWhatsAppMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-[#25D366]/40 shadow-xs hover:shadow transition-all group cursor-pointer text-slate-900"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <svg
                  className="w-4 h-4 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm tracking-tight group-hover:text-[#12456B]">
                +44 7438 327074
              </span>
            </a>
          </div>
        )}

        {/* WhatsApp Icon Button: same size, same green color, same position, same hover/scale animation */}
        <button
          type="button"
          onClick={() => setIsWhatsAppMenuOpen((prev) => !prev)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl ring-2 ring-[#E8B84B] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Chat with us on WhatsApp"
          aria-expanded={isWhatsAppMenuOpen}
          aria-haspopup="true"
          title="Chat with us on WhatsApp"
        >
          <svg
            className="w-7 h-7 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>

      {/* 2. Floating Actions Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={handleScrollToTop}
            className="w-11 h-11 rounded-full bg-white border border-slate-300 text-[#0B1F33] flex items-center justify-center hover:bg-[#12456B] hover:text-white hover:border-[#12456B] transition-all shadow-md active:scale-95 cursor-pointer"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Quick Call Button */}
        <a
          href={`tel:${COMPANY_INFO.phone}`}
          className="sm:hidden flex items-center justify-center w-14 h-14 rounded-full bg-[#E8B84B] text-[#0B1F33] shadow-xl active:scale-95 transition-all border-2 border-white"
          aria-label="Call SK Services & Solutions Ltd"
        >
          <Phone className="w-6 h-6 text-[#0B1F33]" />
        </a>
      </div>
    </div>
  );
}
