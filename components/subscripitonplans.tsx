'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { Check, Droplets, Package, Sparkles, Tag } from 'lucide-react';
import {
  fetchActiveSubscriptionPlans,
  SubscriptionPlan,
} from '@/lib/subscripitonplansStore';

function PlanShowcaseRow({
  plan,
  index,
  imageOnRight,
  compactMobile = false,
}: {
  plan: SubscriptionPlan;
  index: number;
  imageOnRight: boolean;
  compactMobile?: boolean;
}) {
  const hasDiscount =
    plan.actual_price > plan.selling_price && plan.actual_price > 0;
  const discountPercent = hasDiscount
    ? Math.round(
        ((plan.actual_price - plan.selling_price) / plan.actual_price) * 100
      )
    : 0;
  const savingsAmount = hasDiscount
    ? Math.round(plan.actual_price - plan.selling_price)
    : 0;

  const planNumber = String(index + 1).padStart(2, '0');

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 items-center gap-5 sm:gap-7 md:gap-10 lg:gap-12 rounded-3xl border-2 border-transparent hover:border-aqua-teal p-3.5 sm:p-5 md:p-7 transition-all duration-300">
      {/* Image Side */}
      <div
        className={`relative md:col-span-6 w-full ${
          imageOnRight ? 'md:order-2' : 'md:order-1'
        }`}
      >
        <div
          className={`relative w-full overflow-hidden rounded-2xl border border-pale-blue-gray/80 bg-soft-aqua/40 ${
            compactMobile
              ? 'h-48 sm:h-60'
              : 'aspect-[4/3] sm:aspect-[16/11]'
          }`}
        >
          {plan.image_url ? (
            <Image
              src={plan.image_url}
              alt={plan.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-soft-aqua via-pure-white to-pale-blue-gray/60">
              <Package className="w-14 h-14 text-aqua-teal mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-deep-navy/50">
                PlyAqua Plan
              </span>
            </div>
          )}

          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/45 via-transparent to-transparent pointer-events-none" />

          {/* Top-Left Plan Number Pill */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-deep-navy/85 backdrop-blur-xs text-pure-white text-[10px] sm:text-xs font-black tracking-wider border border-pure-white/15">
            PLAN {planNumber}
          </div>

          {/* Top-Right Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-aqua-teal text-pure-white text-[10px] sm:text-xs font-black tracking-wide shadow-sm">
              {discountPercent}% OFF
            </div>
          )}

          {/* Bottom-Left Pure Hydration Tag */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pure-white/90 backdrop-blur-xs text-deep-navy text-[10px] sm:text-xs font-bold shadow-xs">
            <Droplets className="w-3 h-3 text-aqua-teal" />
            <span>Scheduled Hydration</span>
          </div>
        </div>
      </div>

      {/* Content Side: Name, Price Details, and Tags (No card container, No flip) */}
      <div
        className={`md:col-span-6 flex flex-col justify-center space-y-4 ${
          imageOnRight ? 'md:order-1' : 'md:order-2'
        }`}
      >
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-soft-aqua border border-aqua-teal/25 text-aqua-teal text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Subscription Package</span>
        </div>

        {/* Plan Name */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-deep-navy tracking-tight leading-tight group-hover:text-aqua-teal transition-colors duration-200">
          {plan.name}
        </h3>

        {/* Price Details */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-deep-navy tracking-tight">
              ₹{plan.selling_price.toLocaleString('en-IN')}
            </span>
            {plan.actual_price > 0 && (
              <span className="text-base sm:text-lg font-bold text-deep-navy/40 line-through">
                ₹{plan.actual_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {savingsAmount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-mint/15 text-deep-navy border border-emerald-mint/40 text-xs font-extrabold">
              <Tag className="w-3 h-3 text-aqua-teal" />
              <span>Save ₹{savingsAmount.toLocaleString('en-IN')}</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-aqua-teal/50 via-pale-blue-gray to-transparent" />

        {/* Included Tags */}
        {plan.includes.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-deep-navy/60 block">
              What&apos;s Included
            </span>
            <div className="flex flex-wrap gap-2">
              {plan.includes.map((feature, fIdx) => (
                <span
                  key={`${plan.id}-tag-${fIdx}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-soft-aqua/80 border border-pale-blue-gray group-hover:border-aqua-teal/40 text-xs sm:text-sm font-semibold text-deep-navy transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-aqua-teal text-pure-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{feature}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionPlansSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileRunwayRef = useRef<HTMLDivElement | null>(null);

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

  const { scrollYProgress } = useScroll({
    target: mobileRunwayRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (plans.length <= 1) return;
    const clamped = Math.max(0, Math.min(0.9999, latest));
    const nextIndex = Math.min(
      plans.length - 1,
      Math.floor(clamped * plans.length)
    );
    setActiveMobileIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
  });

  const safeMobileIndex =
    plans.length > 0 ? Math.min(activeMobileIndex, plans.length - 1) : 0;

  return (
    <section
      id="subscription-plans"
      className="relative bg-pure-white py-12 sm:py-16 md:py-24 border-b border-pale-blue-gray overflow-x-clip"
    >
      {/* Ambient Background Accents */}
      <div className="absolute top-16 left-0 w-72 h-72 bg-soft-aqua/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-16 right-0 w-72 h-72 bg-soft-aqua/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-soft-aqua border border-pale-blue-gray mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-aqua-teal" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-deep-navy">
              Flexible Hydration Plans
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-deep-navy tracking-tight leading-tight">
            Subscription <span className="text-aqua-teal">Plans</span>
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-deep-navy/80 font-normal leading-relaxed">
            Seamless pure water delivery tailored to your home, office, or daily routine.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="h-64 rounded-3xl bg-soft-aqua/30 animate-pulse"
              />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="max-w-md mx-auto text-center rounded-2xl border-2 border-pale-blue-gray p-8">
            <Package className="w-10 h-10 text-aqua-teal mx-auto mb-2" />
            <p className="text-sm sm:text-base font-bold text-deep-navy">
              Subscription plans coming soon
            </p>
            <p className="text-xs text-deep-navy/70 mt-1">
              Check back shortly for our flexible hydration subscription packages.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW: Alternating Left/Right Image & Content directly on background with hover border */}
            <div className="hidden md:flex flex-col gap-10 lg:gap-14">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <PlanShowcaseRow
                    plan={plan}
                    index={index}
                    imageOnRight={index % 2 === 1}
                  />
                </motion.div>
              ))}
            </div>

            {/* MOBILE VIEW: Sticky in-place scroll-driven transition (next plan animates in at same spot) */}
            <div
              ref={mobileRunwayRef}
              className="md:hidden relative"
              style={{
                height: plans.length > 1 ? `${plans.length * 80}vh` : 'auto',
              }}
            >
              <div
                className={
                  plans.length > 1
                    ? 'sticky top-16 min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-4'
                    : 'py-2'
                }
              >
                {plans.length > 1 && (
                  <div className="flex items-center justify-between px-3 mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-aqua-teal">
                      Plan {String(safeMobileIndex + 1).padStart(2, '0')} of{' '}
                      {String(plans.length).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {plans.map((p, idx) => (
                        <span
                          key={p.id}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === safeMobileIndex
                              ? 'w-6 bg-aqua-teal'
                              : 'w-1.5 bg-pale-blue-gray'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={plans[safeMobileIndex].id}
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -28, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <PlanShowcaseRow
                      plan={plans[safeMobileIndex]}
                      index={safeMobileIndex}
                      imageOnRight={false}
                      compactMobile
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
