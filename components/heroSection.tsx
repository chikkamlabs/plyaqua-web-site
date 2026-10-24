'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gamepad2,
  Handshake,
  Droplets,
  Sparkles,
  ShieldCheck,
  Waves,
  PartyPopper,
  RotateCcw,
} from 'lucide-react';

export default function HeroSection() {
  // Intro Bottle Animation Stages: 'entering' -> 'opening' -> 'closing' -> 'done'
  const [introStage, setIntroStage] = useState<'entering' | 'opening' | 'closing' | 'done'>('entering');
  const [contentVisible, setContentVisible] = useState(false);

  // Marquee interactions
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileTapped, setIsMobileTapped] = useState(false);

  // Cycling words: "More Water", "More Fun", "More Play"
  const funWords = [
    { text: 'More Water', color: 'text-aqua-teal' },
    { text: 'More Fun', color: 'text-sunburst-yellow' },
    { text: 'More Play', color: 'text-emerald-mint' },
  ];
  const [funWordIndex, setFunWordIndex] = useState(0);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setFunWordIndex((prev) => (prev + 1) % funWords.length);
    }, 2000);
    return () => clearInterval(wordTimer);
  }, [funWords.length]);

  // Sequence the initial water bottle intro animation
  useEffect(() => {
    // 0.0s - 0.9s: Bottle enters and moves to center
    const timerOpen = setTimeout(() => {
      setIntroStage('opening'); // Cap opens with animation
    }, 900);

    // 0.9s - 2.1s: Cap is open, mist droplets emit
    const timerClose = setTimeout(() => {
      setIntroStage('closing'); // Cap closes back down
    }, 2100);

    // 2.1s - 2.8s: Intro finishes and main hero content transitions in
    const timerDone = setTimeout(() => {
      setIntroStage('done');
      setContentVisible(true);
    }, 2800);

    return () => {
      clearTimeout(timerOpen);
      clearTimeout(timerClose);
      clearTimeout(timerDone);
    };
  }, []);

  // Navigate to Partner Tab in ContactUs
  const handlePartnerNavigate = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('plyaqua:contact-tab', { detail: 'partner' })
      );
      const contactEl = document.getElementById('contact-us');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Replay bottle animation
  const handleReplayIntro = () => {
    setContentVisible(false);
    setIntroStage('entering');
    setTimeout(() => setIntroStage('opening'), 800);
    setTimeout(() => setIntroStage('closing'), 2000);
    setTimeout(() => {
      setIntroStage('done');
      setContentVisible(true);
    }, 2700);
  };

  // Mobile Marquee Tap handler
  const handleMarqueeTap = () => {
    setIsMobileTapped(true);
    setTimeout(() => setIsMobileTapped(false), 1200);
  };

  // Marquee segments: More Water (water symbol), More Fun (Fun symbol), More Play (Play symbol)
  const marqueeSegments = [
    { title: 'More Water', icon: Droplets, color: 'text-aqua-teal' },
    { title: 'More Fun', icon: Sparkles, color: 'text-sunburst-yellow' },
    { title: 'More Play', icon: Gamepad2, color: 'text-emerald-mint' },
  ];
  // Repeat to ensure seamless infinite scroll
  const marqueeList = Array(5).fill(marqueeSegments).flat();

  return (
    <section id="hero" className="relative overflow-hidden bg-soft-aqua pt-8 sm:pt-12 md:pt-16 lg:pt-20 border-b border-pale-blue-gray">
      
      {/* Animated Aqua Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-aqua-teal/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 -right-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-aqua-teal/20 blur-3xl"
        />
      </div>

      {/* =========================================================================
          INTRO ANIMATION: REALISTIC PLASTIC WATER BOTTLE WITH REAL CAP
          - Transparent background
          - Realistic PET bottle body, screw threads, support collar & ribbed cap
          - Real label (/label1.png)
      ========================================================================= */}
      <AnimatePresence>
        {introStage !== 'done' && (
          <motion.div
            key="bottle-intro-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent px-4 pointer-events-auto"
          >
            {/* Skip intro button */}
            <button
              type="button"
              onClick={() => {
                setIntroStage('done');
                setContentVisible(true);
              }}
              className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-deep-navy/80 hover:bg-deep-navy text-pure-white text-xs font-bold border border-pure-white/20 backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              Skip Intro ✕
            </button>

            {/* Central Water Bottle Object */}
            <motion.div
              initial={{ y: 80, scale: 0.7, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative flex flex-col items-center select-none filter drop-shadow-[0_20px_35px_rgba(11,37,58,0.35)]"
            >
              {/* Animated Floating Bubbles / Splash when cap opens */}
              <AnimatePresence>
                {introStage === 'opening' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: -45, scale: 1.2 }}
                    exit={{ opacity: 0, y: -75 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-16 z-30 flex items-center gap-2 pointer-events-none"
                  >
                    <Droplets className="w-6 h-6 text-aqua-teal animate-bounce" />
                    <Sparkles className="w-5 h-5 text-sunburst-yellow animate-spin" />
                    <Droplets className="w-4 h-4 text-emerald-mint" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Realistic Plastic PET Bottle Structure */}
              <div className="relative flex flex-col items-center">
                
                {/* 1. REAL PLASTIC TWIST CAP (With vertical grip ridges & tamper ring) */}
                <motion.div
                  animate={
                    introStage === 'opening'
                      ? { y: -42, rotate: -35, scale: 1.05 }
                      : { y: 0, rotate: 0, scale: 1 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="relative z-20 flex flex-col items-center"
                >
                  {/* Cap Crown / Top Dome with Beveled Rim */}
                  <div className="w-14 h-7 rounded-t-lg bg-gradient-to-r from-aqua-teal via-[#16CEC4] to-[#0E9F97] border-t-2 border-x-2 border-pure-white/60 shadow-md flex items-center justify-center relative overflow-hidden">
                    {/* Top Grip Ridges Texture */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 1.5px, transparent 1.5px, transparent 4px)',
                      }}
                    />
                    {/* Gloss Shine Strip */}
                    <div className="absolute top-1 left-2 right-2 h-1 bg-pure-white/50 rounded-full" />
                  </div>

                  {/* Cap Tamper-Evident Security Ring (With micro connector notches) */}
                  <div className="w-13.5 h-2.5 bg-gradient-to-r from-aqua-teal to-[#0E9F97] border-b-2 border-x-2 border-pure-white/50 rounded-b-xs shadow-xs flex justify-around items-center px-1">
                    <div className="w-1 h-0.5 bg-pure-white/50 rounded-xs" />
                    <div className="w-1 h-0.5 bg-pure-white/50 rounded-xs" />
                    <div className="w-1 h-0.5 bg-pure-white/50 rounded-xs" />
                  </div>
                </motion.div>

                {/* 2. TRANSPARENT PET NECK & SCREW THREADS */}
                <div className="w-10 h-7 bg-pure-white/50 border-x-2 border-pure-white/80 backdrop-blur-[2px] flex flex-col justify-around items-center relative z-10 -mt-0.5 shadow-inner">
                  {/* Real Spiral Screw Thread Ridges */}
                  <div className="w-full h-0.5 bg-pure-white/80 shadow-xs" />
                  <div className="w-full h-0.5 bg-pure-white/70 shadow-xs" />
                  <div className="w-full h-0.5 bg-pure-white/60 shadow-xs" />
                </div>

                {/* Support Collar Ring Flange (Found on real PET bottles) */}
                <div className="w-13 h-2 rounded-full bg-pure-white/70 border border-pure-white/90 shadow-xs z-10 -mt-0.5" />

                {/* 3. TAPERED PET SHOULDERS (With realistic glassy refraction & gloss highlights) */}
                <div className="w-48 h-14 bg-gradient-to-b from-pure-white/50 via-soft-aqua/40 to-pure-white/60 border-t-2 border-x-2 border-pure-white/80 rounded-t-[44px] shadow-sm relative overflow-hidden backdrop-blur-[2px] -mt-0.5">
                  {/* Specular White Glassy Reflection Highlights */}
                  <div className="absolute left-4 top-0 bottom-0 w-3.5 bg-gradient-to-r from-pure-white/80 to-transparent blur-[0.5px]" />
                  <div className="absolute right-5 top-0 bottom-0 w-1.5 bg-pure-white/60 blur-[0.5px]" />
                  {/* Subtle water meniscus in shoulder */}
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-aqua-teal/10" />
                </div>

                {/* 4. MAIN CONTOURED PLASTIC BODY WITH REAL LABEL (public/label1.png) */}
                <div className="w-52 sm:w-60 h-68 sm:h-74 bg-gradient-to-r from-pure-white/60 via-soft-aqua/30 to-pure-white/70 border-x-2 border-pure-white/80 shadow-2xl relative flex flex-col items-center justify-between py-2 overflow-hidden backdrop-blur-[2px]">
                  {/* Long Vertical Specular Reflection Glare */}
                  <div className="absolute left-4 top-0 bottom-0 w-4 bg-gradient-to-r from-pure-white/75 to-transparent blur-[1px] z-10 pointer-events-none" />
                  <div className="absolute right-6 top-0 bottom-0 w-2 bg-pure-white/50 blur-[0.5px] z-10 pointer-events-none" />

                  {/* Ergonomic PET Rib Groove (Top) */}
                  <div className="w-[94%] h-1.5 rounded-full bg-aqua-teal/15 border-y border-pure-white/40 z-10" />

                  {/* Water Interior Gradient & Subtle Light Shimmer */}
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-aqua-teal/20 via-soft-aqua/25 to-transparent pointer-events-none" />

                  {/* REAL WATER BOTTLE LABEL (public/label1.png) */}
                  <div className="relative w-[92%] h-[82%] rounded-xl overflow-hidden border-2 border-aqua-teal/40 shadow-xl bg-pure-white z-10">
                    <Image
                      src="/label1.png"
                      alt="PlyAqua Official Packaged Drinking Water Label"
                      fill
                      sizes="(max-width: 640px) 240px, 280px"
                      className="object-cover"
                      priority
                      referrerPolicy="no-referrer"
                    />
                    {/* Cylinder curvature gloss sheen over label */}
                    <div className="absolute inset-0 bg-gradient-to-r from-pure-white/20 via-transparent to-deep-navy/15 pointer-events-none" />
                  </div>

                  {/* Ergonomic PET Rib Groove (Bottom) */}
                  <div className="w-[94%] h-1.5 rounded-full bg-aqua-teal/15 border-y border-pure-white/40 z-10" />
                </div>

                {/* 5. PETALOD RIBBED BASE (Real 5-foot plastic bottle base) */}
                <div className="w-52 sm:w-60 h-11 bg-gradient-to-t from-pure-white/80 via-soft-aqua/60 to-pure-white/60 border-b-3 border-x-2 border-pure-white/80 rounded-b-3xl shadow-xl relative overflow-hidden">
                  <div className="flex justify-around items-center h-full px-5">
                    <div className="w-3 h-7 bg-aqua-teal/30 rounded-full shadow-inner" />
                    <div className="w-3 h-8 bg-aqua-teal/40 rounded-full shadow-inner" />
                    <div className="w-3 h-7 bg-aqua-teal/30 rounded-full shadow-inner" />
                    <div className="w-3 h-8 bg-aqua-teal/40 rounded-full shadow-inner" />
                    <div className="w-3 h-7 bg-aqua-teal/30 rounded-full shadow-inner" />
                  </div>
                </div>
              </div>

              {/* Status caption during animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-navy/85 border border-aqua-teal/40 text-aqua-teal text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                  <Droplets className="w-4 h-4 text-aqua-teal" />
                  <span>
                    {introStage === 'entering' && 'Opening Fresh PlyAqua...'}
                    {introStage === 'opening' && 'Cap Opened • Crystal Freshness!'}
                    {introStage === 'closing' && 'Pure Mineral Sealed • Welcome!'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          HERO MAIN CONTENT SECTION
      ========================================================================= */}
      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 md:mb-16 transition-opacity duration-700 ${
        contentVisible || introStage === 'done' ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center text-left"
          >
            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
              {/* Tag 1: Pure Packaged Drinking Water */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pure-white border border-pale-blue-gray shadow-xs">
                <Droplets className="w-4 h-4 text-aqua-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-deep-navy">
                  Pure Packaged Drinking Water
                </span>
              </div>
            </div>

            {/* Main Headline: More Water, More Fun, More Play displayed one after one with basic animation */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-deep-navy tracking-tight leading-tight">
              Pure Water For Every Occasion,{' '}
              <span className="block mt-1 min-h-[1.25em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={funWords[funWordIndex].text}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`inline-block font-black ${funWords[funWordIndex].color}`}
                  >
                    {funWords[funWordIndex].text}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Description: Full on desktop; Single line on mobile */}
            <p className="hidden sm:block mt-4 sm:mt-5 text-base sm:text-lg text-deep-navy/80 font-normal leading-relaxed">
              Experience the crystal clarity of PlyAqua packaged drinking water.
              Sustainably sourced, multi-stage filtered, and enriched with essential
              minerals. Perfect for family celebrations, corporate events, daily
              hydration, and outdoor adventures.
            </p>
            <p className="sm:hidden mt-2 text-sm text-deep-navy/80 font-normal leading-snug line-clamp-1">
              Pure mineral-enriched packaged drinking water for every occasion &amp; celebration.
            </p>

            {/* MOBILE PICK-UP IMAGE: Shown right here on mobile so it is picked up before CTAs! */}
            <div className="lg:hidden mt-4 mb-2">
              <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-pure-white border-2 border-pale-blue-gray shadow-md">
                <Image
                  src="/plyaqua_hero1.png"
                  alt="PlyAqua Pure Packaged Drinking Water Bottle"
                  fill
                  sizes="100vw"
                  className="object-contain p-2"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Highlights Bar */}
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-pure-white border border-pale-blue-gray shadow-xs">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-deep-navy">100% Pure</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-pure-white border border-pale-blue-gray shadow-xs">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-deep-navy">Minerals</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-pure-white border border-pale-blue-gray shadow-xs">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-deep-navy">Eco Pack</span>
              </div>
            </div>

            {/* CTA Buttons: Single row 2 columns on mobile! Responsive on all sizes */}
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:items-center sm:gap-4 w-full">
              {/* 1. Play game -> redirects to app/gameplay/page.tsx */}
              <Link
                href="/gameplay"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 rounded-full bg-aqua-teal hover:bg-deep-navy text-pure-white font-bold text-xs sm:text-base shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-pure-white" />
                <span>Play Game</span>
              </Link>

              {/* 2. Be a Partner -> redirects to contactus.tsx section */}
              <button
                type="button"
                onClick={handlePartnerNavigate}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 rounded-full bg-pure-white text-deep-navy border-2 border-aqua-teal font-bold text-xs sm:text-base hover:bg-soft-aqua active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-aqua-teal" />
                <span>Be a Partner</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Desktop Packaging Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hidden lg:flex lg:col-span-6 justify-center items-center relative"
          >
            <div className="relative w-full max-w-lg aspect-4/3 rounded-3xl overflow-hidden bg-pure-white border-2 border-pale-blue-gray shadow-xl group">
              <Image
                src="/plyaqua_hero1.png"
                alt="PlyAqua Pure Packaged Drinking Water - More Water More Play"
                fill
                sizes="50vw"
                className="object-contain p-4 group-hover:scale-102 transition-transform duration-500"
                priority
                referrerPolicy="no-referrer"
              />
              {/* Subtle Aqua Rim Light */}
              <div className="absolute inset-0 rounded-3xl border border-aqua-teal/20 pointer-events-none" />

              {/* Replay Bottle Intro Button */}
              <button
                type="button"
                onClick={handleReplayIntro}
                title="Replay Bottle Opening Animation"
                className="absolute top-4 right-4 p-2 rounded-full bg-pure-white/90 border border-pale-blue-gray hover:bg-soft-aqua text-deep-navy transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-aqua-teal" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* =========================================================================
          SCROLLING LINE AT BOTTOM (MARQUEE)
          - Increased size of bottom line (height, padding, typography & icons)
          - Small wave transition when hover or tap
          - Normal font (no cursive)
      ========================================================================= */}
      <div
        onClick={handleMarqueeTap}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full overflow-hidden border-t-2 border-pale-blue-gray bg-pure-white/95 backdrop-blur-md py-6 sm:py-7 md:py-8 select-none cursor-pointer transition-colors duration-300"
      >
        {/* Animated Wave Transition Overlay on Hover or Tap */}
        <AnimatePresence>
          {(isHovered || isMobileTapped) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            >
              {/* Flowing Water Wave SVG */}
              <motion.div
                initial={{ x: '0%' }}
                animate={{ x: '-50%' }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: 'linear',
                }}
                className="w-[200%] h-full flex opacity-30"
              >
                <svg
                  className="w-1/2 h-full text-aqua-teal fill-current"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 C150,90 350,-40 500,40 C650,110 900,10 1200,50 L1200,120 L0,120 Z" />
                </svg>
                <svg
                  className="w-1/2 h-full text-aqua-teal fill-current"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 C150,90 350,-40 500,40 C650,110 900,10 1200,50 L1200,120 L0,120 Z" />
                </svg>
              </motion.div>
              {/* Aqua light gradient wash */}
              <div className="absolute inset-0 bg-gradient-to-r from-soft-aqua/60 via-aqua-teal/15 to-soft-aqua/60" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Marquee Infinite Scrolling Track */}
        <div className="relative z-10 flex w-fit">
          <motion.div
            animate={
              isHovered
                ? false
                : {
                    x: ['0%', '-50%'],
                  }
            }
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: isMobileTapped ? 14 : 24, // responsive speed
                ease: 'linear',
              },
            }}
            className="flex items-center gap-10 sm:gap-16 whitespace-nowrap pl-4 pr-16"
          >
            {marqueeList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-4 sm:gap-5 transition-transform duration-300 hover:scale-105"
                >
                  {/* Symbol / Icon with bounce wave animation */}
                  <motion.div
                    animate={
                      isMobileTapped || isHovered
                        ? {
                            y: [-5, 5, -5],
                            rotate: [-8, 8, -8],
                            scale: [1, 1.2, 1],
                          }
                        : { y: 0, rotate: 0, scale: 1 }
                    }
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="shrink-0 p-2 sm:p-2.5 rounded-full bg-soft-aqua border-2 border-aqua-teal/40 shadow-xs"
                  >
                    <IconComp className={`w-6 h-6 sm:w-8 sm:h-8 ${item.color}`} />
                  </motion.div>

                  {/* Increased Size Text */}
                  <span className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-deep-navy drop-shadow-xs">
                    {item.title}
                  </span>

                  {/* Separator dot */}
                  <span className="text-aqua-teal font-black text-2xl sm:text-3xl">•</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
