'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles, Droplets } from 'lucide-react';
import { CollectionItem } from '@/lib/ourcollection';

interface ProductCardProps {
  item: CollectionItem;
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const badgeText = item.tag || item.size;

  return (
    <motion.div
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
        {item.photo ? (
          <Image
            src={item.photo}
            alt={item.productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-soft-aqua">
            <Droplets className="w-12 h-12 text-aqua-teal" />
          </div>
        )}

        {/* Aqua Gradient Overlay on photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Tag Badge */}
        {badgeText && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 rounded-full bg-deep-navy/90 backdrop-blur-xs text-pure-white text-[9px] sm:text-[10px] font-bold border border-aqua-teal/50 shadow-xs">
            {badgeText}
          </div>
        )}

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
            {item.size || 'Natural Water'}
          </span>
          <span className="font-bold text-aqua-teal px-1.5 py-0.5 rounded bg-soft-aqua shrink-0">
            100% Pure
          </span>
        </div>
      </div>
    </motion.div>
  );
}
