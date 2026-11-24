'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Droplets, ArrowRight } from 'lucide-react';
import { getOurCollection, CollectionItem } from '@/lib/ourcollection';
import ProductCard from '@/components/productCard';

export default function OurCollectionSection() {
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const data = await getOurCollection(8);
        if (mounted) {
          setCollection(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="our-collection"
      className="relative bg-soft-aqua/40 py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray overflow-hidden"
    >
      {/* Background ambient water glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-soft-aqua rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top-Right See All Products + Centered Heading */}
        <div className="relative mb-8 sm:mb-10 md:mb-14">
          <div className="flex justify-end mb-4 md:mb-0 md:absolute md:top-0 md:right-0">
            <Link
              href="/ourcollection"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pure-white border border-pale-blue-gray hover:border-aqua-teal text-xs sm:text-sm font-bold text-deep-navy hover:text-aqua-teal shadow-xs transition-all group"
            >
              <span>See All products</span>
              <ArrowRight className="w-3.5 h-3.5 text-aqua-teal group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-2xl mx-auto"
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
        </div>

        {/* Collection Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="aspect-[3/4] rounded-xl sm:rounded-2xl bg-pure-white/70 border-2 border-pale-blue-gray animate-pulse"
              />
            ))}
          </div>
        ) : collection.length === 0 ? (
          <div className="max-w-md mx-auto text-center rounded-2xl bg-pure-white border-2 border-pale-blue-gray p-8">
            <Droplets className="w-10 h-10 text-aqua-teal mx-auto mb-2" />
            <p className="text-sm sm:text-base font-bold text-deep-navy">
              No products available right now
            </p>
            <p className="text-xs text-deep-navy/70 mt-1">
              Check back shortly for our packaged drinking water collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {collection.map((item, index) => (
              <ProductCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
