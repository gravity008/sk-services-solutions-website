import React from 'react';
import { PageTab } from '../types';
import { ArrowRight, Phone, Mail, MapPin, Shield, Lock } from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';

interface FooterProps {
  onNavigate: (page: PageTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (tab: PageTab) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B2A45] text-white pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-[#12456B]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Closing Call-To-Action Band (Navy with White text and Gold Button) */}
        <div className="bg-[#12456B] border border-white/10 rounded-2xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E8B84B] font-bold mb-2 block">
                Partner With Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                LET'S WORK WITH <span className="text-[#E8B84B]">SK SERVICES &amp; SOLUTIONS</span>
              </h2>
              <p className="text-zinc-200 mt-2 max-w-xl text-base leading-relaxed">
                Protect your property, workforce, and valuable assets with our certified NASDU L2 guard dog teams and SIA officers.
              </p>
            </div>
            <button
              onClick={() => handleNav('contact')}
              className="btn-gold-primary shrink-0"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Column 1: Logo & Mission */}
          <div className="space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="block text-left focus:outline-none cursor-pointer"
              aria-label="SK Services & Solutions Ltd Security"
            >
              <img
                src="/images/sk-logo.svg"
                alt="SK Services & Solutions Ltd Security"
                className="h-[72px] w-auto object-contain"
              />
            </button>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Leading static guarding and specialist security services operating nationwide across the UK.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2">
              <Shield className="w-4 h-4 text-[#E8B84B]" />
              <span>NASDU Level 2 &amp; BS8517-1 Compliant</span>
            </div>
          </div>

          {/* Column 2: Our Pages */}
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8B84B]" />
              OUR PAGES
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Home', tab: 'home' as PageTab },
                { label: 'About', tab: 'about' as PageTab },
                { label: 'Services', tab: 'services' as PageTab },
                { label: 'Contact', tab: 'contact' as PageTab },
              ].map((item) => (
                <li key={item.tab}>
                  <button
                    onClick={() => handleNav(item.tab)}
                    className="text-zinc-300 hover:text-[#E8B84B] text-sm transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8B84B]" />
              QUICK LINKS
            </h5>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              {COMPANY_INFO.mission}
            </p>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B]" />
                <span>24/7 Rapid Response K9 Patrols</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B]" />
                <span>SIA Licensed Gatehouse &amp; Static Guards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8B84B]" />
                <span>Fully Insured &amp; In-House Managed</span>
              </div>
            </div>
          </div>

          {/* Column 4: Get In Touch */}
          <div>
            <h5 className="text-base font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8B84B]" />
              GET IN TOUCH
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-start gap-3 text-zinc-200 hover:text-[#E8B84B] group"
                >
                  <Phone className="w-4 h-4 text-[#E8B84B] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{COMPANY_INFO.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-start gap-3 text-zinc-200 hover:text-[#E8B84B] group"
                >
                  <Mail className="w-4 h-4 text-[#E8B84B] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-zinc-300">
                <MapPin className="w-4 h-4 text-[#E8B84B] mt-1 shrink-0" />
                <span>21 Elmcroft Close, Feltham, TW14 9HH</span>
              </li>
            </ul>

            {/* Social media links */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-2 font-medium">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {['Facebook', 'Twitter', 'Youtube', 'Instagram'].map((network) => (
                  <a
                    key={network}
                    href="#social"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://facebook.com', '_blank');
                    }}
                    className="w-8 h-8 rounded-lg bg-[#12456B] flex items-center justify-center text-xs text-zinc-200 hover:text-[#0B1F33] hover:bg-[#E8B84B] transition-all cursor-pointer font-bold"
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

        {/* Copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>
            <span className="font-semibold text-zinc-200">{COMPANY_INFO.name}</span> Copyright &copy; {new Date().getFullYear()} All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('about')}
              className="hover:text-[#E8B84B] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNav('services')}
              className="hover:text-[#E8B84B] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="hover:text-[#E8B84B] transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <button
              onClick={() => handleNav('admin-login')}
              className="hover:text-[#E8B84B] transition-colors cursor-pointer flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Staff Portal / Admin"
            >
              <Lock className="w-3 h-3 text-[#E8B84B]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
