import React from 'react';
import { X, Phone, Mail, MapPin, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { COMPANY_INFO, SERVICES_LIST } from '../data/siteData';
import { PageTab } from '../types';

interface OffcanvasDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageTab) => void;
  onOpenQuote: () => void;
}

export const OffcanvasDrawer: React.FC<OffcanvasDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B2A45] border-l border-[#12456B] text-white p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#12456B]">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('home');
                }}
                className="text-left focus:outline-none cursor-pointer"
                aria-label="SK Services & Solutions Ltd Security"
              >
                <img
                  src="/images/sk-logo.svg"
                  alt="SK Services & Solutions Ltd Security"
                  className="h-11 w-auto object-contain"
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#12456B] hover:bg-[#E8B84B] text-white hover:text-[#0B1F33] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* About Blurb */}
            <div className="mt-6">
              <span className="text-xs uppercase tracking-widest text-[#E8B84B] font-bold">
                About Us
              </span>
              <p className="mt-2 text-zinc-200 text-sm leading-relaxed">
                {COMPANY_INFO.aboutIntro}
              </p>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                NASDU Level 2 certified dog handlers and BS8517-1 standard security dogs providing proactive deterrence, rapid detection, and around-the-clock site security.
              </p>
            </div>

            {/* Key Services Quick Links */}
            <div className="mt-8">
              <span className="text-xs uppercase tracking-widest text-zinc-300 font-bold block mb-3">
                Featured Capabilities
              </span>
              <div className="space-y-2.5">
                {SERVICES_LIST.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onClose();
                      onNavigate('services');
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-lg bg-[#12456B]/40 hover:bg-[#12456B] border border-white/10 hover:border-[#E8B84B] text-xs text-zinc-200 hover:text-white transition-all group cursor-pointer"
                  >
                    <span className="font-medium">{s.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E8B84B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Accreditations badges */}
            <div className="mt-8 p-4 rounded-xl bg-[#12456B]/40 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
                <Shield className="w-4 h-4 text-[#E8B84B]" />
                <span>Industry Certified Standards</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                  <span>NASDU Level 2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                  <span>BS8517-1 Standard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                  <span>SIA Licensed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B84B]" />
                  <span>24/7 Operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details & CTA */}
          <div className="mt-8 pt-6 border-t border-[#12456B] space-y-4">
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-3 text-zinc-200 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8B84B]/20 border border-[#E8B84B]/40 flex items-center justify-center text-[#E8B84B]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Direct Hotline</span>
                  <span className="font-bold text-sm text-white">{COMPANY_INFO.phoneDisplay}</span>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 text-zinc-200 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8B84B]/20 border border-[#E8B84B]/40 flex items-center justify-center text-[#E8B84B]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Email Enquiries</span>
                  <span className="font-medium text-xs text-white">{COMPANY_INFO.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 text-zinc-300 p-2">
                <div className="w-8 h-8 rounded-lg bg-[#12456B] flex items-center justify-center text-[#E8B84B]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider">Headquarters</span>
                  <span className="font-medium text-xs text-zinc-200">21 Elmcroft Close, Feltham, TW14 9HH</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenQuote();
              }}
              className="w-full btn-gold-primary py-3"
            >
              Request Free Site Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
