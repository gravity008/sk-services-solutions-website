import React, { useState, useEffect } from 'react';
import { PageTab, ServiceItem } from '../types';
import { ArrowRight } from 'lucide-react';
import { SERVICES_LIST, SECTORS_LIST } from '../data/siteData';
import { fetchServices } from '../lib/supabase';

interface ServicesPageProps {
  onNavigate: (page: PageTab) => void;
  onSelectService: (serviceName: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSelectService,
}) => {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_LIST);

  useEffect(() => {
    let isMounted = true;
    fetchServices().then((data) => {
      if (isMounted && data && data.length > 0) {
        const active = data.filter((s) => s.is_active !== false);
        setServices(active.length > 0 ? active : data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="bg-white text-[#0B1F33] min-h-screen pt-28">
      {/* Page Header Banner */}
      <section className="relative py-20 sm:py-24 bg-[#0B2A45] border-b border-slate-200 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="/images/hero-dog.jpg"
            alt="K9 Security Patrol"
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
            <span>Services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow">
            SK SERVICES &amp; SOLUTIONS <span className="text-[#E8B84B]">Services</span>
          </h1>
          <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mt-4 mb-4" />
          <p className="max-w-2xl mx-auto text-zinc-200 text-base leading-relaxed">
            Delivering SIA-licensed officers, NASDU Level 2 certified dog handlers, and BS8517-1 compliant patrol dogs across all private and commercial sectors.
          </p>
        </div>
      </section>

      {/* Services Grid (Light Grey Background #F5F7FA) */}
      <section className="py-14 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card flex flex-col justify-between group cursor-pointer"
              >
                {/* 1. Top Image Container: Always visible, natural colors, never darkened/inverted */}
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
                        onSelectService(service.title);
                      }}
                      className="card-btn w-full py-3 rounded-lg bg-[#E8B84B] text-[#0B1F33] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Contact Us</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Breakdown (White Background) */}
      <section className="py-14 sm:py-24 bg-white border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
              SECTOR SPECIALISMS
            </span>
            <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1F33]">
              Tailored Solutions for High-Risk Environments
            </h2>
            <p className="text-[#4A5A6A] text-base mt-2">
              Specialized canine security protocols aligned with the unique requirements of your site.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SECTORS_LIST.map((sector) => (
              <div
                key={sector.id}
                className="clean-card p-6 text-center flex flex-col items-center cursor-pointer"
              >
                <div className="card-icon-box w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3.5 mx-auto mb-4">
                  <img
                    src={sector.icon}
                    alt={sector.title}
                    className="card-icon-img w-full h-full object-contain"
                  />
                </div>
                <h4 className="card-title text-base font-bold text-[#12456B] mb-2">
                  {sector.title}
                </h4>
                <p className="card-desc text-[#4A5A6A] text-xs leading-relaxed">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
