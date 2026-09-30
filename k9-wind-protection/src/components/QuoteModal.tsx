import React, { useState } from 'react';
import { X, CheckCircle, Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { SERVICE_OPTIONS, COMPANY_INFO } from '../data/siteData';
import { submitLead } from '../lib/supabase';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultService,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(defaultService || SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

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
        setErrorMessage(res.error || 'Failed to submit quote request. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="relative inline-block w-full max-w-lg p-6 sm:p-8 my-8 text-left bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 text-[#0B1F33]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C99A2E]" />
              <h3 className="text-xl font-bold text-[#0B1F33] uppercase tracking-wide">
                Get Started
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 text-[#4A5A6A] hover:text-[#0B1F33] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 border border-[#E8B84B]/50 rounded-full flex items-center justify-center mx-auto text-[#C99A2E]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-[#0B1F33]">Thank You, {name}!</h4>
              <p className="text-[#4A5A6A] text-sm max-w-md mx-auto">
                Your enquiry regarding <span className="text-[#0B1F33] font-semibold">{service}</span> has been received. Our team will contact you shortly on <span className="text-[#0B1F33] font-semibold">{phone || email}</span>.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="btn-gold-primary"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <p className="text-xs text-[#4A5A6A]">
                Please provide your details below to receive a fast, bespoke security proposal.
              </p>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +44 7830 998699"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@example.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] focus:ring-1 focus:ring-[#12456B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                  Required Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0B1F33] focus:outline-none focus:border-[#12456B] transition-colors"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B1F33] uppercase tracking-wider mb-1.5">
                  Site Details / Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the location, size of premises, start date, or specific risks..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-[#0B1F33] placeholder-slate-400 focus:outline-none focus:border-[#12456B] transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-gold-primary py-3.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-[#4A5A6A]">
                  Or call directly for urgent deployments:{' '}
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="text-[#12456B] font-bold hover:underline"
                  >
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
