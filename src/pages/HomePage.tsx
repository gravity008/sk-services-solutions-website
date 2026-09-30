import React, { useState, useEffect } from 'react';
import { PageTab, ServiceItem, TestimonialItem } from '../types';
import {
  ArrowRight,
  Star,
  Quote,
  Shield,
} from 'lucide-react';
import {
  COMPANY_INFO,
  SERVICES_LIST,
  SECTORS_LIST,
  TESTIMONIALS_LIST,
  ACCREDITATION_LOGOS,
} from '../data/siteData';
import { fetchServices, fetchTestimonials } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: PageTab) => void;
  onOpenQuoteWithService?: (serviceName: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenQuoteWithService,
}) => {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS_LIST);

  // Fetch dynamic services and testimonials from Supabase
  useEffect(() => {
    let isMounted = true;
    fetchServices().then((data) => {
      if (isMounted && data && data.length > 0) {
        const active = data.filter((s) => s.is_active !== false);
        setServices(active.length > 0 ? active : data);
      }
    });
    fetchTestimonials().then((data) => {
      if (isMounted && data && data.length > 0) {
        setTestimonials(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to extract initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white text-[#0B1F33] min-h-screen">
      {/* ============================================================ */}
      {/* 1. FULL-BLEED PHOTO HERO SECTION (Left-Aligned, Matching Image) */}
      {/* ============================================================ */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center pt-32 sm:pt-36 md:pt-40 pb-20 md:pb-24 overflow-hidden">
        {/* Full-width Background Image with WebP & JPG fallback */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <source srcSet="/images/hero-guard-gate.webp" type="image/webp" />
          <img
            src="/images/hero-guard-gate.jpg"
            alt="Security guard at a secured property gate at dusk"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            className="w-full h-full object-cover"
          />
        </picture>

        {/* Directional Vignette / Dark Gradient: Stronger on the left for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2A45]/40 via-transparent to-black/60 pointer-events-none" />

        {/* Left-Aligned Hero Content Container */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-[650px] text-left">
            {/* 1. Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8B84B] text-[#0B1F33] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-[#0B1F33] shrink-0" />
              <span>PROFESSIONAL SECURITY SERVICES</span>
            </div>

            {/* 2. Main Heading (Left-aligned, crisp fully visible white text) */}
            <h1 className="font-['Montserrat',sans-serif] text-white font-extrabold text-3xl sm:text-5xl lg:text-[56px] leading-[1.12] tracking-tight mb-6">
              We provide verified &amp; SECURITY
              <br />
              secured service for your
              <br />
              business
            </h1>

            {/* 3. Subtitle Paragraph */}
            <p className="text-slate-200 text-sm sm:text-base md:text-[17px] font-normal leading-relaxed max-w-[550px] mb-8">
              SK Services &amp; Solutions Ltd offers comprehensive security solutions tailored to your needs. Our team of highly trained professionals ensures the safety and protection of your assets 24/7.
            </p>

            {/* 4. Solid Gold Pill Button */}
            <div>
              <button
                onClick={() => onNavigate('contact')}
                className="h-12 px-7 rounded-full bg-[#E8B84B] hover:bg-[#d6a539] text-[#0B1F33] font-bold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Get A Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5. Trust Line under Button */}
            <div className="mt-7 flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
              <Shield className="w-4 h-4 text-[#E8B84B] shrink-0" />
              <span>NASDU Level 2 &amp; BS8517-1 Certified Security Dog Handlers</span>
            </div>
          </div>
        </div>

        {/* Carousel / Slider Indicator Dots at Bottom Center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <span className="w-7 h-2 rounded-full bg-[#E8B84B] shadow-sm transition-all" />
          <span className="w-2 h-2 rounded-full bg-white/40 shadow-sm transition-all" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. RUNNING TEXT RIBBON STRIP (Clean Gold with Navy text)       */}
      {/* ============================================================ */}
      <section className="bg-[#E8B84B] py-3.5 relative z-20 overflow-hidden shadow-sm border-y border-[#C99A2E]">
        <div className="animate-marquee flex items-center whitespace-nowrap text-[#0B1F33] font-bold text-base sm:text-xl uppercase tracking-wider">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-8 mx-6">
              <span>Let us take care of your security, after all, it’s what we do best.</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#12456B]" />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. WHY CHOOSE US (White Background, Gold Label & Underline)    */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              WHY CHOOSE US
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0B1F33] max-w-3xl leading-tight">
              SK Services &amp; Solutions Ltd is a well-established security company providing comprehensive protection solutions across the UK.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Image with clean styling */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
                <img
                  src="/images/k9-Security.webp"
                  alt="Elite Security Dogs and Handlers"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badge */}
                <div className="absolute top-6 left-0 bg-[#E8B84B] text-[#0B1F33] px-5 py-2 font-black uppercase tracking-widest text-xs rounded-r-lg shadow-md">
                  ELITE PROTECTION
                </div>
              </div>
            </div>

            {/* Right Column: Text, Dual Buttons, 4.9 Star Review Card */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-[#0B1F33] text-base sm:text-lg leading-relaxed font-normal">
                At <strong className="font-bold text-[#12456B]">SK Services &amp; Solutions Ltd</strong>, we pride ourselves on delivering security services that go beyond industry standards. Our teams consist of highly trained <strong className="font-bold text-[#12456B]">NASDU Level 2 handlers</strong> working with <strong className="font-bold text-[#12456B]">BS8517-1 compliant dogs</strong>, providing a strong visible deterrent, rapid response, and reliable protection across all types of sites.
              </p>
              <p className="text-[#4A5A6A] text-base leading-relaxed">
                Unlike many providers, all our services are managed entirely <strong className="text-[#0B1F33] font-semibold">in-house</strong>, ensuring consistency, accountability, and complete confidence that your people, property, and assets are in safe hands.
              </p>

              {/* Dual CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('about')}
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

              {/* 
                Fixed 4.9 Star Review Card:
                Proper star icons, clear readable text, no cut-off
              */}
              <div className="mt-8 p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 max-w-md">
                {/* Avatars stack */}
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

                {/* Rating & Text with proper filled stars */}
                <div className="flex flex-col items-end sm:items-start text-right sm:text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex items-center text-[#E8B84B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#E8B84B] text-[#E8B84B]"
                        />
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
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SERVICES SECTION (Light Grey #F5F7FA, Navy Heading, Cards)  */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-24 bg-[#F5F7FA] border-y border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              OUR SERVICES
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#0B1F33] mb-4">
              SK SERVICES &amp; SOLUTIONS <span className="text-[#12456B]">Services</span>
            </h2>
            <p className="text-[#4A5A6A] text-base sm:text-lg leading-relaxed">
              Our dog patrol teams are proven to deter intruders, detect threats quickly, and provide unmatched protection for sites of every size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card flex flex-col justify-between group cursor-pointer"
              >
                {/* 1. Top Image Container: Always visible, natural rendering */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/Security-Guards.webp';
                    }}
                  />
                </div>

                {/* 2. Lower Content Section: Transitions to navy on hover */}
                <div className="service-card-body flex-1 flex flex-col justify-between p-6">
                  <div>
                    <h3 className="card-title text-xl font-bold text-[#12456B] mb-2.5">
                      {service.title}
                    </h3>
                    <p className="card-desc text-[#4A5A6A] text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenQuoteWithService) {
                          onOpenQuoteWithService(service.title);
                        } else {
                          onNavigate('contact');
                        }
                      }}
                      className="card-btn w-full py-3 rounded-lg bg-[#E8B84B] text-[#0B1F33] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Learn More &amp; Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. TESTIMONIALS (White Cards with Borders, Gold Stars, Navy)  */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              TESTIMONIALS
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#0B1F33]">
              Customer Comments
            </h2>
            <p className="text-[#4A5A6A] text-base mt-2">
              Real feedback from clients and contractors relying on SK Services &amp; Solutions Ltd.
            </p>
          </div>

          {/* Testimonials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="clean-card p-7 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-[#E8B84B]">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#E8B84B] text-[#E8B84B]"
                        />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="card-desc text-[#0B1F33] text-sm leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                  {/* Initials Avatar in a Navy Circle */}
                  <div className="author-avatar w-11 h-11 rounded-full bg-[#12456B] text-white flex items-center justify-center font-bold text-sm tracking-wider shrink-0 shadow-sm">
                    {getInitials(item.author)}
                  </div>
                  <div>
                    <strong className="card-strong block text-[#0B1F33] font-bold text-sm">
                      {item.author}
                    </strong>
                    <span className="card-label text-xs text-[#4A5A6A]">
                      {item.role || 'Verified Client'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. SECTORS WE SPECIALISE IN (Light Grey Background #F5F7FA)   */}
      {/* ============================================================ */}
      <section className="py-14 sm:py-24 bg-[#F5F7FA] border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              SECTORS WE SPECIALISE IN
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1F33] leading-snug">
              At SK Services &amp; Solutions Ltd, we tailor our services to suit various industries and premises. Our sector-specific solutions ensure maximum effectiveness and compliance.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SECTORS_LIST.map((sector) => (
              <div
                key={sector.id}
                className="clean-card p-7 text-center flex flex-col items-center cursor-pointer"
              >
                <div className="card-icon-box w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3.5 mb-5">
                  <img
                    src={sector.icon}
                    alt={sector.title}
                    className="card-icon-img w-full h-full object-contain"
                  />
                </div>
                <h4 className="card-title text-lg font-bold text-[#12456B] mb-2.5">
                  {sector.title}
                </h4>
                <p className="card-desc text-[#4A5A6A] text-sm leading-relaxed">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TRUST & ACCREDITATIONS CAROUSEL (White Background)        */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 bg-white text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1F33] mb-4">
              Professional security specialists working with some of the largest companies across the UK.
            </h2>
            <p className="text-[#4A5A6A] text-base leading-relaxed">
              {COMPANY_INFO.trustSub}
            </p>
          </div>

          {/* Accreditation Logos Bar */}
          <div className="py-6 border-y border-slate-200 overflow-hidden">
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
        </div>
      </section>
    </div>
  );
};
