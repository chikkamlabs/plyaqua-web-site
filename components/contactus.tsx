'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  Briefcase,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

type ContactType = 'customer' | 'partner';

export default function ContactUs() {
  const [activeTab, setActiveTab] = useState<ContactType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('plyaqua:contact-tab');
        if (saved === 'customer' || saved === 'partner') {
          sessionStorage.removeItem('plyaqua:contact-tab');
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return 'customer';
  });
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('Wedding Functions & Celebrations');
  const [reason, setReason] = useState('Order Fresh Packaged Water for Home / Event');
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Listen for custom event from header navigation
  useEffect(() => {
    const handleCustomTab = (e: Event) => {
      const customEvent = e as CustomEvent<ContactType>;
      if (customEvent.detail === 'customer' || customEvent.detail === 'partner') {
        setActiveTab(customEvent.detail);
      }
    };

    window.addEventListener('plyaqua:contact-tab', handleCustomTab);
    return () => {
      window.removeEventListener('plyaqua:contact-tab', handleCustomTab);
    };
  }, []);

  // Update default reason when tab changes
  const handleTabChange = (tab: ContactType) => {
    setActiveTab(tab);
    setErrorMessage('');
    if (tab === 'customer') {
      setReason('Order Fresh Packaged Water for Home / Event');
    } else {
      setReason('Run Ads on Water Bottles (Interactive QR Campaign)');
    }
  };

  const partnerCategories = [
    'Wedding Functions & Celebrations',
    'Corporate Meetings & Conferences',
    'Hotels, Cafes & Fine Dining',
    'Gyms, Fitness & Sports Arenas',
    'Schools, Colleges & Universities',
    'Festivals, Concerts & Public Expos',
    'Wholesale Distribution & Retail',
    'Corporate Brand Advertiser',
  ];

  const customerReasons = [
    'Order Fresh Packaged Water for Home / Event',
    'Inquiry about Water Purity, TDS & Minerals',
    'Scan & Play Game Cashback Assistance',
    'Delivery Status & Scheduled Supply',
    'General Customer Feedback',
  ];

  const partnerReasons = [
    'Run Ads on Water Bottles (Interactive QR Campaign)',
    'Bulk Packaged Water Supply Contract',
    'Custom Label Branding for Events / Weddings',
    'Distribution & Dealership Partnership',
    'Game Cashback & Rewards Brand Sponsorship',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!mobile.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }

    setErrorMessage('');

    // Format the WhatsApp message for +91 99890 63822
    const lines = [
      `*PlyAqua Contact Inquiry*`,
      `*Type:* ${activeTab === 'partner' ? 'Partner / Business' : 'Customer'}`,
      `*Name:* ${name.trim()}`,
      `*Mobile:* ${mobile.trim()}`,
      ...(activeTab === 'partner' ? [`*Category:* ${category}`] : []),
      `*Reason:* ${reason}`,
      ...(note.trim() ? [`*Note:* ${note.trim()}`] : []),
      `\n_Sent via PlyAqua Website_`,
    ];

    const encodedMessage = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/919989063822?text=${encodedMessage}`;

    if (typeof window !== 'undefined') {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <section
      id="contact-us"
      className="relative bg-soft-aqua/50 py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray scroll-mt-20 overflow-hidden"
    >
      {/* Aqua Ambient Blobs */}
      <div className="absolute top-10 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-aqua-teal/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-pale-blue-gray rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Small & Responsive for Mobile UI */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-pale-blue-gray mb-3 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-aqua-teal" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-deep-navy">
              Get in Touch
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-deep-navy tracking-tight leading-tight">
            Connect with <span className="text-aqua-teal">PlyAqua</span>
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
            Whether you want pure fresh water for your next occasion or want to explore our breakthrough bottle advertising, we are just a message away.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Direct Reach-out */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-5 flex flex-col gap-4 sm:gap-6"
          >
            <div className="p-4 sm:p-6 rounded-2xl bg-pure-white border-2 border-pale-blue-gray shadow-sm">
              <h3 className="text-base sm:text-lg md:text-xl font-black text-deep-navy mb-1.5">
                Direct Reach-out &amp; Quick Support
              </h3>
              <p className="text-xs sm:text-sm text-deep-navy/80 leading-relaxed">
                From wedding custom label orders to corporate hydration and bottle ads, our team is active 24/7.
              </p>

              <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-soft-aqua/60 border border-pale-blue-gray">
                  <div className="p-2 rounded-lg bg-aqua-teal text-pure-white shrink-0">
                    <Phone className="w-4 h-4 text-pure-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs font-semibold text-deep-navy/70 block">
                      Direct Helpline &amp; WhatsApp
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-deep-navy truncate block">
                      +91 99890 63822
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-soft-aqua/60 border border-pale-blue-gray">
                  <div className="p-2 rounded-lg bg-aqua-teal text-pure-white shrink-0">
                    <Mail className="w-4 h-4 text-pure-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs font-semibold text-deep-navy/70 block">
                      Official Email
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-deep-navy truncate block">
                      care@plyaqua.in
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-soft-aqua/60 border border-pale-blue-gray">
                  <div className="p-2 rounded-lg bg-aqua-teal text-pure-white shrink-0">
                    <MapPin className="w-4 h-4 text-pure-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs font-semibold text-deep-navy/70 block">
                      Headquarters
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-deep-navy leading-tight block">
                      KSR Complex, Koramangala, Bengaluru
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-soft-aqua/60 border border-pale-blue-gray">
                  <div className="p-2 rounded-lg bg-aqua-teal text-pure-white shrink-0">
                    <Clock className="w-4 h-4 text-pure-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs font-semibold text-deep-navy/70 block">
                      Support Timings
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-deep-navy block">
                      Mon - Sun: 8:00 AM – 9:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Purity & Reliability Callout */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-deep-navy text-pure-white border-2 border-aqua-teal shadow-md">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-aqua-teal shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-pure-white">
                    Guaranteed Purity &amp; Freshness
                  </h4>
                  <p className="text-[10px] sm:text-xs text-pale-blue-gray mt-0.5 leading-tight">
                    Every bottle is certified by FSSAI and delivered sealed under hygienic cold chain transport.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Responsive Form for Every Screen Size */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7"
          >
            <div className="bg-pure-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-pale-blue-gray shadow-md">
              
              {/* Customer vs Partner Switcher / Toggle */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-2">
                  I am contacting as:
                </label>
                <div className="grid grid-cols-2 p-1 rounded-xl bg-pale-blue-gray border border-pale-blue-gray">
                  <button
                    type="button"
                    onClick={() => handleTabChange('customer')}
                    className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      activeTab === 'customer'
                        ? 'bg-pure-white text-deep-navy shadow-sm border border-pale-blue-gray'
                        : 'text-deep-navy/70 hover:text-deep-navy'
                    }`}
                  >
                    <User className={`w-3.5 h-3.5 ${activeTab === 'customer' ? 'text-aqua-teal' : ''}`} />
                    <span>Customer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('partner')}
                    className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      activeTab === 'partner'
                        ? 'bg-deep-navy text-pure-white shadow-sm'
                        : 'text-deep-navy/70 hover:text-deep-navy'
                    }`}
                  >
                    <Briefcase className={`w-3.5 h-3.5 ${activeTab === 'partner' ? 'text-aqua-teal' : ''}`} />
                    <span>Partner</span>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-soft-aqua border border-aqua-teal text-deep-navy text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    {activeTab === 'partner' ? 'Contact Person / Partner Name' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={activeTab === 'partner' ? 'e.g. Rahul Sharma (Event Planner)' : 'e.g. Ramesh Kumar'}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-pure-white border-2 border-pale-blue-gray focus:border-aqua-teal focus:outline-hidden text-deep-navy text-xs sm:text-sm font-medium transition-colors"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    Mobile Number (WhatsApp Preferred) *
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-pure-white border-2 border-pale-blue-gray focus:border-aqua-teal focus:outline-hidden text-deep-navy text-xs sm:text-sm font-medium transition-colors"
                  />
                </div>

                {/* Category (ONLY FOR PARTNER) */}
                {activeTab === 'partner' && (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                      Partner Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-pure-white border-2 border-pale-blue-gray focus:border-aqua-teal focus:outline-hidden text-deep-navy text-xs sm:text-sm font-medium transition-colors"
                    >
                      {partnerCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    Reason for Contact *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-pure-white border-2 border-pale-blue-gray focus:border-aqua-teal focus:outline-hidden text-deep-navy text-xs sm:text-sm font-medium transition-colors"
                  >
                    {(activeTab === 'partner' ? partnerReasons : customerReasons).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy mb-1.5">
                    Note / Specific Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={
                      activeTab === 'partner'
                        ? 'Event date, bottle quantity, label customization, or ads...'
                        : 'Any specific requests or delivery address details...'
                    }
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-pure-white border-2 border-pale-blue-gray focus:border-aqua-teal focus:outline-hidden text-deep-navy text-xs sm:text-sm font-medium resize-none transition-colors"
                  />
                </div>

                {/* Submit Contact CTA Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl bg-aqua-teal hover:bg-deep-navy text-pure-white font-black text-xs sm:text-sm md:text-base shadow-md shadow-aqua-teal/20 transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4 text-pure-white" />
                    <span>Contact (+91 99890 63822)</span>
                  </button>
                  <p className="mt-1.5 text-center text-[10px] sm:text-xs text-deep-navy/60">
                    Tapping contact redirects to WhatsApp with your details.
                  </p>
                </div>
              </form>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
