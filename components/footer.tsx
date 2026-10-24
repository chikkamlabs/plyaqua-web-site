'use client';

import React from 'react';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Recycle,
  Award,
  ArrowUp,
} from 'lucide-react';

export default function Footer() {
  const navLinks = [
    'Home',
    'Partner categories',
    'Our collection',
    'Why choose us',
    'Contact us',
    'Footer',
  ];

  const occasions = [
    'Wedding & Celebrations',
    'Corporate & Offices',
    'Hotels & Restaurants',
    'Outdoor & Sports',
    'Daily Family Hydration',
  ];

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="w-full bg-deep-navy text-pure-white border-t border-pale-blue-gray/20">
      {/* Top Banner with Purity & Trust Highlights */}
      <div className="border-b border-pale-blue-gray/10 bg-deep-navy/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-full bg-aqua-teal/20 text-aqua-teal">
                <ShieldCheck className="w-6 h-6 text-aqua-teal" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-pure-white">FSSAI Certified</h4>
                <p className="text-xs text-pale-blue-gray/70">Tested &amp; Grade-A Purity</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-full bg-aqua-teal/20 text-aqua-teal">
                <Award className="w-6 h-6 text-aqua-teal" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-pure-white">Multi-Stage Filtration</h4>
                <p className="text-xs text-pale-blue-gray/70">Enriched with Vital Minerals</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2.5 rounded-full bg-aqua-teal/20 text-aqua-teal">
                <Recycle className="w-6 h-6 text-aqua-teal" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-pure-white">100% Recyclable</h4>
                <p className="text-xs text-pale-blue-gray/70">Eco-conscious packaging</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex items-center gap-3 select-none mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-pure-white border border-soft-aqua p-1 shrink-0">
                <Image
                  src="/plyaqua_logo.png"
                  alt="PlyAqua"
                  fill
                  sizes="48px"
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-pure-white">
                  PlyAqua
                </span>
                <span className="block text-xs font-semibold text-aqua-teal">
                  More Water More Fun
                </span>
              </div>
            </div>
            <p className="text-sm text-pale-blue-gray/80 leading-relaxed mb-6">
              PlyAqua brings pure, refreshing packaged drinking water crafted for every occasion.
              Delivering purity, hydration, and joyous moments to homes, offices, and events.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-aqua-teal bg-soft-aqua/10 px-3 py-1.5 rounded-full w-fit">
              <span>Pure Water • Better Tomorrow</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aqua-teal mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link}>
                  <span className="text-sm text-pale-blue-gray/80 hover:text-aqua-teal cursor-default transition-colors">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasions / Packaging Categories */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aqua-teal mb-4">
              Occasions
            </h3>
            <ul className="space-y-2.5">
              {occasions.map((occasion) => (
                <li key={occasion}>
                  <span className="text-sm text-pale-blue-gray/80 hover:text-aqua-teal cursor-default transition-colors">
                    {occasion}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aqua-teal mb-4">
              Contact Us
            </h3>
            <div className="space-y-3.5 text-sm text-pale-blue-gray/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-aqua-teal shrink-0 mt-0.5" />
                <span>KSR Complex, Koramangala, Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-aqua-teal shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-aqua-teal shrink-0" />
                <span>care@plyaqua.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-12 pt-8 border-t border-pale-blue-gray/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-pale-blue-gray/60 text-center sm:text-left">
            &copy; {new Date().getFullYear()} PlyAqua Water Company. All rights reserved. Packaged Drinking Water.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-aqua-teal hover:text-pure-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
