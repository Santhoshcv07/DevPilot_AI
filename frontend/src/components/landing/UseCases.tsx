"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/* ─── Data ─── */

const useCases = [
  {
    title: "Onboarding Engineers",
    description:
      "New hires spend weeks trying to understand a massive, undocumented codebase. With DevPilot, they can ask questions about architecture, find where specific features are implemented, and start contributing in days.",
    tag: "Productivity",
    imagePlaceholder: (
      <div className="w-full h-full bg-[#12141A] flex items-center justify-center border border-white/[0.04]">
        <div className="flex flex-col gap-3 w-3/4 opacity-40">
          <div className="h-4 bg-[#8B93A1]/30 rounded w-full" />
          <div className="h-4 bg-[#8B93A1]/30 rounded w-5/6" />
          <div className="h-4 bg-[#8B93A1]/30 rounded w-4/6" />
        </div>
      </div>
    ),
  },
  {
    title: "Legacy Code Migration",
    description:
      "Refactoring old services is risky when the original authors have left. DevPilot traces dependencies, explains complex legacy logic, and helps you safely plan migrations without breaking existing functionality.",
    tag: "Refactoring",
    imagePlaceholder: (
      <div className="w-full h-full bg-[#12141A] flex items-center justify-center border border-white/[0.04]">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-[2px] border-[#8B93A1]/20 rounded-full border-t-[#F7F7F8]/40 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-4 border-[2px] border-[#8B93A1]/10 rounded-full border-b-[#8B93A1]/30 animate-[spin_3s_linear_infinite_reverse]" />
        </div>
      </div>
    ),
  },
  {
    title: "Incident Response",
    description:
      "When production goes down, every minute counts. Instead of manually searching through logs and repos, ask DevPilot to instantly surface the relevant commits, error handlers, or configuration files related to the issue.",
    tag: "Debugging",
    imagePlaceholder: (
      <div className="w-full h-full bg-[#12141A] flex flex-col items-center justify-center border border-white/[0.04] p-8 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5F57]/20 to-transparent"
          />
        ))}
        <div className="font-mono text-[10px] text-[#FF5F57]/40 mt-4 tracking-widest uppercase">
          System Alert
        </div>
      </div>
    ),
  },
];

const revealEase = [0.16, 1, 0.3, 1] as const;

/* ─── Component ─── */

export default function UseCases() {
  return (
    <section id="use-cases" className="relative section-padding px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: revealEase }}
          className="text-center mb-16 sm:mb-24"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8B93A1]/70 mb-4">
            Solutions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F7F7F8]">
            Built for engineering teams
          </h2>
        </motion.div>

        {/* Alternating list */}
        <div className="space-y-24 sm:space-y-32">
          {useCases.map((useCase, i) => {
            const isEven = i % 2 === 0;

            return (
              <div
                key={useCase.title}
                className={`flex flex-col gap-10 md:gap-16 items-center ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Visual side */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: revealEase }}
                  className="w-full md:w-1/2 aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#0A0B0F] border border-white/[0.06] relative"
                >
                  {useCase.imagePlaceholder}
                  
                  {/* Subtle corner gradients */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/[0.02] blur-2xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/[0.02] blur-2xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />
                </motion.div>

                {/* Content side */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease: revealEase,
                  }}
                  className="w-full md:w-1/2 flex flex-col items-start"
                >
                  <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5">
                    <span className="text-[11px] font-medium tracking-wide uppercase text-[#8B93A1]">
                      {useCase.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#F7F7F8] mb-4">
                    {useCase.title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-[#8B93A1] leading-[1.7] max-w-md">
                    {useCase.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
