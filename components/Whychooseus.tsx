'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  Droplets,
  Building2,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';

export default function WhyChooseUs() {
  const consumerPoints = [
    'You get not only water you get Play and Fun.',
    '100% Purity Certified.',
    'Vital Natural Minerals.',
  ];

  const partnerPoints = [
    'Fresh Bottles',
    'Premium Water bottle brand',
    'Customization as your requirement',
  ];

  return (
    <section
      id="why-choose-us"
      className="relative bg-pure-white py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray overflow-hidden"
    >
      {/* Ambient Aqua background accents */}
      <div className="absolute top-1/4 -left-20 w-60 sm:w-80 h-60 sm:h-80 bg-soft-aqua rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-aqua-teal/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-aqua border border-pale-blue-gray mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-aqua-teal" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-deep-navy">
              The PlyAqua Innovation
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-deep-navy tracking-tight leading-tight">
            Why Choose Us??
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base font-bold text-aqua-teal leading-snug">
            We are doing something different with Water.
          </p>
        </motion.div>

        {/* Content & Image Grid with Scroll Transition - Centered on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center justify-center">
          
          {/* Left Column: Clean points with ticks (Towards Center on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col gap-6 sm:gap-7 lg:pr-2"
          >
            {/* Consumer Section - Points with Tick (No 'For Consumers' label) */}
            <div className="space-y-3 sm:space-y-3.5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 rounded-xl bg-soft-aqua text-aqua-teal shrink-0 shadow-xs">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-deep-navy leading-tight">
                  Pure Water with Play &amp; Fun
                </h3>
              </div>

              {/* Tick Points */}
              <ul className="space-y-2.5 sm:space-y-3 pt-1">
                {consumerPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="flex items-start gap-2.5 sm:gap-3"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-aqua-teal text-pure-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-deep-navy leading-snug">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Subtle Divider */}
            <div className="w-full h-px bg-pale-blue-gray" />

            {/* Partner Section - Points with Tick (No 'For the Partners' label) */}
            <div className="space-y-3 sm:space-y-3.5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 rounded-xl bg-soft-aqua text-aqua-teal shrink-0 shadow-xs">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-deep-navy leading-tight">
                  Premium Branding &amp; Custom Supply
                </h3>
              </div>

              {/* Tick Points */}
              <ul className="space-y-2.5 sm:space-y-3 pt-1">
                {partnerPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="flex items-start gap-2.5 sm:gap-3"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-deep-navy text-pure-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 text-aqua-teal stroke-[3]" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base font-semibold text-deep-navy leading-snug">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column: Increased Size Image (plyaqua_whycus.png) - Towards Center on Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-center lg:pl-2"
          >
            {/* Image Card Container - Increased Size */}
            <div className="relative w-full max-w-lg lg:max-w-xl rounded-2xl overflow-hidden border-2 border-pale-blue-gray bg-deep-navy shadow-xl group">
              
              {/* Image Aspect Ratio */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-deep-navy">
                <Image
                  src="/plyaqua_whycus.png"
                  alt="PlyAqua Why Choose Us - Water, Ads, Marketing"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Gradient Shadow for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/30 to-deep-navy/40" />

                {/* On-Image Highlight Banner */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 p-3 rounded-xl bg-deep-navy/90 backdrop-blur-md border border-aqua-teal/50 shadow-md">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-sunburst-yellow" />
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-pure-white">
                      Water, Ads, Marketing
                    </span>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded bg-sunburst-yellow text-deep-navy font-black text-xs sm:text-sm tracking-tight shadow-xs">
                    Like never seen before!
                  </div>
                </div>
              </div>
            </div>

            {/* Below Image Text */}
            <div className="w-full max-w-lg lg:max-w-xl mt-3.5 sm:mt-4 p-4 rounded-xl bg-soft-aqua/70 border border-pale-blue-gray text-deep-navy space-y-2">
              <div className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-aqua-teal shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-deep-navy leading-relaxed">
                  Partners will get advertisement and marketing that get extra revenue.
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1.5 border-t border-pale-blue-gray/60">
                <LayoutGrid className="w-4 h-4 text-aqua-teal shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-deep-navy/85 leading-relaxed">
                  Unified platform for stock management, loyalty points, and everything in one dashboard.
                </p>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
