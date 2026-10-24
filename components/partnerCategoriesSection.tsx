'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Check, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { getPartnerCategories, PartnerCategoryItem } from '@/lib/partnerCategories';

export default function PartnerCategoriesSection() {
  const [categories, setCategories] = useState<PartnerCategoryItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      const data = await getPartnerCategories();
      setCategories(data);
    }
    loadData();
  }, []);

  const toggleMobileFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="partner-categories" className="relative bg-pure-white py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray overflow-hidden">
      {/* Subtle Aqua Ambient Accents */}
      <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-soft-aqua rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-soft-aqua rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Responsive Small Heading & Text for Mobile UI */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-soft-aqua border border-pale-blue-gray mb-3.5 shadow-xs">
            <Layers className="w-4 h-4 text-aqua-teal" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-deep-navy">
              Partner Categories
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-deep-navy tracking-tight leading-tight">
            We Partner with Every Category to Provide{' '}
            <span className="text-aqua-teal">Fresh Water.</span>
          </h2>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
            We customize for every occasion from wedding functions to corporate meetings and conferences.
          </p>
        </motion.div>

        {/* Scroll Transition Cards Grid: Decreased Card Size, Vertical Only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const isFlippedOnMobile = !!flippedCards[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: 'easeOut',
                }}
                className="group [perspective:1200px] h-[340px] sm:h-[360px] md:h-[370px] w-full max-w-[340px] sm:max-w-none mx-auto cursor-pointer"
                onClick={() => toggleMobileFlip(category.id)}
              >
                {/* 3D Flippable Inner Card Container */}
                <div
                  className={`relative w-full h-full duration-500 rounded-2xl [transform-style:preserve-3d] transition-transform ${
                    isFlippedOnMobile
                      ? '[transform:rotateY(180deg)]'
                      : 'md:group-hover:[transform:rotateY(180deg)]'
                  }`}
                >
                  {/* ================= CARD FRONT ================= */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl p-1.5 bg-pure-white border-2 border-pale-blue-gray shadow-md [backface-visibility:hidden] flex flex-col">
                    
                    {/* Vertical Image filling the entire card interior (leaving border) */}
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-deep-navy flex flex-col justify-between">
                      <Image
                        src={category.photo}
                        alt={category.categoryName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover md:group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Deep-Navy Vignette & Gradient Over Image for Crisp Content Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/95 via-deep-navy/40 to-deep-navy/30" />

                      {/* Top In-Image Content: Badge & Flip Details Icon */}
                      <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between">
                        {category.badge ? (
                          <div className="px-2.5 py-0.5 rounded-full bg-deep-navy/85 backdrop-blur-xs text-pure-white text-[10px] font-bold border border-aqua-teal/50 shadow-xs">
                            {category.badge}
                          </div>
                        ) : (
                          <div />
                        )}

                        <div className="px-2.5 py-0.5 rounded-full bg-pure-white/90 backdrop-blur-xs text-deep-navy text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <RefreshCw className="w-2.5 h-2.5 text-aqua-teal" />
                          <span>Details</span>
                        </div>
                      </div>

                      {/* Bottom In-Image Content: Title & Description (without bottom View features/Details) */}
                      <div className="relative z-10 p-3.5 sm:p-4 text-pure-white space-y-1.5">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-aqua-teal/90 text-pure-white text-[9px] font-black uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5 text-pure-white" />
                          <span>Custom Partner</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-pure-white leading-snug drop-shadow-sm">
                          {category.categoryName}
                        </h3>

                        <p className="text-[11px] sm:text-xs text-pale-blue-gray/95 line-clamp-2 leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* ================= CARD BACK (FLIPPED ON TAP / HOVER) ================= */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-deep-navy border-2 border-aqua-teal shadow-xl p-4 sm:p-5 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] text-pure-white">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-pale-blue-gray/20 pb-2.5 mb-3">
                        <h4 className="text-sm sm:text-base font-black text-pure-white line-clamp-1">
                          {category.categoryName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-aqua-teal text-pure-white text-[10px] font-bold shrink-0">
                          Included
                        </span>
                      </div>

                      <p className="text-[10px] uppercase font-bold tracking-wider text-aqua-teal mb-2.5">
                        Customized Offerings:
                      </p>

                      {/* Points List */}
                      <ul className="space-y-2">
                        {category.points.map((point, pIndex) => (
                          <li key={pIndex} className="flex items-start gap-2">
                            <div className="mt-0.5 p-0.5 rounded-full bg-aqua-teal text-pure-white shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="text-[11px] sm:text-xs text-pale-blue-gray leading-tight">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Back Footer */}
                    <div className="pt-2.5 border-t border-pale-blue-gray/20 flex items-center justify-between text-[10px] sm:text-[11px]">
                      <span className="font-medium text-soft-aqua/80">
                        PlyAqua Solutions
                      </span>
                      <span className="text-aqua-teal font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        <span>Tap to flip back</span>
                      </span>
                    </div>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
