"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DevPilotLogo } from "@/components/ui/DevPilotLogo";
import { motion, AnimatePresence } from "framer-motion";
import ProductShowcase from "@/components/landing/ProductShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import CoreFeatures from "@/components/landing/CoreFeatures";
import SupportedFormats from "@/components/landing/SupportedFormats";
import WhyDevPilot from "@/components/landing/WhyDevPilot";
import UseCases from "@/components/landing/UseCases";
import AIArchitecture from "@/components/landing/AIArchitecture";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import ScrollNavRail from "@/components/landing/ScrollNavRail";
import ParticleNetwork from "@/components/landing/ParticleNetwork";
/* ─── Navigation Data ─── */
const navLinks = [
  { label: "Why DevPilot?", href: "#why-devpilot" },
  { label: "Features", href: "#features" },
  { label: "Blog", href: "#blog" },
  { label: "Upload Docs", href: "#upload-docs" },
];

/* ─── Floating File Card Data (Upgraded SVG versions) ─── */
const fileCards = [
  {
    type: "TXT",
    color: "text-cyan-400",
    bgAccent: "bg-cyan-500/10",
    borderBase: "border-white/[0.06]",
    borderHover: "border-cyan-400/30",
    shadow: "shadow-[0_4px_20px_rgba(34,211,238,0.02)]",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)]",
    position: "top-[20%] left-[12%]",
    anim: { y: [0, -8, 0], x: [0, 5, 0], rotate: [0, 1.5, -0.5, 0] },
    duration: 8,
    delay: 0.3,
    animDelay: 0,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    type: "MD",
    color: "text-rose-400",
    bgAccent: "bg-rose-500/10",
    borderBase: "border-white/[0.06]",
    borderHover: "border-rose-400/30",
    shadow: "shadow-[0_4px_20px_rgba(251,113,133,0.02)]",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(251,113,133,0.08)]",
    position: "bottom-[25%] left-[18%]",
    anim: { y: [0, 10, 0], x: [0, -4, 0], rotate: [0, -1, 1.5, 0] },
    duration: 9.5,
    delay: 0.35,
    animDelay: 1.2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M10.5 14.5l-2-2-2 2" />
        <path d="M8.5 12.5v5" />
        <path d="M13.5 17.5v-5" />
        <path d="M13.5 12.5h3" />
        <path d="M16.5 12.5c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2h-3" />
      </svg>
    )
  },
  {
    type: "CSV",
    color: "text-emerald-400",
    bgAccent: "bg-emerald-500/10",
    borderBase: "border-white/[0.06]",
    borderHover: "border-emerald-400/30",
    shadow: "shadow-[0_4px_20px_rgba(52,211,153,0.02)]",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(52,211,153,0.08)]",
    position: "top-[30%] right-[15%]",
    anim: { y: [0, -7, 0], x: [0, -6, 0], rotate: [0, -1.5, 0.5, 0] },
    duration: 8.5,
    delay: 0.4,
    animDelay: 0.5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h8" />
        <path d="M8 17h8" />
        <path d="M12 13v4" />
      </svg>
    )
  },
  {
    type: "PDF",
    color: "text-amber-400",
    bgAccent: "bg-amber-500/10",
    borderBase: "border-white/[0.06]",
    borderHover: "border-amber-400/30",
    shadow: "shadow-[0_4px_20px_rgba(251,191,36,0.02)]",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(251,191,36,0.08)]",
    position: "bottom-[20%] right-[20%]",
    anim: { y: [0, 9, 0], x: [0, 5, 0], rotate: [0, 2, -1.5, 0] },
    duration: 10,
    delay: 0.45,
    animDelay: 2.1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15v-4" />
        <path d="M12 15v-4" />
        <path d="M15 15v-4" />
      </svg>
    )
  },
];

