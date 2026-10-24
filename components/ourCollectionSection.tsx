'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, Droplets } from 'lucide-react';
import { getOurCollection, CollectionItem } from '@/lib/ourcollection';

export default function OurCollectionSection() {
  const [collection, setCollection] = useState<CollectionItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getOurCollection();
      setCollection(data);
    }
    loadData();
  }, []);

  return (
    <section id="our-collection" className="relative bg-soft-aqua/40 py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray overflow-hidden">
      {/* Background ambient water glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-soft-aqua rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: Small & Responsive for Mobile UI */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-pale-blue-gray mb-3 shadow-xs">
            <Droplets className="w-3.5 h-3.5 text-aqua-teal" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-deep-navy">
              Premium Packaged Range
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-deep-navy tracking-tight leading-tight">
            Our <span className="text-aqua-teal">Collection</span>
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
            Crafted for pure taste, optimal mineral balance, and refreshed hydration across every setting.
          </p>
        </motion.div>

        {/* Collection Cards Grid:
            RULE: "decrease the size of the Card. We want 4:5 ration with Small card and text also decrease the font size make it responsive for the mobile. and remove the description. On desktop 4 columns and also decrease the size and height." */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {collection.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: (index % 4) * 0.08,
                ease: 'easeOut',
              }}
              className="flex flex-col rounded-xl sm:rounded-2xl bg-pure-white border-2 border-pale-blue-gray overflow-hidden shadow-xs hover:shadow-md hover:border-aqua-teal transition-all duration-300 group"
            >
              {/* Photo Container strictly with 4:5 ratio, small card size & height */}
              <div className="relative w-full aspect-[4/5] bg-pale-blue-gray/40 overflow-hidden shrink-0">
                <Image
                  src={item.photo}
                  alt={item.productName}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Aqua Gradient Overlay on photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Tag Badge */}
                <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 rounded-full bg-deep-navy/90 backdrop-blur-xs text-pure-white text-[9px] sm:text-[10px] font-bold border border-aqua-teal/50 shadow-xs">
                  {item.tag}
                </div>

                {/* Floating pure mineral indicator */}
                <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-pure-white/90 backdrop-blur-xs text-deep-navy text-[9px] sm:text-[10px] font-semibold">
                  <Sparkles className="w-2.5 h-2.5 text-aqua-teal" />
                  <span>Pure Mineral</span>
                </div>
              </div>

              {/* Card Details: Product Name & Meta (Description Removed) */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-pure-white">
                <div>
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-deep-navy group-hover:text-aqua-teal transition-colors duration-200 line-clamp-1 leading-snug">
                    {item.productName}
                  </h3>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-2.5 pt-2 border-t border-pale-blue-gray flex items-center justify-between text-[9px] sm:text-[10px]">
                  <span className="font-semibold text-deep-navy/70 truncate">
                    Natural Water
                  </span>
                  <span className="font-bold text-aqua-teal px-1.5 py-0.5 rounded bg-soft-aqua shrink-0">
                    100% Pure
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
