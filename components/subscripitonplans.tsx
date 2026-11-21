'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Check, Package, Sparkles, RotateCw } from 'lucide-react';
import {
  fetchActiveSubscriptionPlans,
  SubscriptionPlan,
} from '@/lib/subscripitonplansStore';

export default function SubscriptionPlansSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadPlans() {
      try {
        const data = await fetchActiveSubscriptionPlans();
        if (mounted) {
          setPlans(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    loadPlans();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="subscription-plans"
      className="relative bg-pure-white py-10 sm:py-14 md:py-20 border-b border-pale-blue-gray overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-aqua border border-pale-blue-gray mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-aqua-teal" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-deep-navy">
              Flexible Hydration Plans
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-deep-navy tracking-tight leading-tight">
            Subscription <span className="text-aqua-teal">Plans</span>
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
            Choose a plan tailored to your daily hydration needs. Hover or tap any card to see what&apos;s included.
          </p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="h-[380px] rounded-2xl bg-soft-aqua/40 border-2 border-pale-blue-gray animate-pulse"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="max-w-md mx-auto text-center rounded-2xl bg-soft-aqua/50 border-2 border-pale-blue-gray p-8">
            <Package className="w-10 h-10 text-aqua-teal mx-auto mb-2" />
            <p className="text-sm sm:text-base font-bold text-deep-navy">
              Subscription plans coming soon
            </p>
            <p className="text-xs text-deep-navy/70 mt-1">
              Check back shortly for our flexible hydration subscription packages.
            </p>
          </div>
        ) : (
          /* 3 Columns on Desktop, 1 Column on Mobile */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => {
              const isFlipped = flippedId === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: (index % 3) * 0.08,
                    ease: 'easeOut',
                  }}
                  onClick={() =>
                    setFlippedId((prev) => (prev === plan.id ? null : plan.id))
                  }
                  className="group [perspective:1200px] h-[380px] sm:h-[400px] cursor-pointer select-none"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 ease-out [transform-style:preserve-3d] ${
                      isFlipped
                        ? '[transform:rotateY(180deg)]'
                        : 'md:group-hover:[transform:rotateY(180deg)]'
                    }`}
                  >
                    {/* FRONT FACE: Image, Name, Actual Price, Selling Price */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-pure-white border-2 border-pale-blue-gray overflow-hidden shadow-xs group-hover:border-aqua-teal transition-colors flex flex-col">
                      <div className="relative w-full h-52 sm:h-56 bg-soft-aqua/60 overflow-hidden shrink-0">
                        {plan.image_url ? (
                          <Image
                            src={plan.image_url}
                            alt={plan.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-soft-aqua">
                            <Package className="w-14 h-14 text-aqua-teal" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between bg-pure-white">
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-deep-navy leading-snug line-clamp-2">
                            {plan.name}
                          </h3>

                          <div className="mt-3 flex items-baseline gap-2.5">
                            <span className="text-2xl sm:text-3xl font-black text-aqua-teal">
                              ₹{plan.selling_price}
                            </span>
                            {plan.actual_price > 0 && (
                              <span className="text-sm sm:text-base font-semibold text-deep-navy/45 line-through">
                                ₹{plan.actual_price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-pale-blue-gray flex items-center justify-between text-xs font-semibold text-deep-navy/60">
                          <span>Hover or tap to view includes</span>
                          <RotateCw className="w-3.5 h-3.5 text-aqua-teal" />
                        </div>
                      </div>
                    </div>

                    {/* BACK FACE: Includes with Tick */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-deep-navy text-pure-white border-2 border-aqua-teal p-6 flex flex-col justify-between shadow-md">
                      <div className="flex flex-col h-full overflow-hidden">
                        <div className="pb-3 border-b border-pure-white/15 flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-aqua-teal block">
                              Plan Includes
                            </span>
                            <h3 className="text-lg sm:text-xl font-black text-pure-white leading-snug mt-0.5 line-clamp-1">
                              {plan.name}
                            </h3>
                          </div>
                          <span className="text-lg font-black text-aqua-teal shrink-0">
                            ₹{plan.selling_price}
                          </span>
                        </div>

                        <ul className="mt-4 space-y-2.5 overflow-y-auto flex-1 pr-1">
                          {plan.includes.length > 0 ? (
                            plan.includes.map((feature, fIdx) => (
                              <li
                                key={`${plan.id}-inc-${fIdx}`}
                                className="flex items-start gap-2.5 text-sm text-pure-white/90 leading-snug"
                              >
                                <span className="mt-0.5 w-5 h-5 rounded-full bg-aqua-teal/20 border border-aqua-teal/50 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-emerald-mint stroke-[3]" />
                                </span>
                                <span>{feature}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-pure-white/70 italic">
                              Pure PlyAqua hydration benefits included.
                            </li>
                          )}
                        </ul>

                        <div className="pt-3 mt-3 border-t border-pure-white/15 flex items-center justify-between text-[11px] font-semibold text-pure-white/60">
                          <span>PlyAqua Subscription</span>
                          {plan.actual_price > 0 && (
                            <span className="line-through">₹{plan.actual_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
