'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, Menu, X, ChevronDown, User, Briefcase } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  const [mobileContactExpanded, setMobileContactExpanded] = useState(false);

  // Contact Navigation with selected filter ('customer' or 'partner')
  const handleContactNavigate = (type: 'customer' | 'partner') => {
    setMobileMenuOpen(false);
    setContactHovered(false);

    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.dispatchEvent(
          new CustomEvent('plyaqua:contact-tab', { detail: type })
        );
        const contactEl = document.getElementById('contact-us');
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        try {
          sessionStorage.setItem('plyaqua:contact-tab', type);
        } catch {
          // ignore storage error if disabled
        }
        window.location.href = '/#contact-us';
      }
    }
  };

  // Generic section navigation handler
  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        if (id === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = id === 'hero' ? '/' : `/#${id}`;
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-deep-navy/95 backdrop-blur-md border-b border-pure-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: PlyAqua Logo + Text */}
          <div
            onClick={() => handleScrollTo('hero')}
            className="flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer"
          >
            <div className="relative w-10 h-10 sm:w-13 sm:h-13 shrink-0 rounded-full overflow-hidden border border-pure-white/20 bg-pure-white/10 shadow-xs">
              <Image
                src="/plyaqua_logo.png"
                alt="PlyAqua Logo"
                fill
                sizes="52px"
                className="object-contain p-1"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-pure-white leading-none">
                PlyAqua
              </span>
              <span className="hidden md:block text-[11px] sm:text-xs font-semibold tracking-wide text-soft-aqua mt-0.5">
                More Water More Fun
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Menu with Light Colors */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => handleScrollTo('hero')}
              className="text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150 py-1"
            >
              Home
            </button>

            {/* 2. Partner categories */}
            <button
              type="button"
              onClick={() => handleScrollTo('partner-categories')}
              className="text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150 py-1"
            >
              Partner categories
            </button>

            {/* 3. Our Collection categories */}
            <button
              type="button"
              onClick={() => handleScrollTo('our-collection')}
              className="text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150 py-1"
            >
              Our Collection
            </button>

            {/* 4. Why choose us */}
            <button
              type="button"
              onClick={() => handleScrollTo('why-choose-us')}
              className="text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150 py-1"
            >
              Why choose us
            </button>

            {/* 5. Contact us with selected filter */}
            <div
              className="relative py-2"
              onMouseEnter={() => setContactHovered(true)}
              onMouseLeave={() => setContactHovered(false)}
            >
              <button
                type="button"
                onClick={() => handleContactNavigate('customer')}
                className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150"
              >
                <span>Contact us</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-aqua-teal transition-transform duration-200 ${
                    contactHovered ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Hover Dropdown for customer / partner filter */}
              {contactHovered && (
                <div className="absolute top-full -left-4 w-44 py-2 rounded-xl bg-deep-navy border-2 border-pure-white/20 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-soft-aqua/70">
                    Select Filter:
                  </div>
                  <button
                    type="button"
                    onClick={() => handleContactNavigate('customer')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-pure-white hover:bg-pure-white/10 hover:text-aqua-teal text-left cursor-pointer transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-aqua-teal" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleContactNavigate('partner')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-pure-white hover:bg-pure-white/10 hover:text-aqua-teal text-left cursor-pointer transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-aqua-teal" />
                    <span>Partner</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6. Footer */}
            <button
              type="button"
              onClick={() => handleScrollTo('footer')}
              className="text-xs sm:text-sm font-semibold text-pure-white/90 hover:text-aqua-teal cursor-pointer transition-colors duration-150 py-1"
            >
              Footer
            </button>
          </nav>

          {/* Right: Game Play CTA & Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/gameplay"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-aqua-teal text-pure-white font-bold text-xs sm:text-sm shadow-sm hover:bg-pure-white hover:text-deep-navy active:scale-95 cursor-pointer transition-all duration-200"
              title="Game Play"
            >
              <Gamepad2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Game Play</span>
            </Link>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-pure-white hover:bg-pure-white/10 transition-colors duration-150 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-pure-white" />
              ) : (
                <Menu className="w-6 h-6 text-pure-white" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer with Dark Navy & Light Colors */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-pure-white/10 bg-deep-navy text-pure-white animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-1">
              <Link
                href="/gameplay"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm font-bold text-aqua-teal bg-pure-white/10 rounded-lg transition-colors mb-1"
              >
                <Gamepad2 className="w-4 h-4 text-aqua-teal" />
                <span>Spin &amp; Win Game</span>
              </Link>

              {/* 1. Home */}
              <button
                type="button"
                onClick={() => handleScrollTo('hero')}
                className="px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
              >
                Home
              </button>

              {/* 2. Partner categories */}
              <button
                type="button"
                onClick={() => handleScrollTo('partner-categories')}
                className="px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
              >
                Partner categories
              </button>

              {/* 3. Our Collection categories */}
              <button
                type="button"
                onClick={() => handleScrollTo('our-collection')}
                className="px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
              >
                Our Collection
              </button>

              {/* 4. Why choose us */}
              <button
                type="button"
                onClick={() => handleScrollTo('why-choose-us')}
                className="px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
              >
                Why choose us
              </button>

              {/* 5. Contact us with selected filter */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setMobileContactExpanded(!mobileContactExpanded)}
                  className="flex items-center justify-between px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
                >
                  <span>Contact us</span>
                  <ChevronDown
                    className={`w-4 h-4 text-aqua-teal transition-transform ${
                      mobileContactExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {mobileContactExpanded && (
                  <div className="pl-6 pr-3 py-1.5 flex flex-col gap-1 bg-pure-white/5 rounded-lg my-1">
                    <button
                      type="button"
                      onClick={() => handleContactNavigate('customer')}
                      className="flex items-center gap-2 py-1.5 text-xs font-bold text-soft-aqua hover:text-aqua-teal text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-aqua-teal" />
                      <span>Customer Filter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContactNavigate('partner')}
                      className="flex items-center gap-2 py-1.5 text-xs font-bold text-soft-aqua hover:text-aqua-teal text-left cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-aqua-teal" />
                      <span>Partner Filter</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 6. Footer */}
              <button
                type="button"
                onClick={() => handleScrollTo('footer')}
                className="px-3 py-2 text-left text-sm font-semibold text-pure-white/90 hover:bg-pure-white/10 hover:text-aqua-teal rounded-lg transition-colors cursor-pointer"
              >
                Footer
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