/* ─── Easing ─── */
const revealEase = [0.16, 1, 0.3, 1] as const;

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Scroll state */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Close mobile menu on scroll */
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const close = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", close, { once: true });
    return () => window.removeEventListener("scroll", close);
  }, [mobileMenuOpen]);

  return (
    <div className="relative min-h-screen bg-[#050506] text-white selection:bg-white/20 font-sans overflow-hidden">

      {/* ─────────────────────────────────────────
          BACKGROUND: 3 LAYERS OF DEPTH
          ───────────────────────────────────────── */}

      {/* Layer 1: Near-black radial gradient behind headline */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0F1118] via-[#050506] to-[#050506] opacity-80" />

      {/* Layer 2: Interactive AI Particle Network */}
      <ParticleNetwork />

      {/* Layer 3: Fine noise / grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ─────────────────────────────────────────
          VERTICAL SCROLL PROGRESS RAIL
          ───────────────────────────────────────── */}
      <ScrollNavRail />

      {/* ─────────────────────────────────────────
          SECTION 1 · NAVBAR
          ───────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#050506]/70 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link href="/" className="inline-flex">
            <DevPilotLogo animated={true} />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#8B93A1]">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative group hover:text-[#F7F7F8] transition-colors duration-200 py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white/50 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right: Login + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-medium text-white flex items-center gap-1.5 group bg-white/[0.05] hover:bg-white/[0.09] px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200"
            >
              Log in
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-[3px]">→</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-white/70 rounded-full origin-center"
                transition={{ duration: 0.25 }}
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                className="block w-5 h-[1.5px] bg-white/70 rounded-full origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block w-5 h-[1.5px] bg-white/70 rounded-full origin-center"
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: revealEase }}
              className="md:hidden overflow-hidden bg-[#050506]/90 backdrop-blur-xl border-b border-white/[0.06]"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-[15px] font-medium text-[#8B93A1] hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── SECTION 2 · HERO ─── */}
      <div id="hero">
        <section className="relative pt-36 sm:pt-40 pb-28 sm:pb-32 px-6 flex flex-col items-center text-center min-h-[90vh] justify-center z-10">
          {/* Floating File Cards — Desktop only */}
          <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto hidden lg:block">
            {fileCards.map((card) => (
              <motion.div
                key={card.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: card.delay, duration: 0.8 }}
                className={`absolute ${card.position}`}
              >
                <motion.div
                  animate={card.anim}
                  transition={{
                    repeat: Infinity,
                    duration: card.duration,
                    ease: "easeInOut",
                    delay: card.animDelay,
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  className={`group relative flex items-center justify-center w-14 h-14 bg-[#0D0E11] border ${card.borderBase} rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-default pointer-events-auto transition-all duration-300 hover:${card.borderHover} ${card.shadow} ${card.hoverShadow}`}
                >
                  {/* Glow layer on hover */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 ${card.bgAccent} pointer-events-none`} />

                  {/* SVG Icon */}
                  <div className={`${card.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300 relative z-10`}>
                    {card.icon}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#F7F7F8] mb-6 leading-[1.1]">
              <motion.div
                initial={{ y: 24, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4, ease: revealEase }}
                className="overflow-hidden"
              >
                Chat with your documents
              </motion.div>
              <motion.div
                initial={{ y: 24, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.55, ease: revealEase }}
                className="overflow-hidden"
              >
                and codebase{" "}
                <span
                  className="bg-clip-text text-transparent metallic-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #FFFFFF 0%, #AEB4BE 30%, #606773 60%, #D9DDE3 100%)",
                    backgroundSize: "200% 100%",
                  }}
                >
                  instantly
                </span>
              </motion.div>
            </h1>

            {/* Supporting copy */}
            <motion.p
              initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.7, ease: revealEase }}
              className="text-base sm:text-lg text-[#8B93A1] mb-10 max-w-2xl leading-relaxed"
            >
              Upload documents or connect your codebase. Ask questions, trace
              logic, and get precise, source-grounded answers in seconds.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
            >
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F7F7F8] text-[#050506] font-semibold text-[15px] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
              >
                Get started
                <span className="inline-block group-hover:translate-x-[3px] transition-transform duration-300">
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ─── SECTION 3 · PRODUCT SHOWCASE ─── */}
      <div id="showcase">
        <ProductShowcase />
      </div>

      {/* ─── SECTION 4 · HOW IT WORKS ─── */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* ─── SECTION 5 · CORE FEATURES ─── */}
      <div id="features">
        <CoreFeatures />
      </div>

      {/* ─── SECTION 6 · SUPPORTED FORMATS ─── */}
      <div id="formats">
        <SupportedFormats />
      </div>

      {/* ─── SECTION 7 · WHY DEVPILOT ─── */}
      <div id="why-devpilot">
        <WhyDevPilot />
      </div>

      {/* ─── SECTION 8 · USE CASES ─── */}
      <div id="use-cases">
        <UseCases />
      </div>

      {/* ─── SECTION 9 · AI ARCHITECTURE ─── */}
      <div id="architecture">
        <AIArchitecture />
      </div>

      {/* ─── SECTION 10 · FINAL CTA ─── */}
      <div id="cta">
        <FinalCTA />
      </div>

      {/* ─── SECTION 11 · FOOTER ─── */}
      <Footer />
    </div>
  );
}
