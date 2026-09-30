import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import { ArrowUpRight, Menu, X, LayoutGrid, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';

interface NavbarProps {
  currentPage: PageTab;
  onNavigate: (page: PageTab) => void;
  onOpenQuote: () => void;
  onOpenDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenQuote,
  onOpenDrawer,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; tab: PageTab }[] = [
    { label: 'Home', tab: 'home' },
    { label: 'About', tab: 'about' },
    { label: 'Services', tab: 'services' },
    { label: 'Contact', tab: 'contact' },
  ];

  const handleLinkClick = (tab: PageTab) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* 1. Navy Top Bar with Phone & Socials */}
      <div className="bg-[#0B2A45] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#12456B]/60">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-2 text-zinc-200 hover:text-[#E8B84B] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E8B84B]" />
              <span className="font-semibold">{COMPANY_INFO.phoneDisplay}</span>
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hidden sm:flex items-center gap-2 text-zinc-300 hover:text-[#E8B84B] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E8B84B]" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-zinc-300">
            <span className="hidden md:inline-block text-[11px] text-zinc-400">
              NASDU L2 &amp; BS8517-1 Certified Security
            </span>
            <div className="flex items-center gap-2 ml-2">
              {['Facebook', 'Twitter', 'Youtube', 'Instagram'].map((network) => (
                <a
                  key={network}
                  href="#social"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://facebook.com', '_blank');
                  }}
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-zinc-300 hover:text-[#0B1F33] hover:bg-[#E8B84B] transition-colors font-bold"
                  title={network}
                  aria-label={network}
                >
                  {network[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Solid White Main Navbar */}
      <div
        className={`bg-white transition-all duration-300 ${
          isScrolled
            ? 'shadow-md py-3 border-b border-slate-200'
            : 'shadow-sm py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center text-left focus:outline-none group cursor-pointer"
              aria-label="SK Services & Solutions Ltd Security"
            >
              {/* Desktop: Full Logo, ~56px (h-14) with auto width */}
              <img
                src="/images/sk-logo.svg"
                alt="SK Services & Solutions Ltd Security"
                className="hidden sm:block h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {/* Mobile: Eagle-and-shield emblem only */}
              <img
                src="/images/sk-emblem.svg"
                alt="SK Services & Solutions Ltd Security"
                className="block sm:hidden h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Desktop Navigation Links (Dark Navy text, Gold underline on active) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => {
                const isActive = currentPage === link.tab;
                return (
                  <button
                    key={link.tab}
                    onClick={() => handleLinkClick(link.tab)}
                    className={`px-4 py-2 text-sm lg:text-base font-semibold tracking-wide transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-[#0B1F33]'
                        : 'text-[#4A5A6A] hover:text-[#12456B]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E8B84B] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onOpenQuote}
                className="btn-gold-primary"
              >
                <span>GET STARTED</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDrawer}
                className="p-2.5 rounded-lg text-[#0B1F33] hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer border border-slate-200"
                title="More Info"
                aria-label="Open information panel"
              >
                <LayoutGrid className="w-5 h-5 text-[#12456B]" />
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onOpenDrawer}
                className="p-2 text-[#0B1F33] hover:bg-slate-100 rounded-lg"
                aria-label="Quick contact"
              >
                <LayoutGrid className="w-5 h-5 text-[#12456B]" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#0B1F33] hover:bg-slate-100 rounded-lg focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#12456B]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#0B1F33]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 pb-5 pt-3 border-t border-slate-200 bg-white rounded-2xl shadow-xl p-4 space-y-3">
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = currentPage === link.tab;
                  return (
                    <button
                      key={link.tab}
                      onClick={() => handleLinkClick(link.tab)}
                      className={`text-left px-4 py-3 rounded-lg font-semibold text-base transition-colors ${
                        isActive
                          ? 'bg-amber-50 text-[#0B1F33] border-l-4 border-[#E8B84B]'
                          : 'text-[#4A5A6A] hover:bg-slate-50 hover:text-[#0B1F33]'
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-200 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full btn-gold-primary py-3"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-around pt-2 text-xs text-[#4A5A6A]">
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="flex items-center gap-1.5 hover:text-[#12456B]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E8B84B]" />
                    <span className="font-semibold">{COMPANY_INFO.phoneDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="flex items-center gap-1.5 hover:text-[#12456B]"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#E8B84B]" />
                    <span>Email Us</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
