import React, { useState } from 'react';
import { PageTab } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle,
  Shield,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { COMPANY_INFO, SERVICE_OPTIONS } from '../data/siteData';
import { submitLead } from '../lib/supabase';

interface ContactPageProps {
  onNavigate: (page: PageTab) => void;
  initialService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  initialService,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(initialService || 'Security Guards');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please provide a contact phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitLead({
        name,
        email,
        phone,
        service_interested: service,
        message,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to submit enquiry. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setErrorMessage('');
  };

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
            <span>Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            Contact <span className="text-[#E8B84B]">Us</span>
          </h1>
          <div className="w-12 h-1 bg-[#E8B84B] rounded-full mx-auto mt-4" />
        </div>
      </section>

      {/* Main Form & Contact Information (Light Grey Background #F5F7FA) */}
      <section className="py-14 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Clean White Form Container */}
            <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12">
              <div className="mb-8">
                <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
                  SEND US A MESSAGE
                </span>
                <div className="w-12 h-1 bg-[#E8B84B] rounded-full mb-4" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1F33] mb-2">
                  Let us know how we can help by filling out the form below.
                </h2>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-50 border border-[#E8B84B]/50 rounded-full flex items-center justify-center mx-auto text-[#C99A2E]">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1F33]">Message Sent Successfully</h3>
                  <p className="text-[#4A5A6A] text-base max-w-md mx-auto">
                    Thank you, <span className="text-[#0B1F33] font-semibold">{name}</span>. Your enquiry regarding <span className="text-[#0B1F33] font-semibold">{service}</span> has been logged. An operations manager will reach out shortly on {phone}.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="btn-gold-primary"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
                      Services Required
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-[#0B1F33] focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F33] mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about the site location, duration, and specific requirements..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold-primary py-4 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Direct Contact Details */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C99A2E] font-bold block mb-2">
                    DIRECT CONTACT
                  </span>
                  <div className="w-12 h-1 bg-[#E8B84B] rounded-full mb-4" />
                  <h2 className="text-3xl font-black text-[#0B1F33] mb-3">
                    GET IN TOUCH
                  </h2>
                  <p className="text-[#4A5A6A] text-base leading-relaxed">
                    Have questions, suggestions, or need emergency security deployment? Reach out and our team will assist you immediately.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="clean-card p-5 flex items-start gap-4 cursor-pointer"
                  >
                    <div className="card-icon-box w-12 h-12 rounded-xl bg-amber-50 border border-[#E8B84B]/40 flex items-center justify-center text-[#C99A2E] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="card-label block text-xs uppercase tracking-wider text-[#4A5A6A] font-bold">
                        Phone Number
                      </span>
                      <span className="card-value text-lg font-bold text-[#0B1F33]">
                        {COMPANY_INFO.phoneDisplay}
                      </span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="clean-card p-5 flex items-start gap-4 cursor-pointer"
                  >
                    <div className="card-icon-box w-12 h-12 rounded-xl bg-amber-50 border border-[#E8B84B]/40 flex items-center justify-center text-[#C99A2E] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="card-label block text-xs uppercase tracking-wider text-[#4A5A6A] font-bold">
                        Email Address
                      </span>
                      <span className="card-value text-base font-bold text-[#0B1F33] break-all">
                        {COMPANY_INFO.email}
                      </span>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="clean-card p-5 flex items-start gap-4 cursor-pointer">
                    <div className="card-icon-box w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#12456B] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="card-label block text-xs uppercase tracking-wider text-[#4A5A6A] font-bold">
                        Office Location
                      </span>
                      <span className="card-value text-base font-bold text-[#0B1F33]">
                        21 Elmcroft Close
                      </span>
                      <span className="card-desc block text-xs text-[#4A5A6A] mt-0.5">
                        Feltham, TW14 9HH, United Kingdom
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="pt-4 border-t border-slate-200">
                  <span className="text-xs uppercase tracking-widest text-[#4A5A6A] font-bold block mb-3">
                    Connect With Us on Social Media:
                  </span>
                  <div className="flex items-center gap-3">
                    {['Facebook', 'Twitter', 'Youtube', 'Instagram'].map((network) => (
                      <a
                        key={network}
                        href="#social"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open('https://facebook.com', '_blank');
                        }}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1F33] hover:bg-[#E8B84B] hover:border-[#E8B84B] transition-all cursor-pointer shadow-sm"
                      >
                        {network}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick trust reassurance (Navy card with white text) */}
              <div className="p-6 rounded-2xl bg-[#0B2A45] border border-[#12456B] flex items-center gap-4 text-white shadow-md">
                <Shield className="w-8 h-8 text-[#E8B84B] shrink-0" />
                <div>
                  <strong className="block text-sm text-white">Rapid 24/7 Deployment</strong>
                  <p className="text-xs text-zinc-300">
                    Emergency security guard units dispatched nationwide across the UK within hours of agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
