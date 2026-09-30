import React from 'react';
import { PageTab } from '../types';
import {
  ArrowRight,
  Star,
  Shield,
  Award,
  Clock,
} from 'lucide-react';
import {
  COMPANY_INFO,
  ACCREDITATION_LOGOS,
} from '../data/siteData';

interface AboutPageProps {
  onNavigate: (page: PageTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-[#0B1F33] min-h-screen pt-28">
      {/* Page Header Banner (Neutral dark overlay with dog photo) */}
      <section className="relative py-20 sm:py-24 bg-[#0B2A45] border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="/images/hero-dog.jpg"
            alt="Security Patrol"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#E8B84B] font-bold mb-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span>About</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            About <span className="text-[#E8B84B]">Us</span>
          </h1>
          <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mt-4" />
        </div>
      </section>

      {/* Main About Section (White background) */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              OUR HERITAGE
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B1F33] max-w-3xl leading-tight">
              {COMPANY_INFO.aboutIntro}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            {/* Left Column: Image with clean border and badge */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                <img
                  src="/images/k9-Security.webp"
                  alt="Elite Security Dogs"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute top-6 left-0 bg-[#E8B84B] text-[#0B1F33] px-5 py-2 font-black uppercase tracking-widest text-xs rounded-r-lg shadow-md">
                  ELITE PROTECTION
                </div>
              </div>
            </div>

            {/* Right Column: In-depth copy */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-[#0B1F33] text-base sm:text-lg leading-relaxed">
                At <strong className="font-bold text-[#12456B]">SK Services &amp; Solutions Ltd</strong>, we pride ourselves on delivering security services that go beyond industry standards. Our teams consist of highly trained <strong className="font-bold text-[#12456B]">NASDU Level 2 handlers</strong> working with <strong className="font-bold text-[#12456B]">BS8517-1 compliant dogs</strong>, providing a strong visible deterrent, rapid response, and reliable protection across all types of sites.
              </p>
              <p className="text-[#4A5A6A] text-base leading-relaxed">
                Unlike many providers, all our services are managed entirely <strong className="text-[#0B1F33] font-semibold">in-house</strong>, ensuring consistency, accountability, and complete confidence that your people, property, and assets are in safe hands.
              </p>

              {/* Dual CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('services')}
                  className="btn-gold-primary w-full sm:w-auto"
                >
                  <span>FIND OUT MORE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="btn-navy-outline w-full sm:w-auto"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Review Badge Card */}
              <div className="mt-8 p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 max-w-md">
                <div className="flex items-center -space-x-3 overflow-hidden shrink-0">
                  <img
                    src="/images/Testimonial-3.jpg"
                    alt="Client Reviewer"
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-sm"
                  />
                  <img
                    src="/images/Testimonial-2.jpg"
                    alt="Client Reviewer"
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-sm"
                  />
                  <img
                    src="/images/Testimonial-1.jpg"
                    alt="Client Reviewer"
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover shadow-sm"
                  />
                  <div className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#12456B] ring-2 ring-white text-white font-bold text-xs shadow-sm">
                    +
                  </div>
                </div>

                <div className="flex flex-col items-end sm:items-start text-right sm:text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex items-center text-[#E8B84B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E8B84B] text-[#E8B84B]" />
                      ))}
                    </div>
                    <span className="font-extrabold text-[#0B1F33] text-sm sm:text-base">
                      4.9 Star
                    </span>
                  </div>
                  <span className="text-xs text-[#4A5A6A] font-semibold tracking-wide uppercase">
                    Client Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Core Pillars (White Cards on Light Grey Band #F5F7FA) */}
          <div className="pt-12 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
                OUR PILLARS
              </span>
              <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-black text-[#0B1F33]">
                Built on Uncompromising Standards
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="clean-card p-8 text-center flex flex-col items-center cursor-pointer">
                <div className="card-icon-box w-14 h-14 rounded-2xl bg-amber-50 border border-[#E8B84B]/30 flex items-center justify-center text-[#C99A2E] mb-6">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="card-title text-xl font-bold text-[#12456B] mb-3">NASDU L2 Certified</h4>
                <p className="card-desc text-[#4A5A6A] text-sm leading-relaxed">
                  Every handler undergoes rigorous NASDU Level 2 training and operational assessment, ensuring complete legal compliance and proven field competency.
                </p>
              </div>

              <div className="clean-card p-8 text-center flex flex-col items-center cursor-pointer">
                <div className="card-icon-box w-14 h-14 rounded-2xl bg-amber-50 border border-[#E8B84B]/30 flex items-center justify-center text-[#C99A2E] mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <h4 className="card-title text-xl font-bold text-[#12456B] mb-3">BS8517-1 Compliance</h4>
                <p className="card-desc text-[#4A5A6A] text-sm leading-relaxed">
                  We strictly adhere to British Standard BS8517-1 for the operational use of security dogs, delivering humane, disciplined, and effective protection.
                </p>
              </div>

              <div className="clean-card p-8 text-center flex flex-col items-center cursor-pointer">
                <div className="card-icon-box w-14 h-14 rounded-2xl bg-amber-50 border border-[#E8B84B]/30 flex items-center justify-center text-[#C99A2E] mb-6">
                  <Clock className="w-7 h-7" />
                </div>
                <h4 className="card-title text-xl font-bold text-[#12456B] mb-3">24/7 Rapid Response</h4>
                <p className="card-desc text-[#4A5A6A] text-sm leading-relaxed">
                  Available around the clock for short-notice emergency guarding, static protection, weekend patrols, and rapid site lockdown deployments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditations Banner (Light Grey #F5F7FA) */}
      <section className="py-16 bg-[#F5F7FA] border-t border-slate-200 text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
            ACCREDITATIONS &amp; STANDARDS
          </span>
          <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-6" />
          <div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
            {ACCREDITATION_LOGOS.map((logo) => (
              <div
                key={logo.id}
                className="p-3 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
