"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { DevPilotLogo } from "./ui/DevPilotLogo";
import { motion } from "framer-motion";
import ParticleNetwork from "@/components/landing/ParticleNetwork";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

/* ─── Easing for smooth animations ─── */
const revealEase = [0.16, 1, 0.3, 1] as const;

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#050506] text-white selection:bg-white/20 font-sans overflow-hidden flex flex-col items-center justify-center p-6">

      {/* ─────────────────────────────────────────
          BACKGROUND: 4 LAYERS OF DEPTH
          ───────────────────────────────────────── */}

      {/* Layer 1: Near-black radial gradient behind panel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0F1118] via-[#050506] to-[#050506] opacity-90 pointer-events-none" />

      {/* Layer 2: Interactive AI Particle Network */}
      <ParticleNetwork />

      {/* Layer 3: Fine noise / grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 3: Faint document symbols for ambient intelligence */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.04 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute text-white font-mono text-sm tracking-widest"
        >
          {/* Top Left */}
          <div className="absolute top-[15%] left-[10%]">{'</>'}</div>
          <div className="absolute top-[25%] left-[15%]">{'PDF'}</div>
          {/* Bottom Right */}
          <div className="absolute bottom-[20%] right-[12%]">{'{ }'}</div>
          <div className="absolute bottom-[10%] right-[18%]">{'MD'}</div>
          {/* Top Right */}
          <div className="absolute top-[20%] right-[15%]">{'CSV'}</div>
          {/* Bottom Left */}
          <div className="absolute bottom-[15%] left-[12%]">{'TXT'}</div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────
          BACK TO HOME CONTROL
          ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: revealEase }}
        className="absolute top-8 left-8 z-50"
      >
        <Link
          href="/"
          className="group flex items-center gap-2 text-[13px] font-medium text-[#8B93A1] hover:text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md py-1 px-2 -ml-2"
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </span>
          Back to home
        </Link>
      </motion.div>

      {/* ─────────────────────────────────────────
          AUTH CONTENT CONTAINER
          ───────────────────────────────────────── */}
      <div className="w-full max-w-[400px] z-10 flex flex-col relative">

        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: revealEase }}
          >
            <Link href="/" className="inline-flex mb-8 outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-md p-1">
              <DevPilotLogo />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: revealEase }}
            className="text-[26px] font-bold text-[#F7F7F8] tracking-tight mb-2 leading-tight"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: revealEase }}
            className="text-[14.5px] text-[#8B93A1] leading-relaxed max-w-[320px]"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Metallic Auth Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)", scale: 0.985 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 0.65, delay: 0.45, ease: revealEase }}
          className="relative bg-[#0B0C0F] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        >
          {/* Extremely subtle top-edge highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent rounded-t-2xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {children}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

